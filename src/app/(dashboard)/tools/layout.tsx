import type { Metadata } from "next";
import "../../globals.css";
import ToolNav from "@/components/toolNav";


export const metadata: Metadata = {
    title: "Tools",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <ToolNav />
            {children}
        </>
    );
}
