"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "./nav-user";
import { useRouter } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { House } from "lucide-react";
import { data } from "../../constants";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [active, setActive] = React.useState("home");
    const router = useRouter();

    return (
        <Sidebar collapsible="offcanvas" {...props} variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-between w-full">
                        <div className="flex items-center justify-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="app-logo"
                                width={"35"}
                                height={"35"}
                            />
                            <h2 className="text-primary text-2xl font-semibold">
                                HackBox
                            </h2>
                        </div>
                        <SidebarTrigger />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="no-scrollbar">
                <SidebarMenu>
                    <SidebarGroup>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={"Home"}
                                className={`${
                                    active === "home" ? "bg-white/5" : ""
                                } hover:bg-white/5`}
                                onClick={() => {
                                    setActive("home");
                                    router.push("/home");
                                }}
                            >
                                {true && <House />}
                                <span>home</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarGroup>
                </SidebarMenu>
                <NavMain
                    items={data.navMain}
                    active={active}
                    setActive={setActive}
                />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
