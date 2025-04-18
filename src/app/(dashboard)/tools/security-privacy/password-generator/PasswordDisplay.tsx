"use client";

import { useRef, useState } from "react";
import { FiCopy, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StrengthMeter from "./StrengthMeter";
import { PasswordHistoryItem } from "@/types/security-privacy";

interface PasswordDisplayProps {
    password: string;
    setPassword: (password: string) => void;
    history: PasswordHistoryItem[];
    setHistory: (history: PasswordHistoryItem[]) => void;
}

export default function PasswordDisplay({
    password,
}: PasswordDisplayProps) {
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);

    const copyToClipboard = () => {
        if (!password) return;

        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        if (passwordRef.current) {
            passwordRef.current.select();
        }
    };

    return (
        <>
            <div className="flex items-center mb-4">
                <div className="relative flex-grow">
                    <Input
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        readOnly
                        className="bg-gray-700 border-gray-600 rounded-r-none pr-16"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400"
                    >
                        {showPassword ? (
                            <FiEyeOff size={20} />
                        ) : (
                            <FiEye size={20} />
                        )}
                    </Button>
                </div>
                <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600 rounded-l-none h-[47px]"
                >
                    {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </Button>
            </div>

            <StrengthMeter password={password} />
        </>
    );
}
