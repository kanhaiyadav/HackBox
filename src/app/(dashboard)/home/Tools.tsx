"use client";

import React, { useEffect } from "react";
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

const Tools = () => {
    const searchParams = useSearchParams();
    console.log(searchParams.get("category"));
    const [category, setCategory] = React.useState(searchParams.get("category") || "all");
    const [title, setTitle] = React.useState("All Tools");

    useEffect(() => {
        const selectedCategory = toolCategories.find((cat) => cat.slug === category);
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

export default Tools;
