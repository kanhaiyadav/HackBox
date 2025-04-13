import React from "react";
import { useAppSelector } from "@/lib/hook";
import { selectToolsByCategory } from "@/lib/features/tools/tools.selector";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

const CollapsibleItem = ({
    item,
    loading,
}: {
    item: {
        title: string;
        active: string;
        icon: React.ComponentType;
        slug: string;
        setActive: (arg0: string) => void;
        };
    loading: boolean;
}) => {
    const tools = useAppSelector(selectToolsByCategory(item.title));
    return (
        <Collapsible key={item.title} asChild className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild className="hover:bg-white/5">
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span className=" whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {
                            loading &&
                            Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton key={index} className="h-6 w-full rounded-sm" />
                            ))
                        }
                        {tools?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.name}>
                                <SidebarMenuSubButton
                                    asChild
                                    className={`${
                                        item.active === subItem.slug ? "bg-white/5 text-primary" : ""
                                    } hover:bg-white/5`}
                                    onClick={() =>
                                        item.setActive(subItem.slug)
                                    }
                                >
                                    <Link
                                        href={`/tools/${item.slug}/${subItem.slug}`}
                                    >
                                        <span>{subItem.name}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};

export default CollapsibleItem;
