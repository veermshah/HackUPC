// /src/app/api/skyscanner/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch(
            "https://partners.api.skyscanner.net/apiservices/v1/carhire/live/search/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "sh967490139224896692439644109194", // Updated header
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Internal Server Error",
                detail: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
