import React from "react";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Metadata } from "next";

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
        <html lang="en">
            <body className="h-screen overflow-x-hidden overflow-y-auto">
                <div className="flex h-fit">
                    <SidebarProvider className="relative">
                        <AppSidebar />
                        <main className="grow relative px-2">
                            {children}
                        </main>
                    </SidebarProvider>
                </div>
            </body>
        </html>
    );
};

export default layout;
