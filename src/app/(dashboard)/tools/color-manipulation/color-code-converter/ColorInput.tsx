// File: app/components/ColorConverter/ColorInput.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ColorSpace, formatNames, colorSpaces } from "@/utils/color-manipulation";
import chroma from "chroma-js";

interface ColorInputProps {
    color: string;
    format: ColorSpace;
    onColorChange: (color: string, format: ColorSpace) => void;
}

export default function ColorInput({
    color,
    format,
    onColorChange,
}: ColorInputProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full space-y-4">
                <label className="block font-medium">Input Color</label>
                <div className="flex items-center gap-2">
                    <Select
                        value={format}
                        onValueChange={(value) =>
                            onColorChange(color, value as ColorSpace)
                        }
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                            {colorSpaces.map((space) => (
                                <SelectItem key={space} value={space}>
                                    {formatNames[space]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="text"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value, format)}
                        className="flex-grow"
                        placeholder={`Enter color in ${formatNames[format]}`}
                    />
                    <Input
                        type="color"
                        value={format === "hex" ? color : chroma(color).hex()}
                        onChange={(e) => onColorChange(e.target.value, "hex")}
                        className="w-12 h-10 p-1 cursor-pointer"
                    />
                </div>

                <div
                    className="h-24 rounded-md border border-gray-200"
                    style={{
                        backgroundColor:
                            format === "hex" ? color : chroma(color).hex(),
                    }}
                ></div>
            </div>
        </div>
    );
}
