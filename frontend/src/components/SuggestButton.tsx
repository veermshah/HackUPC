"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SuggestButton({ users }: { users: any[] }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        setLoading(true);
        const preferences = users.map((user) => ({
            name: user.name || user.email,
            answers: user.tripPreferences,
        }));

        const res = await fetch("/api/suggest-trip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferences }),
        });

        const result = await res.json();
        console.log("IN SUGGESTBUTTON", result); // display or store result
        localStorage.setItem("suggestResult", JSON.stringify(result)); // store result
        setLoading(false);
        router.push("/trip-result"); // redirect to trip result page
    };

    return (
        <button
            disabled={!users.every((u) => u.tripPreferences)}
            onClick={handleClick}
            className={`px-5 py-2 rounded-lg font-semibold duration-150 cursor-pointer ${
                users.every((u) => u.tripPreferences)
                    ? "bg-[#0f3857] text-white hover:bg-[#0d2f49] hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
            {loading ? "Loading..." : "SUGGEST"}
        </button>
    );
}
