import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("Predict Insight API called");

    // Parse the request body
    const body = await request.json();
    const { message } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: "Missing required field: message" },
        { status: 400 }
      );
    }

    // Generate a unique conversation ID with timestamp
    const conversationId = `conversation-${Date.now()}`;

    // Build request body for external API
    const requestBody = {
      text: message,
      conversation_id: conversationId,
      // Add any other required parameters
    };

    console.log(
      "Sending request to external API:",
      JSON.stringify(requestBody, null, 2)
    );

    // Make request to the external API
    const apiResponse = await fetch(
      "https://ky6ed9kk6h.execute-api.us-east-1.amazonaws.com/dev/conversation/prompt",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

    console.log(
      "Predict Insight API Response:",
      JSON.stringify(responseData, null, 2)
    );

    // Ensure our response format is consistent with what our hooks expect
    const formattedResponse = {
      result: {
        response:
          responseData.result?.response ||
          responseData.response ||
          responseData.text ||
          JSON.stringify(responseData),
      },
      sources: responseData.sources || {},
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(formattedResponse, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      },
    });
  } catch (error) {
    console.error("Predict Insight API Error:", error);
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
