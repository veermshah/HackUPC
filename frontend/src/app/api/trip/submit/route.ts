import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import { auth0 } from "@/lib/auth0"; // adjust based on your auth helper

export async function POST(req: Request) {
  try {
    const session = await auth0.getSession(); // get current user
    if (!session?.user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectToDB();

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: session.user.sub },
      { $set: { tripPreferences: data } },
      { new: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
