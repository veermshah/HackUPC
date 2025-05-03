import { auth0 } from "@/lib/auth0";
import "./globals.css";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Link from "next/link";

export default async function Home() {
    const session = await auth0.getSession();

    return (
        <main
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <nav className="fixed top-6 left-0 right-0 mx-4 flex items-center justify-between px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-black/10 shadow-lg">
                <div className="flex items-center space-x-4">
                    <a
                        href="/"
                        className="text-3xl font-black text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75"
                    >
                        Scanner
                    </a>
                    {session && (
                        <div>
                            <button className="text-xl ml-32 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75">
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
                                <button className="px-4 py-2 bg-[#0f3857] text-white hover:bg-[#0f3857] hover:scale-110 active:scale-95 cursor-pointer rounded-xl duration-75">
                                    Sign up
                                </button>
                            </a>
                            <a href="/auth/login">
                                <button className="px-4 py-2 bg-gray-300 text-[#0f3857] hover:text-[#c0dedf] hover:bg-[#0f3857] rounded-xl hover:scale-110 active:scale-95 cursor-pointer duration-75">
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
        </main>
    );
}
