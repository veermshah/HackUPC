// components/Navbar.tsx
import Link from "next/link";
import CreateGroupButton from "@/components/CreateGroupButton";

interface NavbarProps {
    session: any;
    createGroup: (formData: FormData) => void;
}

export default function Navbar({ session, createGroup }: NavbarProps) {
    return (
        <nav className="fixed top-6 left-0 right-0 mx-4 flex items-center justify-between px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-black/10 shadow-lg z-10">
            <div className="flex items-center space-x-4">
                <a href="/" className="group relative inline-flex items-center">
                    <span className="relative z-10 text-3xl font-black text-[#0f3857] transform transition-transform duration-300 group-hover:translate-x-16">
                        Midpoint
                    </span>
                    <img
                        src="/nobg.png"
                        alt="Icon"
                        className="absolute left-0 w-12 h-12 opacity-0 transform -translate-x-12 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                </a>

                {session && (
                    <>
                        <Link href="/about" className="text-xl ml-32 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75">
                            About
                        </Link>
                        <CreateGroupButton action={createGroup} />
                        <Link
                            href="/preferences"
                            className="text-xl ml-8 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75"
                        >
                            Preferences
                        </Link>
                        <Link
                            href="/advisor"
                            className="text-xl ml-8 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75"
                        >
                            Advisor
                        </Link>
                    </>
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
    );
}
