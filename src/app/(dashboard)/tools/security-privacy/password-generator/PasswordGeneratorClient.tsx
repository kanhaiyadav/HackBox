// app/password-generator/components/PasswordGeneratorClient.tsx
"use client";

import { useState } from "react";
import PasswordDisplay from "./PasswordDisplay";
import PasswordOptions from "./PasswordOptions";
import PasswordHistory from "./PasswordHistory";
import {
    PasswordOptions as PasswordOptionsType,
    PasswordHistoryItem,
    CharacterSets,
} from "@/types/security-privacy";

export default function PasswordGeneratorClient() {
    const [password, setPassword] = useState<string>("");
    const [options, setOptions] = useState<PasswordOptionsType>({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const characterSets: CharacterSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    const generatePassword = () => {
        let chars = "";
        let generatedPassword = "";

        if (options.uppercase) chars += characterSets.uppercase;
        if (options.lowercase) chars += characterSets.lowercase;
        if (options.numbers) chars += characterSets.numbers;
        if (options.symbols) chars += characterSets.symbols;

        if (chars.length === 0) {
            alert("Please select at least one character type");
            return;
        }

        for (let i = 0; i < options.length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            generatedPassword += chars[randomIndex];
        }

        setPassword(generatedPassword);

        if (generatedPassword) {
            setHistory((prev) => [
                { password: generatedPassword, timestamp: new Date() },
                ...prev.slice(0, 9),
            ]);
        }
    };

    const removeFromHistory = (index: number) => {
        setHistory((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="sm:foreground sm:shadow-foreground rounded-lg p-2 sm:p-6 mb-6">
                <PasswordDisplay
                    password={password}
                    setPassword={setPassword}
                    history={history}
                    setHistory={setHistory}
                />

                <PasswordOptions
                    options={options}
                    setOptions={setOptions}
                    generatePassword={generatePassword}
                    showHistory={showHistory}
                    setShowHistory={setShowHistory}
                />
            </div>

            {showHistory && history.length > 0 && (
                <PasswordHistory
                    history={history}
                    setPassword={setPassword}
                    setShowHistory={setShowHistory}
                    removeFromHistory={removeFromHistory}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                />
            )}
        </>
    );
}
