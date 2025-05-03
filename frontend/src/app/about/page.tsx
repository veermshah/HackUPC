import React from "react";
import { auth0 } from "@/lib/auth0";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import Group from "@/lib/models/groups";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

export default async function About() {
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
        <div>
            <Navbar session={session} createGroup={createGroup} />
            <div className="flex items-center gap-24 justify-center ">
                <div className="flex flex-col justify-center h-screen">
                    <h1 className="text-6xl font-bold mt-10">About Us</h1>
                    <p className="text-lg mt-5 max-w-2xl mx-auto">
                        We are a team of passionate developers dedicated to
                        creating innovative solutions that make a difference.
                        Our mission is to empower users with cutting-edge
                        technology and exceptional user experiences.
                    </p>
                </div>
                <div className="flex justify-center mt-10">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-100 w-100 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
