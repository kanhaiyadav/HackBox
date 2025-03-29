"use client";

import ToolCard from "@/components/toolCard";
import Image from "next/image";
import React from "react";

const tools = [
    {
        _id: "67dfcea8da5997d08a5ac822",
        name: "JWT Decoder",
        description: "This tool can decrypt a JWT using its secret",
        slug: "jwt-decoder",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd18cda5997d08a5ac824",
        name: "API Status Checker",
        description: "This tool can decrypt a JWT using its secret",
        slug: "api-status-checker",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd1beda5997d08a5ac826",
        name: "Color Code Converter",
        description: "This tool can decrypt a JWT using its secret",
        slug: "color-code-converter",
        category: "dev",
        categorySlug: "somethign",
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
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd32bf9124972d01ac94a",
        name: "Markdown Editor",
        description: "This tool can decrypt a JWT using its secret",
        slug: "markdown-editor",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd33df9124972d01ac94c",
        name: "Text Manupulator",
        description: "This tool can decrypt a JWT using its secret",
        slug: "text-manupulator",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd364f9124972d01ac94e",
        name: "JSON placeholder",
        description: "This tool can decrypt a JWT using its secret",
        slug: "json-placeholder",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd385f9124972d01ac950",
        name: "HTTP Status Code lookup",
        description: "This tool can decrypt a JWT using its secret",
        slug: "http-status-code-lookup",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
    {
        _id: "67dfd3b9f9124972d01ac952",
        name: "Css unit converter",
        description: "This tool can decrypt a JWT using its secret",
        slug: "css-unit-converter",
        category: "dev",
        categorySlug: "somethign",
        stars: 0,
        __v: 0,
    },
];

const UserSpecificSection = () => {
    const [active, setActive] = React.useState(0);

    const navs = [
        { name: "Recent Used", id: "recent" },
        { name: "Frequently Used", id: "frequent" },
        { name: "Favourite", id: "favourite" },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center w-full gap-[1px] border-b-3 border-white/10">
                {navs.map((nav, index) => (
                    <button
                        key={index}
                        className={`px-6 py-3 rounded-t-xl ${
                            active === index
                                ? "bg-gray-200/5 border-2 border-white/5 border-b-0"
                                : "bg-gray-400/5"
                        }`}
                        onClick={() => setActive(index)}
                    >
                        {nav.name}
                    </button>
                ))}
            </div>
            <div className="grow  py-4 overflow-x-auto overflow-y-hidden styled-scrollbar">
                <div className="mb-[-10px] mt-[10px]">
                    <Image src={'/no-data.png'} alt="no-data" width={60} height={60} className="mx-auto" />
                    <p className="w-fit m-auto text-white/40">No data exits!</p>
                </div>
                {/* <div className="flex gap-4 w-fit">
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} className="w-[120px]"/>
                    ))}
                    {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} className="w-[120px]"/>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default UserSpecificSection;
