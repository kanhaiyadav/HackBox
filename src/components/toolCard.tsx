import React from "react";
import { ImTextWidth } from "react-icons/im";

const ToolCard = ({
    tool,
    className,
}: {
    tool: {
        name: string;
        slug: string;
        };
    className?: string;
}) => {
    return (
        <div className={`bg-gray-500/5 p-4 rounded-xl flex flex-col items-center gap-2 min-w-[100px] h-[130px] foreground shadow-foreground active:shadow-inset ${className}`}>
            <ImTextWidth className="text-5xl text-gray-500" />
            <h3 className="text-xs font-semibold text-center">{tool.name}</h3>
        </div>
    );
};

export default ToolCard;
