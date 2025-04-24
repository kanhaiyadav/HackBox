import React from "react";
import { FaCoffee } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
// import { FaGithub } from "react-icons/fa";
// import { HiStar } from "react-icons/hi2";
// import { HiOutlineStar } from "react-icons/hi2";
import { LuSunMedium } from "react-icons/lu";
import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SearchBar from "./searchBar";
import { auth } from "@/auth";




const ToolNav = async () => {

    const session = await auth();
    console.log(session, "session");
    
    return (
        <nav className="flex justify-between items-center px-4 py-4 rounded-xl w-full foreground shadow-foreground my-4">
            <SearchBar />
            <div className="w-fit flex items-center gap-4 sm:gap-6">
                {/* <div className="flex items-center gap-1">
                    <HiOutlineStar className="cursor-pointer text-xl text-white/40 hover:text-orange-300" />
                    <span className="text-white/40 cursor-default">4,534</span>
                </div> */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/">
                                <GrAnnounce className="cursor-pointer text-xl text-white/40 hover:text-primary" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>What new</p>
                        </TooltipContent>
                    </Tooltip>
                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/">
                                <FaGithub className="cursor-pointer text-xl text-white/40 hover:text-primary" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Star HackBox</p>
                        </TooltipContent>
                    </Tooltip> */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/">
                                <FaCoffee className="cursor-pointer text-xl text-white/40 hover:text-primary" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Buy me a Coffee</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>   
                        <TooltipTrigger asChild>
                            <div>
                                <LuSunMedium className="cursor-pointer text-[22px] text-white/40 hover:text-primary" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Change Theme</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <SidebarTrigger className="" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Close sidebar</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {!session && (
                    <Link href="/signin">
                        <Button>Log In</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default ToolNav;
