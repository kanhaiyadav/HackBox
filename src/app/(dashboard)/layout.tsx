import React from "react";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Metadata } from "next";
import ToolNav from "@/components/dashboardHeader";
import StoreProvider from "../StoreProvider";

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
