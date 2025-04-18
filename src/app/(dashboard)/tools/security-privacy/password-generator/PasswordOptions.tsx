// app/password-generator/components/PasswordOptions.tsx
"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FiRefreshCw, FiLock, FiUnlock } from "react-icons/fi";
import { PasswordOptions as PasswordOptionsType } from "@/types/security-privacy";

interface PasswordOptionsProps {
    options: PasswordOptionsType;
    setOptions: (options: PasswordOptionsType) => void;
    generatePassword: () => void;
    showHistory: boolean;
    setShowHistory: (show: boolean) => void;
}

export default function PasswordOptions({
    options,
    setOptions,
    generatePassword,
    showHistory,
    setShowHistory,
}: PasswordOptionsProps) {
    return (
        <>
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <label className="block mb-2 text-sm font-medium">
                        Length: {options.length}
                    </label>
                    <Slider
                        min={4}
                        max={64}
                        value={[options.length]}
                        onValueChange={([value]) =>
                            setOptions({ ...options, length: value })
                        }
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium mb-2">
                        Character Types:
                    </label>
                    <div className="flex justify-between flex-wrap gap-2">
                        {[
                            { id: "uppercase", label: "Uppercase (A-Z)" },
                            { id: "lowercase", label: "Lowercase (a-z)" },
                            { id: "numbers", label: "Numbers (0-9)" },
                            { id: "symbols", label: "Symbols (!@#$...)" },
                        ].map(({ id, label }) => (
                            <div
                                key={id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={id}
                                    checked={
                                        options[
                                            id as keyof PasswordOptionsType
                                        ] as boolean
                                    }
                                    onCheckedChange={(checked) =>
                                        setOptions({
                                            ...options,
                                            [id]: checked,
                                        })
                                    }
                                />
                                <label htmlFor={id} className="text-sm">
                                    {label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setShowHistory(!showHistory)}
                    className="gap-2"
                >
                    {showHistory ? (
                        <FiLock size={18} />
                    ) : (
                        <FiUnlock size={18} />
                    )}
                    {showHistory ? "Hide History" : "Show History"}
                </Button>
                <Button
                    onClick={generatePassword}
                    className="gap-2 bg-primary hover:bg-primary/80"
                >
                    <FiRefreshCw size={18} />
                    Generate New
                </Button>
            </div>
        </>
    );
}
