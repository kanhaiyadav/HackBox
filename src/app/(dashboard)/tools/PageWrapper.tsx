"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectToolBySlug } from "@/lib/features/tools/tools.selector";
import WarningBox from "@/components/WarningBox";
import InfoBox from "@/components/InfoBox";
import Header from "./Header";
import { usePathname } from "next/navigation";

const PageWrapper = ({
    children,
}: {
    children: React.ReactNode;
    }) => {
    const slug = usePathname().split("/").pop();
    const tool = useSelector(selectToolBySlug(slug));
    console.log(tool);

    return (
        <div className="grid grid-cols-[1fr_auto] gap-4 w-full px-[50px]">
            {tool && <Header tool={tool} />}
            <div className="col-start-1 col-end-2 row-start-2 row-end-3">
                {children}
            </div>
            <div className="flex flex-col gap-8 col-start-2 col-end-3 row-start-2 row-end-3 w-[300px]">
                <InfoBox />
                <WarningBox />
            </div>
        </div>
    );
};

export default PageWrapper;
