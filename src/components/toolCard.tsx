import React from "react";
import { ImTextWidth } from "react-icons/im";
import Link from "next/link";
import { ITool } from "@/types";

const ToolCard = ({
    tool,
    className,
}: {
    tool: ITool;
    className?: string;
}) => {
    return (
        <Link href={`/tools/${tool.categorySlug}/${tool.slug}`} className={`card bg-gray-500/5 p-4 rounded-xl flex flex-col items-center gap-2 min-w-[100px] h-[130px] foreground shadow-foreground hover:shadow-primary active:shadow-inset cursor-default ${className}`}
            
        >            <ImTextWidth className="text-5xl text-gray-500" />
            <h3 className="hover:text-shadow hover:text-primary text-xs font-semibold text-center">{tool.name}</h3>
        </Link>
    );
};

export default ToolCard;
