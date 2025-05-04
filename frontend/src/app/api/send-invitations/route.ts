import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface InviteRequestBody {
    emails: string[];
    groupName: string;
    groupId: string;
}

export async function POST(req: Request) {
    const { emails, groupName, groupId }: InviteRequestBody = await req.json();

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
                from: `"Midpoint Team" <${process.env.EMAIL_USER}>`,
                from: `"Midpoint Team" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `🚀 Invitation to join "${groupName}" on Midpoint!`,
                html: `
           <div style="font-family:Arial, sans-serif; padding:0; background-color:#f4f4f4; border-radius:8px; overflow:hidden; color:#333; max-width:600px; margin:auto;">
             <div style="padding:20px;">
               <h2 style="color:#0f3857;">You're invited to join <em>${groupName}</em> 🎉</h2>
               <p>
                 Hello!<br/><br/>
                 You've been invited to join the group <strong>${groupName}</strong> on <strong style="color:#0f3857;">Midpoint</strong>, the smart way to plan and connect.
               </p>
               <p>
                 Click the button below to accept the invitation:
               </p>
               <a href="${link}" style="display:inline-block; margin:20px 0; padding:12px 24px; background-color:#0f3857; color:#fff; text-decoration:none; border-radius:6px;">
                 Join Group Now
               </a>
               <p style="font-size:14px; color:#777;">
                 If you didn’t expect this email, you can safely ignore it.
               </p>
               <hr style="margin-top:30px;" />
               <p style="font-size:12px; color:#999;">
                 Sent by Midpoint | This is an automated message
               </p>
             </div>
           </div>
         `,
            });
        }

        return NextResponse.json({ message: "Invitations sent." });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to send invitations." },
            { status: 500 }
        );
    }
}
