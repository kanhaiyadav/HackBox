"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BsTools } from "react-icons/bs";
import { toolCategories } from "../../../../constants/tool";
import ToolDirectory from "./ToolDirectory";

const Tools = () => {
    const [category, setCategory] = React.useState("all");

    return (
        <div className="w-full grow flex flex-col min-h-0">
            <div className="w-full flex items-center justify-between border-b-3 border-white/10 pb-2 pr-2 pl-2 sm:pr-6">
                <h2 className="text-xl">Tools</h2>
                <Select onValueChange={(value) => setCategory(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <div className="flex items-center gap-2">
                                <BsTools />
                                <span>All Tools</span>
                            </div>
                        </SelectItem>
                        {toolCategories.map((category, index) => (
                            <SelectItem key={index} value={category.title}>
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
