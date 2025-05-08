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
            <div className="flex items-center w-full gap-4 sm:gap-6 border-b-2 border-accent">
                {navs.map((nav, index) => (
                    <button
                        key={index}
                        className={`text-xs xss:text-sm md:text-base py-2 px-1 ${
                            active === index
                                ? "border-b-2 border-primary text-primary font-semibold"
                                : "border-b-2 border-transparent"
                        }`}
                        onClick={() => setActive(index)}
                    >
                        {nav.name}
                    </button>
                ))}
            </div>
            <div className="grow  py-4 overflow-x-auto overflow-y-hidden styled-scrollbar">
                <div className="mb-[-10px] mt-[10px]">
                    <Image
                        src={"/no-data.png"}
                        alt="no-data"
                        width={60}
                        height={60}
                        className="mx-auto"
                    />
                    <p className="w-fit m-auto text-white/40">No data exits!</p>
                </div>
            </div>
        </div>
    );
};

export default UserSpecificSection;
