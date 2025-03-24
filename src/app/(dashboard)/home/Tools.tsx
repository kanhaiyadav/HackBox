import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ToolCard from "@/components/toolCard";

const tools = [
    {
        _id: "67dfcea8da5997d08a5ac822",
        name: "JWT Decoder",
        description: "This tool can decrypt a JWT using its secret",
        slug: "jwt-decoder",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd18cda5997d08a5ac824",
        name: "API Status Checker",
        description: "This tool can decrypt a JWT using its secret",
        slug: "api-status-checker",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd1beda5997d08a5ac826",
        name: "Color Code Converter",
        description: "This tool can decrypt a JWT using its secret",
        slug: "color-code-converter",
        category: "dev",
        logo: "/tools/color-code-converter",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd309f9124972d01ac948",
        name: "HTML to Markdown Converter",
        description: "This tool can decrypt a JWT using its secret",
        slug: "html-to-markdown-converter",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd32bf9124972d01ac94a",
        name: "Markdown Editor",
        description: "This tool can decrypt a JWT using its secret",
        slug: "markdown-editor",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd33df9124972d01ac94c",
        name: "Text Manupulator",
        description: "This tool can decrypt a JWT using its secret",
        slug: "text-manupulator",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd364f9124972d01ac94e",
        name: "JSON placeholder",
        description: "This tool can decrypt a JWT using its secret",
        slug: "json-placeholder",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd385f9124972d01ac950",
        name: "HTTP Status Code lookup",
        description: "This tool can decrypt a JWT using its secret",
        slug: "http-status-code-lookup",
        category: "dev",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd3b9f9124972d01ac952",
        name: "Css unit converter",
        description: "This tool can decrypt a JWT using its secret",
        slug: "css-unit-converter",
        category: "dev",
        stars: 0,
        __v: 0,
    },
];

const Tools = () => {
    return (
        <div className="w-full grow flex flex-col min-h-0">
            <div className="w-full flex items-center justify-between border-b-3 border-white/10 pb-2">
                <h2 className="text-xl">Tools</h2>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dev">Dev</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="productivity">
                            Productivity
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grow py-4 overflow-y-auto no-scrollbar min-h-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 auto-rows-min gap-4">
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tools;
