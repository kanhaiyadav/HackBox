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

    return (
        <div className="grow min-h-0 flex flex-col w-full sm:px-[20px] lg:px-[50px] pb-[20px]">
            <Header tool={tool} loading={loading} />
            <div className="grow min-h-0 flex flex-col xl:flex-row gap-4 lg:gap-8 overflow-y-auto styled-scrollbar pr-[5px] md:pr-[10px] pt-4">
                <div className="grow">{children}</div>
                <div className="shrink-0 flex flex-col sm:flex-row xl:flex-col gap-8 w-full xl:w-[300px] pt-[15px] h-fit pl-4 pr-2 md:px-6 xl:px-0">
                    <InfoBox
                        description={tool?.description}
                        loading={loading}
                    />

                    <WarningBox
                        warning={tool?.warning}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default PageWrapper;
