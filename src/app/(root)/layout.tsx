import type { Metadata } from "next";
import "../globals.css";
import { Josefin_Sans, Comic_Neue, Space_Grotesk } from "next/font/google";
import { ReactLenis } from "lenis/react";

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-josefin",
    display: "swap",
});

const comic = Comic_Neue({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-comic",
    display: "swap",
});

const space = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-space",
    display: "swap",
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
            <ReactLenis root>
                <body
                    className={`${comic.variable} ${space.variable} ${josefin.variable} antialiased`}
                >
                    {children}
                </body>
            </ReactLenis>
        </html>
    );
}
