"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectToolBySlug } from "@/lib/features/tools/tools.selector";
import WarningBox from "@/components/WarningBox";
import InfoBox from "@/components/InfoBox";
import Header from "./Header";
import { usePathname } from "next/navigation";
import { selectToolLoading } from "@/lib/features/tools/tools.selector";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
    const loading = useSelector(selectToolLoading);
    const slug = usePathname().split("/").pop();
    const tool = useSelector(selectToolBySlug(slug || ""));

    const warnings = [
        "This tool is in beta, please report any bugs. It may not work as expected.",
        "This tool is not available in your region. Please use a VPN to access it.",
    ];

    return (
        <div className="grow min-h-0 flex flex-col w-full px-[50px]">
            <Header tool={tool} loading={loading} />
            <div className="grow min-h-0 flex gap-8 overflow-y-auto styled-scrollbar pr-[15px] pt-4">
                <div className="grow">
                    {children}
                </div>
                <div className="sticky shrink-0 top-8 flex flex-col gap-8 w-[300px] pt-[15px]">
                    <InfoBox
                        description={tool?.description}
                        loading={loading}
                    />

                    <WarningBox warnings={warnings} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default PageWrapper;
