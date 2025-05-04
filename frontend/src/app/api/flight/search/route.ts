// app/api/flight/search/route.ts
import { NextResponse } from "next/server";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
    console.log("[API] Flight search request received");

    const body = await req.json();
    console.log("[API] Request body:", JSON.stringify(body, null, 2));

    // Step 1: Create session
    const createRes = await fetch(
        "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "sh967490139224896692439644109194",
            },
            body: JSON.stringify(body),
        }
    );

    const createData = await createRes.json();
    const sessionToken = createData.sessionToken;
    console.log("[API] Create response:", createData);

    if (!sessionToken) {
        console.error("[API] No session token received");
        return NextResponse.json(
            { error: "No session token received" },
            { status: 500 }
        );
    }

    console.log("[API] Polling with session token:", sessionToken);

    // Step 2: Poll loop
    let pollData = null;
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
        attempt++;
        const pollRes = await fetch(
            `https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/${sessionToken}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "sh967490139224896692439644109194",
                },
            }
        );

        pollData = await pollRes.json();
        console.log(`[API] Poll attempt ${attempt}:`, pollData.status);

        // Break if results have data or status is complete
        if (
            pollData.status === "RESULT_STATUS_COMPLETE" ||
            Object.keys(pollData.content?.results?.itineraries || {}).length > 0
        ) {
            break;
        }

        // Wait before next attempt
        await sleep(1500);
    }

    return NextResponse.json(pollData);
}
