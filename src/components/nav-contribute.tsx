"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import FeedbackModal from "./FeedbackModal";
import BuyMeCoffeeModal from "./BuyMeACoffee";
import { RxGithubLogo } from "react-icons/rx";
import Link from "next/link";
import BugReportModal from "./ReportBugModal";

export function NavContribute() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Contribute</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <BuyMeCoffeeModal
                            hideLabel={false}
                            className="bg-transparent shadow-none hover:bg-accent w-full"
                        />
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton className="px-2 rounded-lg bg-transparent hover:bg-accent active:shadow-inset cursor-pointer">
                        <Link
                            href="https://github.com/kanhaiyadav/HackBox"
                            className="flex items-center py-2 gap-2 w-full"
                            target="_blank"
                        >
                            <RxGithubLogo className="text-white/50 text-lg" />
                            <span>Star Our Repository</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                       <BugReportModal className="shadow-none bg-transparent hover:bg-red-900/50"/>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <FeedbackModal
                            hideLabel={false}
                            className="bg-transparent shadow-none hover:bg-accent"
                        />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
