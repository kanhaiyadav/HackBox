"use client";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import CollapsibleItem from "./collapsible";
import { selectToolLoading } from "@/lib/features/tools/tools.selector";
import { useSelector } from "react-redux";

export function NavMain({
    categories,
    active,
    setActive,
}: {
        categories: {
        title: string;
        icon: React.ComponentType;
        slug: string;
    }[];
    active: string;
    setActive: (arg0: string) => void;
    }) {
    
    const loading = useSelector(selectToolLoading);
    
    const items = categories.map((category) => ({
        title: category.title,
        icon: category.icon,
        slug: category.slug,
        active: active,
        setActive,
    }));
    
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <CollapsibleItem key={item.title} item={item} loading={loading} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
