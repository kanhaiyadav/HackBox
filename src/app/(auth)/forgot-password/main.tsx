"use client";

import React from "react";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MdLockReset } from "react-icons/md";
import { IoSparklesSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import MagicLinkForm from "./magicLinkForm";

const Main = () => {
    const [btnClicked, setBtnClicked] = React.useState(false);
    const [emailType, setEmailType] = React.useState<"reset" | "magic">();

    return (
        <div className="relative overflow-hidden w-full">
            <AnimatePresence mode="wait">
                {!btnClicked ? (
                    <motion.div
                        key="options"
                        initial={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                                Forgot Your Password?
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Choose how you&apos;d like to get back in —
                                reset your password the usual way, or let us
                                send you a magic link for instant access.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="mt-4">
                            <div
                                className="flex items-center justify-center gap-4 bg-accent hover:bg-primary/50 hover:outline hover:ouline-2 hover:outline-primary transition-colors shadow-input rounded-lg p-4 mb-4 text-center w-full text-white/80 text-lg font-semibold cursor-pointer"
                                onClick={() => {
                                    setBtnClicked(true);
                                    setEmailType("reset");
                                }}
                            >
                                <MdLockReset className="text-2xl" />
                                <span>Reset Your Password</span>
                            </div>
                            <div
                                className="flex items-center justify-center gap-4 bg-accent hover:bg-primary/50 hover:outline hover:ouline-2 hover:outline-primary transition-colors shadow-input rounded-lg p-4 mb-4 text-center w-full text-white/80 text-lg font-semibold cursor-pointer"
                                onClick={() => {
                                    setBtnClicked(true);
                                    setEmailType("magic");
                                }}
                            >
                                <IoSparklesSharp className="text-2xl" />
                                <span>Get a Magic Link</span>
                            </div>
                        </CardContent>
                    </motion.div>
                ) : (
                    <motion.div
                        key="email-form"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold tracking-tight text-primary">
                                {emailType === "reset"
                                    ? "Reset Your Password"
                                    : "Get a Magic Link"}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                {emailType === "reset"
                                    ? "Enter your email address below and we'll send you a link to reset your password."
                                    : "Enter your email address below and we'll send you a magic link to log in instantly."}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="mt-4">
                                <MagicLinkForm emailType={emailType} />
                            <Button
                                // variant="secondary"
                                className="w-full my-2 text-white/80 !bg-accent"
                                onClick={() => {
                                    setBtnClicked(false);
                                    setEmailType(undefined);
                                }}
                            >
                                Back
                            </Button>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Main;
