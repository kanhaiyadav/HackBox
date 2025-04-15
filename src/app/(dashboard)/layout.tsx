import React from "react";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Metadata } from "next";
import ToolNav from "@/components/dashboardHeader";
import StoreProvider from "../StoreProvider";
import { Josefin_Sans, Comic_Neue, Space_Grotesk, Borel } from "next/font/google";

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "700"], // or whatever weights you need
    variable: "--font-josefin",
    display: "swap",
});

const comic = Comic_Neue({
    subsets: ["latin"],
    weight: ["400", "700"], // or whatever weights you need
    variable: "--font-comic",
    display: "swap",
});

const space = Space_Grotesk({
    subsets: ["latin"],
    weight: ["400", "700"], // or whatever weights you need
    variable: "--font-space",
    display: "swap",
});

const borel = Borel({
    subsets: ["latin"],
    weight: ["400"], 
    variable: "--font-borel",
    display: "swap",
});


export const metadata: Metadata = {
    title: {
        default: "HackBox",
        template: "%s | HackBox",
    },
    description:
        "A secret vault of online superpowers. analyze profiles, automate boring stuff, and pretend to be a hacker. Welcome to HackBox.",
    keywords: ["hackbox", "tools", "github-profile-comparison", "jwt-decoder"],
    authors: [{ name: "Kanhaiya Yadav" }],
};

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={`${josefin.variable} ${comic.variable} ${space.variable} ${borel.variable}`}>
            <body className="h-screen overflow-x-hidden overflow-y-auto">
                <StoreProvider>
                    <div className="flex h-fit">
                        <SidebarProvider className="relative">
                            <AppSidebar />
                            <main className="grow relative px-2 flex flex-col h-screen min-w-0 overflow-hidden">
                                <ToolNav />
                                {children}
                            </main>
                        </SidebarProvider>
                    </div>
                </StoreProvider>
            </body>
        </html>
    );
};

export default layout;
