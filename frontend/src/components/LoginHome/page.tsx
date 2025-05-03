import React from "react";
import { auth0 } from "@/lib/auth0";

export default async function LoginHome() {
    const session = await auth0.getSession();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {session?.user?.picture && (
                <img
                    src={session.user.picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full shadow-md mb-6"
                />
            )}
            <h1 className="text-5xl font-bold text-[#0f3857] mt-4">
                Welcome back, {session?.user?.name || "Guest"}!
            </h1>
            <p className="text-lg text-gray-600 mt-4 text-center">
                Start planning your next adventure with your friends!
            </p>
        </div>
    );
}
