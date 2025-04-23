"use client";

import ToolCard from "@/components/toolCard";
// import Image from "next/image";
import React from "react";
import { selectAllTools } from "@/lib/features/tools/tools.selector";
import { useSelector } from "react-redux";

const UserSpecificSection = () => {
    const [active, setActive] = React.useState(0);

    const tools = useSelector(selectAllTools);   

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
                        className={`px-3 md:px-6 py-2 md:py-3 rounded-t-lg md:rounded-t-xl text-xs xss:text-sm md:text-base ${
                            active === index
                                ? "bg-accent border-2 border-white/5 border-b-0"
                                : "bg-gray-400/10"
                        }`}
                        onClick={() => setActive(index)}
                    >
                        {nav.name}
                    </button>
                ))}
            </div>
            <div className="grow  py-4 overflow-x-auto overflow-y-hidden styled-scrollbar">
                {/* <div className="mb-[-10px] mt-[10px]">
                    <Image src={'/no-data.png'} alt="no-data" width={60} height={60} className="mx-auto" />
                    <p className="w-fit m-auto text-white/40">No data exits!</p>
                </div> */}
                <div className="flex gap-4 w-fit">
                    {tools.slice(23, 35).map((tool, index) => (
                        <ToolCard key={index} tool={tool} className="w-[120px]"/>
                    ))}
                    {/* {tools.map((tool, index) => (
                        <ToolCard key={index} tool={tool} className="w-[120px]"/>
                    ))} */}
                </div>
            </div>
        </div>
    );
};

export default UserSpecificSection;
