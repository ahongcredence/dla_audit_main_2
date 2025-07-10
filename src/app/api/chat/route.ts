import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

import { sendStreamController } from "./stream.controller";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Create a mock request object that matches the expected format
  const mockReq = {
    query: {
      message: searchParams.get("message"),
      appType: searchParams.get("appType"),
      currentUser: searchParams.get("currentUser"),
      systemPrompt: searchParams.get("systemPrompt"),
    },
  };

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Mock response object that writes to the stream
      const mockRes = {
        writeHead: () => {},
        write: (data: string) => {
          controller.enqueue(encoder.encode(data));
        },
        end: () => {
          controller.close();
        },
      };

      try {
        const contextResult = await sendStreamController.getContextAndPrompt(
          mockReq as unknown as NextApiRequest
        );
        console.log("Context creation result:", JSON.stringify(contextResult));

        if (contextResult) {
          // Check if contextResult is an error response
          if ("detail" in contextResult) {
            console.error("Error response from API:", contextResult);
            const errorPayload = {
              type: "ERROR",
              payload: {
                message:
                  "The backend API returned an error. Please try again later.",
              },
            };
            mockRes.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
            return;
          }

          // Cast to the expected type
          const output = contextResult as {
            llm_prompt: string;
            sources: Record<string, string>[];
            triggered_guards: string[];
            report_url?: string;
          };

          // Hits a guard
          if (
            output["triggered_guards"] &&
            output["triggered_guards"].length > 0
          ) {
            const errorPayload = {
              type: "TRIGGERED_GUARD",
              payload: {
                message: output["llm_prompt"],
                guard: output["triggered_guards"],
              },
            };
            mockRes.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
            return;
          }

          // Stream the LLM response
          if (output.llm_prompt) {
            // Make sure we pass both the llm_prompt and sources to the responseStream function
            await sendStreamController.responseStream(
              {
                llm_prompt: output.llm_prompt,
                sources: output.sources,
              },
              mockRes as unknown as NextApiResponse
            );
          }

          // Places down the sources
          if (output.sources) {
            // Transform sources from the knowledge API format to the format expected by the UI
            const formattedSources: {
              [filename: string]: string;
            } = {};
            output.sources.forEach((source: Record<string, string>) => {
              // Use document_title as the key and document_uri as the value
              if (source.document_title && source.document_uri) {
                formattedSources[source.document_title] = source.document_uri;
              }
            });

            const sourcesPayload = {
              type: "ADD_SOURCES",
              payload: { sources: formattedSources },
            };
            mockRes.write(`data: ${JSON.stringify(sourcesPayload)}\n\n`);
          }

          if (output.report_url) {
            console.log("report url: ", output.report_url);

            const signedUrlPayload = {
              type: "ADD_SIGNED_URL",
              payload: { signed_url: output.report_url },
            };
            mockRes.write(`data: ${JSON.stringify(signedUrlPayload)}\n\n`);
          }
        } else {
          console.error(
            "Failed to create context. Result:",
            JSON.stringify(contextResult)
          );
          throw new Error(`Failed to create context.`);
        }
      } catch (error) {
        console.error("Error in streaming response:", error);

        // Handle errors in streaming response
        const errorPayload = {
          type: "ERROR",
          payload: {
            message:
              "An error occurred while processing your request. Please check the server logs for more details.",
          },
        };
        mockRes.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
      } finally {
        // End the stream
        mockRes.write(`data: ${JSON.stringify({ type: "END_STREAM" })}\n\n`);
        mockRes.end();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
