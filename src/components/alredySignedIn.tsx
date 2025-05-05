"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { signOut} from "next-auth/react";

const AlredySignedIn = () => {
    return (
        <Card className="bg-transparent shadow-none border-none">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                    You are already signed in
                </CardTitle>
                <CardDescription className="text-white/60">
                    Lets go back...
                </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-32 relative">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 3, type: "tween" } }}
                    className="w-full"
                >
                    <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#222222] to-[#22222200]" />
                    <iframe
                        className="w-full"
                        src="https://lottie.host/embed/91d91e8d-411e-4960-94e7-35b41da84116/awoQZY811m.lottie"
                    ></iframe>
                </motion.div>
            </CardContent>
            <CardFooter className="flex justify-between w-full gap-4 border-t border-accent py-6 mx-6">
                <Link href={"/home"} className="flex-1">
                    <Button
                        variant="outline"
                        className="border-primary bg-primary/5 text-primary w-full"
                    >
                        Go to Dashboard
                    </Button>
                </Link>
                    <Button
                        type="submit"
                        variant="outline"
                    className="border-primary bg-primary/5 text-primary flex-1"
                    onClick={() => {
                        signOut();
                        }}
                    >
                        Log out
                    </Button>
            </CardFooter>
        </Card>
    );
};

export default AlredySignedIn;
