// File: app/components/ColorConverter/ColorFormats.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from "lucide-react";
import chroma from "chroma-js";
import { ColorFormat, ColorSpace, formatNames, getColorInFormat } from "@/utils/color-manipulation";

interface ColorFormatsProps {
    chromaColor: chroma.Color;
    inputFormat: ColorSpace;
    outputFormat: ColorFormat;
    onOutputFormatChange: (format: ColorFormat) => void;
}

export default function ColorFormats({
    chromaColor,
    inputFormat,
    outputFormat,
    onOutputFormatChange,
}: ColorFormatsProps) {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopied(format);
        setTimeout(() => setCopied(null), 2000);
    };

    const outputFormats: ColorFormat[] = [
        "hex",
        "rgb",
        "rgba",
        "hsl",
        "hsla",
        "hsv",
        "lab",
        "lch",
        "oklab",
        "oklch",
        "cmyk",
        "css",
    ];

    return (
        <div className="w-full space-y-4">
            <h3 className="font-medium">Color Conversion</h3>

            <div className="flex items-center gap-2 mb-4">
                <span>Convert from {formatNames[inputFormat]} to:</span>
                <Select
                    value={outputFormat}
                    onValueChange={(value) =>
                        onOutputFormatChange(value as ColorFormat)
                    }
                >
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                        {outputFormats.map((format) => (
                            <SelectItem key={format} value={format}>
                                {formatNames[format]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className=" p-4 rounded-md">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-medium text-sm uppercase">
                            {outputFormat}:
                        </span>
                        <span className="ml-2 text-sm font-mono">
                            {getColorInFormat(chromaColor, outputFormat)}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            copyToClipboard(
                                getColorInFormat(chromaColor, outputFormat),
                                outputFormat
                            )
                        }
                        title={`Copy ${outputFormat.toUpperCase()} value`}
                    >
                        {copied === outputFormat ? (
                            <Check size={16} />
                        ) : (
                            <Copy size={16} />
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {outputFormats
                    .filter((f) => f !== outputFormat)
                    .map((format) => (
                        <div
                            key={format}
                            className="flex items-center justify-between  p-3 rounded-md"
                        >
                            <div>
                                <span className="font-medium text-sm uppercase">
                                    {format}:
                                </span>
                                <span className="ml-2 text-sm font-mono">
                                    {getColorInFormat(chromaColor, format)}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                    copyToClipboard(
                                        getColorInFormat(chromaColor, format),
                                        format
                                    )
                                }
                                title={`Copy ${format.toUpperCase()} value`}
                            >
                                {copied === format ? (
                                    <Check size={16} />
                                ) : (
                                    <Copy size={16} />
                                )}
                            </Button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
