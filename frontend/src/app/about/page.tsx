import React from "react";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";

export default async function About() {
    const session = await auth0.getSession();

    return (
        <div>
            <nav className="fixed top-6 left-0 right-0 mx-4 flex items-center justify-between px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-black/10 shadow-lg">
                <div className="flex items-center space-x-4">
                    <a
                        href="/"
                        className="group relative inline-flex items-center"
                    >
                        <span className="relative z-10 text-3xl font-black text-[#0f3857] transform transition-transform duration-300 group-hover:translate-x-16">
                            Midpoint
                        </span>
                        <img
                            src="/nobg.png"
                            alt="Icon"
                            className="absolute left-0 w-12 h-12 opacity-0 transform -translate-x-12 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                        />
                    </a>
                    <button className="text-xl ml-32 font-semibold text-[#0f3857] bg-[#c0dedf] rounded-full px-6 py-2 cursor-pointer hover:scale-110 active:scale-95 duration-75">
                        <Link href="/about">About</Link>
                    </button>

                    {session && (
                        <div>
                            <button className="text-xl ml-8 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75">
                                Create Group
                            </button>
                            <Link href="/preferences">
                                <button className="text-xl ml-8 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75">
                                    Preferences
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="space-x-4">
                    {!session ? (
                        <>
                            <a href="/auth/login?screen_hint=signup">
                                <button className="px-4 py-2 bg-[#0f3857] text-[#c0dedf] hover:bg-[#c0dedf] hover:text-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
                                    Sign up
                                </button>
                            </a>
                            <a href="/auth/login">
                                <button className="px-4 py-2 bg-[#c0dedf] text-[#0f3857] hover:text-[#c0dedf] hover:bg-[#0f3857] rounded-xl hover:scale-110 active:scale-95 cursor-pointer duration-75">
                                    Log in
                                </button>
                            </a>
                        </>
                    ) : (
                        <>
                            <span className="text-white text-lg font-semibold">
                                Welcome, {session.user.name}!
                            </span>
                            <a href="/auth/logout">
                                <button className="px-4 py-2 bg-[#c0dedf] text-black hover:text-[#c0dedf] hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
                                    Log out
                                </button>
                            </a>
                        </>
                    )}
                </div>
            </nav>
            <div className="flex items-center gap-24 justify-center ">
                <div className="flex flex-col  justify-center h-screen">
                    <h1 className="text-6xl font-bold mt-10">
                        About Us
                    </h1>
                    <p className="text-lg mt-5 max-w-2xl mx-auto">
                        We are a team of passionate developers dedicated to
                        creating innovative solutions that make a difference.
                        Our mission is to empower users with cutting-edge
                        technology and exceptional user experiences.
                    </p>
                </div>
                <div className="flex justify-center mt-10">
                    <img src="/logo.png" alt="Logo" className="h-100 w-100 rounded-full"/>
                </div>
            </div>
        </div>
    );
}
