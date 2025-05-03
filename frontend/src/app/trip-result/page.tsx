"use client";
import { useEffect, useState } from "react";

export default function TripResultPage() {
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem("suggestResult");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setResult(parsed.result); // ✅ extract the actual trip data
            } catch (err) {
                console.error("Failed to parse result:", err);
            }
        }
    }, []);

    if (!result) return <div className="p-6">Loading trip results...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Trip Suggestion Summary</h1>

            {result.intereses_comunes && (
                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        Common Interests
                    </h2>
                    <p>{result.intereses_comunes}</p>
                </section>
            )}
        </div>
    );
}
