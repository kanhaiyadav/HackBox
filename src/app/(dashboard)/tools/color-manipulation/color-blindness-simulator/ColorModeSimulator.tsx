"use client";

import React, { useState } from "react";
import { colorBlindnessDescriptions, colorBlindnessMatrices } from "../../../../../../constants/colorManipulation";
import { ColorBlindnessType } from "@/types/colorManipulation";
import chroma from "chroma-js";

const ColorModeSimulator = () => {
    const [selectedColor, setSelectedColor] = useState<string>("#1E90FF");

    const suggestAccessibleColors = (color: string): string[] => {
        // const baseColor = chroma(color);
        const suggestions: string[] = [];

        // Increase contrast
        suggestions.push(chroma(color).brighten(1).hex());

        // Shift hue to more distinguishable colors
        suggestions.push(chroma(color).set("hsl.h", "+60").hex());
        suggestions.push(chroma(color).set("hsl.h", "+180").hex());

        // Add a more saturated version
        suggestions.push(chroma(color).saturate(1).hex());

        return suggestions;
    };

    // Generate simulated colors for color picker mode
    const simulateColor = (color: string, type: ColorBlindnessType): string => {
        if (type === "normal") return color;

        const rgb = chroma(color).rgb();
        const matrix =
            colorBlindnessMatrices[
                type as Exclude<ColorBlindnessType, "normal">
            ];

        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;

        const newR = Math.min(
            255,
            Math.max(
                0,
                Math.round(
                    (r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]) *
                        255
                )
            )
        );
        const newG = Math.min(
            255,
            Math.max(
                0,
                Math.round(
                    (r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]) *
                        255
                )
            )
        );
        const newB = Math.min(
            255,
            Math.max(
                0,
                Math.round(
                    (r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]) *
                        255
                )
            )
        );

        return chroma(newR, newG, newB).hex();
    };

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                <div className="w-full">
                    <label className="block text-sm font-medium mb-1">
                        Select a Color:
                    </label>
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="h-12 w-full cursor-pointer "
                    />
                    <div className="font-mono">{selectedColor}</div>
                </div>
            </div>

            <div className="foreground p-6 shadow-inset rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 ">
                {(
                    Object.keys(
                        colorBlindnessDescriptions
                    ) as ColorBlindnessType[]
                ).map((type) => (
                    <div
                        key={type}
                        className="bg-accent shadow-foreground p-4 rounded-lg"
                    >
                        <div className="text-lg font-semibold mb-2">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                        <div
                            className="h-16 w-full rounded-md mb-2 shadow-inset"
                            style={{
                                backgroundColor: simulateColor(
                                    selectedColor,
                                    type
                                ),
                            }}
                        ></div>
                        <div className="font-mono">
                            {simulateColor(selectedColor, type)}
                        </div>
                        <p className="text-sm mt-2">
                            {colorBlindnessDescriptions[type]}
                        </p>
                    </div>
                ))}
            </div>

            <div className="foreground shadow-inset p-6 rounded-lg mb-8">
                <h2 className="text-xl font-bold mb-4">
                    Suggested Accessible Alternatives
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestAccessibleColors(selectedColor).map(
                        (color, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className="h-16 w-full rounded-md mb-2 shadow-input"
                                    style={{ backgroundColor: color }}
                                ></div>
                                <div className="font-mono text-sm">{color}</div>
                            </div>
                        )
                    )}
                </div>
                <div className="mt-4 p-4 bg-accent shadow-foreground rounded-md">
                    <h3 className="font-semibold mb-2">Accessibility Tips:</h3>
                    <ul className="list-disc pl-5 text-sm">
                        <li>
                            Use high contrast between text and background colors
                        </li>
                        <li>
                            Avoid red-green color combinations for important
                            information
                        </li>
                        <li>
                            Include patterns or shapes along with color coding
                        </li>
                        <li>
                            Provide text alternatives for color-based
                            information
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ColorModeSimulator;
