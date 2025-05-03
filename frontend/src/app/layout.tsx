import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Midpoint",
    description: "Plan your next trip with your friends",
    icons: {
        icon: "/favicon.png", // or .png/.svg
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${ubuntu.className} antialiased`}>
                {children}
            </body>
        </html>
    );
}
