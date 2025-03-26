"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
    selectAllTools,
    selectToolsByCategory,
    selectToolLoading
} from "@/lib/features/tools/tools.selector";
import { ITool } from "@/types";
import ToolCard from "@/components/toolCard";
import ToolCardSkeleton from "@/components/skeletons/toolCardSkeleton";

const ToolDirectory = ({ category }: { category: string }) => {
    const allTools = useSelector(selectAllTools);
    const loading = useSelector(selectToolLoading);

    // Memoize the selector function to avoid re-creating it on every render
    const toolsByCategory = useSelector(
        useMemo(() => selectToolsByCategory(category), [category])
    );

    const [tools, setTools] = useState<ITool[]>(allTools); // Initialize with allTools

    useEffect(() => {
        console.log(category);
        if (category !== "all") {
            console.log("setting tools by category");
            setTools(toolsByCategory);
        } else {
            console.log("setting all tools");
            setTools(allTools);
        }
    }, [category, toolsByCategory, allTools]); // Ensure dependencies are properly set

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 auto-rows-min gap-4">
            {
                loading &&
                Array.from({ length: 27 }).map((_, index) => (
                    <ToolCardSkeleton key={index} />
                ))
            }
            {tools.map((tool, index) => (
                <ToolCard key={index} tool={tool} />
            ))}
        </div>
    );
};

export default ToolDirectory;
