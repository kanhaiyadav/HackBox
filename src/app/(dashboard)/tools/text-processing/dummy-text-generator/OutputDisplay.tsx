"use client";

import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import { Clipboard } from "lucide-react";
import React from "react";

interface OutputDisplayProps {
    text: string;
}

export default function OutputDisplay({ text }: OutputDisplayProps) {
    const [copied, setCopied] = React.useState(false);

    return (
        <div className="rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Generated Text</h2>
                <Button
                    variant="secondary"
                    onClick={() => {
                        navigator.clipboard.writeText(text);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                    disabled={!text}
                    className="w-[120px]"
                >
                    {copied ? (
                        <CheckCircleIcon className="text-green-500" size={16} />
                    ) : (
                        <Clipboard className="mr-0" size={16} />
                    )}
                    {copied ? (
                        <span className="text-green-500">Copied!</span>
                    ) : (
                        <span className="text-white">Copy</span>
                    )}
                </Button>
            </div>
            <div className="p-4 foreground shadow-inset rounded-md min-h-[200px]">
                {text ? (
                    <pre className="whitespace-pre-wrap">{text}</pre>
                ) : (
                    <p className="text-gray-500 text-center py-10">
                        Click &rdquo;Generate Text&ldquo; to create random text.
                    </p>
                )}
            </div>
        </div>
    );
}
