import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, knowledge_base_id } = body;

    // Validate required fields
    if (!query || !knowledge_base_id) {
      return NextResponse.json(
        {
          error: "Missing required fields: query and knowledge_base_id",
        },
        { status: 400 }
      );
    }

    console.log("Knowledge Hub API Request:", {
      query,
      knowledge_base_id,
    });

    // Make request to the external API
    const apiResponse = await fetch(
      "https://lvmhfz2zs4.execute-api.us-east-1.amazonaws.com/test/dla_audit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          knowledge_base_id,
        }),
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
      "Knowledge Hub API Response Payload:",
      JSON.stringify(responseData, null, 2)
    );

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Knowledge Hub API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
