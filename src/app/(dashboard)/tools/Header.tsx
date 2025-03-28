import React from "react";
import { ITool } from "@/types";
import Image from "next/image";
import { VscFeedback } from "react-icons/vsc";
import { FaCoffee } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";

const Header = ({ tool }: { tool: ITool }) => {
    return (
        <div className="col-span-full">
            <h1 className="text-3xl font-semibold">{tool.name}</h1>
            <div className="py-2 flex items-center gap-4">
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent">
                    <Image
                        src={"/star.png"}
                        alt="star"
                        width={20}
                        height={20}
                    />
                    <span>2,343</span>
                </div>
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent">
                    <VscFeedback size={20} className="text-white/50" />
                    <span>Feedback</span>
                </div>
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent">
                    <IoShareSocialSharp size={20} className="text-white/50" />
                    <span>Share</span>
                </div>
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent">
                    <FaCoffee size={20} className="text-white/50" />
                    <span>Buy me a coffee</span>
                </div>
            </div>
            <hr className="my-4 border-white/40" />
        </div>
    );
};

export default Header;
