"use client";

import React, { useEffect, Suspense } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { BsTools } from "react-icons/bs";
import { toolCategories } from "../../../../constants/tool";
import ToolDirectory from "./ToolDirectory";
import { useSearchParams } from "next/navigation";

// Loading fallback component
const ToolsLoading = () => {
    return (
        <div className="w-full grow flex flex-col min-h-0">
            <div className="w-full flex items-center justify-between border-b-3 border-white/10 pb-2 pr-2 pl-2 sm:pr-6">
                <div className="h-8 w-36 bg-gray-700/30 rounded animate-pulse"></div>
                <div className="h-10 w-[180px] bg-gray-700/30 rounded animate-pulse"></div>
            </div>
            <div className="grow py-4 overflow-y-auto styled-scrollbar min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2 sm:p-4">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="h-32 bg-gray-700/30 rounded animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Component that uses useSearchParams
const ToolsContent = () => {
    const searchParams = useSearchParams();
    console.log(searchParams.get("category"));
    const [category, setCategory] = React.useState(
        searchParams.get("category") || "all"
    );
    const [title, setTitle] = React.useState("All Tools");

    useEffect(() => {
        const selectedCategory = toolCategories.find(
            (cat) => cat.slug === category
        );
        if (selectedCategory) {
            setTitle(selectedCategory.title);
        } else {
            setTitle("All");
        }
    }, [category]);

    return (
        <div className="w-full grow flex flex-col min-h-0">
            <div className="w-full flex items-center justify-between border-b-3 border-white/10 pb-2 pr-2 pl-2 sm:pr-6">
                <h2 className="text-xl">{title} Tools</h2>
                <Select onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger className="w-[180px]">
                        Category
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <BsTools />
                                <span>All Tools</span>
                            </div>
                        </SelectItem>
                        {toolCategories.map((category, index) => (
                            <SelectItem key={index} value={category.slug}>
                                <div className="flex items-center gap-2">
                                    <category.icon />
                                    <span>{category.title}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grow py-4 overflow-y-auto styled-scrollbar min-h-0">
                <ToolDirectory category={category} />
            </div>
        </div>
    );
};

// Main component with Suspense boundary
const Tools = () => {
    return (
        <Suspense fallback={<ToolsLoading />}>
            <ToolsContent />
        </Suspense>
    );
};

export default Tools;
