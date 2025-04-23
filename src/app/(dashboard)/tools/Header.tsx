import React from "react";
import { ITool } from "@/types";
import Image from "next/image";
// import { FaCoffee } from "react-icons/fa";
import HeaderSkeleton from "@/components/skeletons/HeaderSkeleton";
import ShareButton from "@/components/ShareButton";
import BuyMeCoffeeModal from "@/components/BuyMeACoffee";
import FeedbackModal from "@/components/FeedbackModal";

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
        <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-2xl xss:text-3xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center sm:text-start">{tool?.name}</h1>
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
            
                <FeedbackModal />
                
                <ShareButton />

                <BuyMeCoffeeModal />
                
                {/* <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-accent shadow-input active:shadow-inset cursor-pointer">
                    <FaCoffee size={20} className="text-white/50" />
                    <span>Buy me a coffee</span>
                </div> */}
            </div>
            <hr className="my-4 border-white/40 w-full" />
        </div>
    );
};

export default Header;
