import React from "react";
import { ITool } from "@/types";
import Image from "next/image";
import { VscFeedback } from "react-icons/vsc";
import { FaCoffee } from "react-icons/fa";
import HeaderSkeleton from "@/components/skeletons/HeaderSkeleton";
import ShareButton from "@/components/ShareButton";
import BuyMeCoffeeModal from "@/components/BuyMeACoffee";

const Header = ({
    tool,
    loading = true,
}: {
    tool: ITool | undefined;
    loading: boolean;
}) => {
    if (loading) {
        return <HeaderSkeleton />;
    }
    return (
        <div className="col-span-full">
            <h1 className="text-3xl font-semibold">{tool?.name}</h1>
            <div className="py-2 flex items-center gap-4">
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer">
                    <Image
                        src={"/star.png"}
                        alt="star"
                        width={20}
                        height={20}
                    />
                    <span>2,343</span>
                </div>
                <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer">
                    <VscFeedback size={20} className="text-white/50" />
                    <span>Feedback</span>
                </div>
                
                <ShareButton />

                <BuyMeCoffeeModal />
                
                {/* <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer">
                    <FaCoffee size={20} className="text-white/50" />
                    <span>Buy me a coffee</span>
                </div> */}
            </div>
            <hr className="my-4 border-white/40" />
        </div>
    );
};

export default Header;
