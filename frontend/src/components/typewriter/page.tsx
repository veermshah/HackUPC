"use client";

import { Typewriter } from "react-simple-typewriter";

export default function TypewriterEffect() {
    return (
        <div className="text-center mt-16">
            <h1 className="text-6xl font-bold text-[#8ad9dc]">
                <Typewriter
                    words={["Plan.", "Budget.", "Travel."]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={1000}
                />
            </h1>
        </div>
    );
}
