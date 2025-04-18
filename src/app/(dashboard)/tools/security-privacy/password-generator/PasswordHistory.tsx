// app/password-generator/components/PasswordHistory.tsx
"use client";

import { Button } from "@/components/ui/button";
import {  FiEye, FiEyeOff } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { PasswordHistoryItem } from "@/types/security-privacy";
import { useState } from "react";

interface PasswordHistoryProps {
    history: PasswordHistoryItem[];
    setPassword: (password: string) => void;
    setShowHistory: (show: boolean) => void;
    removeFromHistory: (index: number) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
}

const PasswordTile = ({ password }: { password: string }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex items-center justify-between w-full px-3 rounded-lg">
            <span className="font-mono mr-4 max-w-[120px] xs:max-w-[150px] sm:max-w-[300px] md:max-w-[450px] whitespace-nowrap overflow-hidden text-ellipsis">
                {showPassword ? password : "•".repeat(8)}
            </span>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="text-primary hover:text-primary/80"
            >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </Button>
        </div>
    );
};

export default function PasswordHistory({
    history,
    removeFromHistory,
}: PasswordHistoryProps) {
    return (
        <div className="sm:foreground sm:shadow-foreground rounded-lg p-3 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">
                Password History
            </h2>
            <ul className="space-y-3">
                {history.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between bg-accent shadow-input p-3 rounded-lg"
                    >
                        <PasswordTile password={item.password} />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromHistory(index)}
                            className="text-red-400 hover:text-red-300"
                        >
                            <FaRegTrashAlt size={16} />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
