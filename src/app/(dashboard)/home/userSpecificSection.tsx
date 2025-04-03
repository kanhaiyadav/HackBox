"use client";

import Image from "next/image";
import React from "react";

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
