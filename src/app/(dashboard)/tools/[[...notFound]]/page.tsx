import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import BackButton from "@/components/ui/backButton";

const NotFound = () => {
    return (
        <div className="w-full grow flex flex-col items-center justify-between px-[100px]">
            <div className="w-[500px] h-[500px] relative">
                <Image fill src="/error3.svg" alt="error404" />
            </div>
            <div>
                <p className=" text-gray-400 text-center">
                    <span>This page is have not been built yet</span>
                    <br />
                    <span>But soon it will be...</span>
                </p>
            </div>
            <div className="flex gap-4 my-4">
                <BackButton />
                <Link href={'/home'}><Button variant="secondary">Home</Button></Link>
            </div>
            <div className="flex gap-8 my-4">
                <Link
                    href="#"
                    className="text-white/20 text-3xl hover:text-white/60"
                >
                    <FaGithub />
                </Link>
                <Link
                    href="#"
                    className="text-white/20 text-3xl hover:text-white/60"
                >
                    <FaLinkedin />
                </Link>
                <Link
                    href="#"
                    className="text-white/20 text-3xl hover:text-white/60"
                >
                    <FaFacebook />
                </Link>
                <Link
                    href="#"
                    className="text-white/20 text-3xl hover:text-white/60"
                >
                    <FaSquareXTwitter />
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
