import { auth0 } from "@/lib/auth0";
import "./globals.css";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Group from "@/lib/models/groups";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import CreateGroupButton from "@/components/CreateGroupButton";
import GroupList from "@/components/GroupList";
import { cookies } from "next/headers";

import Link from "next/link";
import Liquid from "@/components/spline/page";
import LoginHome from "@/components/LoginHome/page";
import TypewriterEffect from "@/components/typewriter/page";

export default async function Home() {
    const session = await auth0.getSession();
    const cookieStore = await cookies();
    const invitedGroupId = cookieStore.get("invitedGroupId")?.value;
    let userGroups: any[] = [];

    if (session) {
        await connectToDB();
        let existingUser = await User.findOne({ auth0Id: session.user.sub });

        if (!existingUser && invitedGroupId) {
            existingUser = await User.create({
                auth0Id: session.user.sub,
                email: session.user.email,
                name: session.user.name,
                groups: [invitedGroupId],
            });
        } else if (existingUser && invitedGroupId) {
            await User.findOneAndUpdate(
                { auth0Id: session.user.sub },
                { $addToSet: { groups: invitedGroupId } }
            );
        }

        if (existingUser?.groups?.length > 0) {
            userGroups = await Group.find({
                groupId: { $in: existingUser.groups },
            });
        }
    }

    async function createGroup(formData: FormData) {
        "use server";
        const name = formData.get("groupName")?.toString();
        if (!name || !session) return;

        await connectToDB();

        const newGroupId = uuidv4();
        await Group.create({
            groupId: newGroupId,
            name,
            createdAt: new Date(),
        });

        await User.findOneAndUpdate(
            { auth0Id: session.user.sub },
            {
                $addToSet: { groups: newGroupId },
                $set: { isOwner: true },
            }
        );

        revalidatePath("/");
        redirect("/");
    }

    return (
        <main className="min-h-screen bg-cover bg-center bg-no-repeat">
            <nav className="fixed top-6 left-0 right-0 mx-4 flex items-center justify-between px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-black/10 shadow-lg z-10">
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

                    {session && (
                        <>
                            <button className="text-xl ml-32 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75">
                                <Link href="/about">About</Link>
                            </button>
                            <CreateGroupButton action={createGroup} />
                            <Link href="/preferences">
                                <button className="text-xl ml-8 font-semibold text-[#0f3857] cursor-pointer hover:scale-110 active:scale-95 duration-75">
                                    Preferences
                                </button>
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

            {!session ? (
                <div>
                    <Liquid />
                    <div className="text-center absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <TypewriterEffect />
                    </div>
                </div>
            ) : (
                <div className="absolute top-0 left-0 right-0 bottom-0 mx-16">
                    <div className="mt-36 flex items-center">
                        {session?.user?.picture && (
                            <img
                                src={session.user.picture}
                                alt="Profile"
                                className="w-16 h-16 rounded-full shadow-md"
                            />
                        )}
                        {session?.user?.name && (
                            <h1 className="text-2xl text-[#0f3857] ml-4">
                                <span className="font-bold">Welcome back,</span>{" "}
                                <span className="font-semibold text-[#73d8db]">
                                    {session.user.name}!
                                </span>
                            </h1>
                        )}
                    </div>
                    <h2 className="text-4xl font-bold mt-16 mb-8 text-black">
                        Groups
                    </h2>
                    <GroupList groups={userGroups} />
                </div>
            )}
        </main>
    );
}
