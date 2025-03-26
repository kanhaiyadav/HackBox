import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ToolCardSkeleton = () => {
    return (
        <div className={`bg-gray-500/5 p-4 rounded-xl flex flex-col items-center gap-2 min-w-[100px] h-[130px] foreground shadow-foreground active:shadow-inset cursor-default`}>
            <Skeleton className="w-[48px] h-[48px] rounded-lg" />
            <Skeleton className="w-[80px] h-[14px] rounded-sm mb-[-3px]" />
            <Skeleton className="w-[90px] h-[14px] rounded-sm" />
        </div>
    );
};

export default ToolCardSkeleton;
