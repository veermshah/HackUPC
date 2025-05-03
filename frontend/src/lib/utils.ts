export function safeJsonParse(text: string): any {
    try {
        // Trim surrounding non-JSON text if any
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        const jsonString = text.slice(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("Failed to parse Gemini output as JSON:", err);
        return null;
    }
}
