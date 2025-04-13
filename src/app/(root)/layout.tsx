import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Image from "next/image";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "HackBox",
    description:
        "A secret vault of online superpowers. analyze profiles, automate boring stuff, and pretend to be a hacker. Welcome to HackBox.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* <nav className="flex items-center justify-between px-[100px] py-[20px]">
                    <div className="flex items-center space-x-4">
                        <Image src="/logo.png" width={40} height={40} alt="app-logo"/>
                        <h2 className="text-2xl">HackBox</h2>
                    </div>
                    <div className="flex gap-8 items-center">
                        <span>Home</span>
                        <span>About</span>
                        <span>Product</span>
                        <span>Pricing</span>
                        <span>FAQ</span>
                    </div>
                </nav> */}
                {children}
            </body>
        </html>
    );
}
