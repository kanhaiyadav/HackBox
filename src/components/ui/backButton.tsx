"use client";

import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

const BackButton = ({
    variant = "default",
}: {
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    }) => {
    const router = useRouter();
    const handleClick = () => router.back();
    
    return <Button variant={variant} onClick={handleClick}><IoMdArrowBack/> Back</Button>;
};

export default BackButton;
