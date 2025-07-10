import { NextResponse } from "next/server";

import { getMockResponse } from "../../data/mockTransactionResponses";

export async function POST(request: Request) {
  try {
    console.log("Transaction Chain API called");

    // Parse the request body to get dynamic parameters
    const body = await request.json();
    const { prompt, recordId } = body;

    // Validate required fields
    if (!prompt || !recordId) {
      return NextResponse.json(
        {
          error: "Missing required fields: prompt and recordId",
        },
        { status: 400 }
      );
    }

    // Check for mock response first (exact string matching)
    const mockResponse = getMockResponse(prompt.trim());
    if (mockResponse) {
      console.log("Returning mock response for query:", prompt);
      return NextResponse.json(mockResponse, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        },
      });
    }

    // Generate a unique GUID with timestamp
    const guid = `web-analysis-${Date.now()}`;

    // Build request body with dynamic parameters
    const requestBody = {
      prompt: prompt,
      guid: guid,
      recordId: recordId,
      outputBucket: "",
      outputKey: "",
    };

    console.log(
      "Sending request to external API:",
      JSON.stringify(requestBody, null, 2)
    );

    // Make request to the external API
    const apiResponse = await fetch(
      "https://qmwnwu2yvl.execute-api.us-east-1.amazonaws.com/dev/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!apiResponse.ok) {
      console.error(
        "External API Error:",
        apiResponse.status,
        apiResponse.statusText
      );
      return NextResponse.json(
        {
          error: "External API request failed",
          status: apiResponse.status,
        },
        { status: apiResponse.status }
      );
    }

    const responseData = await apiResponse.json();

    // Console log the successful response payload
    console.log(
      "Transaction Chain API Response Payload:",
      JSON.stringify(responseData, null, 2)
    );

    return NextResponse.json(responseData, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      },
    });
  } catch (error) {
    console.error("Transaction Chain API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });
}
