import { NextApiRequest, NextApiResponse } from "next";

import {
  InvokeEndpointWithResponseStreamCommandOutput,
  SageMakerRuntimeClient,
} from "@aws-sdk/client-sagemaker-runtime";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
};
const aws_region = process.env.AWS_REGION!;

console.log("aws_region: ", process.env.AWS_REGION!);
console.log("AWS_ACCESS_KEY: ", process.env.AWS_ACCESS_KEY!);
console.log("AWS_SECRET_ACCESS_KEY: ", process.env.AWS_SECRET_ACCESS_KEY!);

const sageMaker = new SageMakerRuntimeClient({
  region: aws_region,
  credentials,
});
class SendStreamController {
  bedrock = sageMaker;
  constructor() {}

  async createContext(query: string) {
    try {
      // Step 1: Call the knowledge endpoint
      const knowledgeUrl = new URL(
        "/knowledge",
        process.env.KNOWLEDGE_ENDPOINT
      );
      const knowledgeResponse = await fetch(knowledgeUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
        }),
      });
      const knowledgeResult = await knowledgeResponse.json();

      // Step 2: Call the summarize endpoint with the knowledge response
      const summarizeUrl = new URL(
        "/summarize",
        process.env.KNOWLEDGE_ENDPOINT
      );
      const summarizeResponse = await fetch(summarizeUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          knowledge_response: knowledgeResult,
          max_length: 200,
        }),
      });
      const summarizeResult = await summarizeResponse.json();

      // Step 3: Return the summarized response with the original sources
      return {
        llm_prompt: summarizeResult.summary,
        sources: knowledgeResult.sources,
        triggered_guards: knowledgeResult.triggered_guards,
      };
    } catch (error) {
      console.error("Error calling Knowledge/Summarize API:", error);
      throw error;
    }
  }

  async streamResponse(
    responseStream: InvokeEndpointWithResponseStreamCommandOutput,
    res: NextApiResponse
  ) {
    const decoder = new TextDecoder("utf-8");
    try {
      if (responseStream.Body) {
        for await (const chunk of responseStream.Body) {
          const chunkInText = chunk.PayloadPart
            ? decoder.decode(chunk.PayloadPart.Bytes)
            : "";

          if (chunkInText.includes('"token":')) {
            const index = chunkInText.indexOf('"token":');
            const val2 = chunkInText.substring(
              index + 8,
              chunkInText.indexOf("}") + 1
            );
            const msg = JSON.parse(val2.trim());
            const plainText = msg.text;

            if (plainText) {
              if (plainText != "<|eot_id|>") {
                res.write(
                  `data: ${JSON.stringify({
                    type: "STREAM_RESPONSE",
                    payload: { message: plainText },
                  })}\n\n`
                );
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing stream:", error);
    }
  }

  async getContextAndPrompt(req: NextApiRequest) {
    console.log("NEW_MESSAGE", req.query);

    // Get the message from the query parameters
    const { message } = req.query;

    if (!message || typeof message !== "string") {
      throw new Error("No message provided");
    }

    // Set default system prompt if not provided
    if (!req.query.systemPrompt) {
      req.query.systemPrompt =
        "You are a helpful assistant that answers questions about the system.";
    }

    // Get the context from the knowledge API
    return await this.createContext(message);
  }

  async responseStream(
    req: {
      llm_prompt: string;
      sources?: Record<string, string>[];
    },
    res: NextApiResponse
  ) {
    try {
      // Use the summarized response directly from the llm_prompt field
      const response =
        req.llm_prompt ||
        "I don't have enough information to answer that question.";

      // Stream the response in chunks
      const chunkSize = 3; // Number of characters per chunk

      for (let i = 0; i < response.length; i += chunkSize) {
        const chunk = response.substring(i, i + chunkSize);
        // console.log("Chunk:", chunk);

        res.write(
          `data: ${JSON.stringify({
            type: "STREAM_RESPONSE",
            payload: { message: chunk },
          })}\n\n`
        );

        // Add a small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      throw error;
    }
  }
}
export const sendStreamController = new SendStreamController();
