// components/Navbar.tsx
import Link from "next/link";
import CreateGroupButton from "@/components/CreateGroupButton";

interface NavbarProps {
    session: any;
    createGroup: (formData: FormData) => void;
}

export default function Navbar({ session, createGroup }: NavbarProps) {
    return (
        <nav className="fixed top-6 left-0 right-0 rounded-lg mx-4 flex items-center justify-between px-8 py-4  bg-white/20 backdrop-blur-md border border-black/10 shadow-xl z-50">
            {/* Logo & Main Links */}
            <div className="flex items-center space-x-6">
                <Link href="/" className="relative flex items-center group">
                    <span className="text-3xl font-extrabold text-[#0f3857] transition-transform duration-300 group-hover:translate-x-10">
                        MidPoint
                    </span>
                    <img
                        src="/nobg.png"
                        alt="Icon"
                        className="absolute left-0 w-10 h-10 opacity-0 -translate-x-10 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                    />
                </Link>

                {session && (
                    <div className="flex items-center space-x-6 ml-12">
                    {[
                      { href: "/preferences", label: "Preferences" },
                      { href: "/advisor", label: "Advisor" },
                      { href: "/about", label: "About" },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-lg font-medium text-[#0f3857] transform transition duration-200 hover:scale-105 hover:text-[#133e66] cursor-pointer"
                      >
                        {label}
                      </Link>
                    ))}
                  
                    {/* <div className="transform transition duration-200 hover:scale-105">
                      <CreateGroupButton action={createGroup} />
                    </div> */}

                    
                    <CreateGroupButton action={createGroup} />
                  </div>
                  
                )}
            </div>

                
            


            {/* Auth Section */}
            <div className="flex items-center space-x-4">
                {!session ? (
                    <>
                        <Link href="/auth/login?screen_hint=signup">
                            <button className="px-4 py-2 rounded-xl bg-[#0f3857] text-[#c0dedf] font-semibold hover:bg-[#133e66] hover:text-white transition duration-200">
                                Sign up
                            </button>
                        </Link>
                        <Link href="/auth/login">
                            <button className="px-4 py-2 rounded-xl bg-[#c0dedf] text-[#0f3857] font-semibold hover:bg-[#0f3857] hover:text-white transition duration-200">
                                Log in
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="text-sm text-white font-medium">
                            Welcome, {session.user.name}!
                        </span>
                        <Link href="/auth/logout">
                            <button className="px-4 py-2 rounded-xl bg-[#c0dedf] text-black font-semibold hover:bg-[#0f3857] hover:text-white transition duration-200 cursor-pointer">
                                Log out
                            </button>

                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
