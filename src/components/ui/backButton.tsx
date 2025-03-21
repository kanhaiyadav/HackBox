"use client";

import React from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

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
    
    return <Button variant={variant} onClick={handleClick}>Back</Button>;
};

export default BackButton;
