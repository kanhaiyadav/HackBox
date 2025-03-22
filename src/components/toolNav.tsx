import React from "react";
import { FaCoffee } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
import { FaGithub } from "react-icons/fa";
import { HiStar } from "react-icons/hi2";
import { HiOutlineStar } from "react-icons/hi2";
import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const ToolNav = () => {
    return (
        <nav className="flex justify-between items-center px-4 py-4 rounded-xl w-full foreground shadow-foreground my-4">
            <h1 className="text-xl">Tool Name</h1>
            <div className="w-fit flex items-center gap-6">
                <div className="flex items-center gap-1">
                    <HiOutlineStar className="cursor-pointer text-xl text-white/40" />
                    <span className="text-white/40">4,534</span>
                </div>
                <Link href="/">
                    <GrAnnounce className="cursor-pointer text-xl text-white/40" />
                </Link>
                <Link href="/">
                    <FaGithub className="cursor-pointer text-xl text-white/40" />
                </Link>
                <Link href="/">
                    <FaCoffee className="cursor-pointer text-xl text-white/40" />
                </Link>
                <SidebarTrigger className="" />
                <Link href="/">
                    <Button>Log In</Button>
                </Link>
            </div>
        </nav>
    );
};

export default ToolNav;
