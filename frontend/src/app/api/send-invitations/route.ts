import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { emails, groupName, groupId } = await req.json();

    if (!emails || !groupId || !groupName) {
        return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const link = `${process.env.BASE_URL}/invite?groupId=${groupId}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        for (const email of emails) {
            await transporter.sendMail({
                from: `"GroupBot" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `You're invited to join ${groupName}!`,
                html: `<p>Hi! You've been invited to join the group <b>${groupName}</b>.</p>
                       <p>Click <a href="${link}">here</a> to join.</p>`,
            });
        }

        return NextResponse.json({ message: "Invitations sent." });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ message: "Failed to send invitations." }, { status: 500 });
    }
}
