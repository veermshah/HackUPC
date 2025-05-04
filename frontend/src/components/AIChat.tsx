"use client";
import React, { useState } from "react";

export default function AIChat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, `🧑 You: ${input}`]);
        const res = await fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ message: input }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setMessages((prev) => [...prev, `🤖 Gemini: ${data.response}`]);
        setInput("");
    };

    return (
        <div className="w-full max-w-7xl p-6 rounded-2xl shadow-xl bg-white border">
            <div className="h-96 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg, idx) => {
                    const isUser = msg.startsWith("🧑");
                    return (
                        <div
                            key={idx}
                            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                                isUser
                                    ? "bg-blue-100 self-end ml-auto text-right"
                                    : "bg-gray-100 text-left"
                            }`}
                        >
                            {msg}
                        </div>
                    );
                })}
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                className="mt-4 flex gap-3"
            >
                <input
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
