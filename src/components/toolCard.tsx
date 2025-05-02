import React from "react";
import Link from "next/link";
import { ITool } from "@/types";
import Image from "next/image";

const ToolCard = ({ tool, className }: { tool: ITool; className?: string }) => {
    return (
        <Link
            href={`/tools/${tool.categorySlug}/${tool.slug}`}
            className={`card bg-gray-500/5 p-4 rounded-xl flex flex-col items-center gap-2 min-w-[100px] max-w-[100px] xss:max-w-[150px] h-[130px] foreground shadow-foreground hover:shadow-primary active:shadow-inset cursor-default ${className}`}
        >
            <Image
                src={`/tools/${tool.categorySlug}/${tool.slug}.png`}
                alt="tool"
                width={50}
                height={50}
            />
            <h3 className="hover:text-shadow hover:text-primary text-xs font-semibold text-center">
                {tool.name}
            </h3>
        </Link>
    );
};

export default ToolCard;
