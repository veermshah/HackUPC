import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generarPromptDesdeJSON } from "@/lib/promptBuilder";
import { getGeminiResponse } from "@/lib/gemini";
import { safeJsonParse } from "@/lib/utils"; // import helper

export async function POST(req: NextRequest) {
    const { preferences } = await req.json();

    const prompt = generarPromptDesdeJSON(preferences);
    const geminiResponse = await getGeminiResponse(prompt);

    const parsed = safeJsonParse(geminiResponse);

    if (!parsed) {
        return NextResponse.json(
            { error: "Invalid Gemini response" },
            { status: 400 }
        );
    }

    return NextResponse.json({ result: parsed });
}
