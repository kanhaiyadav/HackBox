// File: app/components/ColorConverter/AccessibilityInfo.tsx
"use client";

import React from "react";
import chroma from "chroma-js";

interface AccessibilityInfoProps {
    chromaColor: chroma.Color;
}

export default function AccessibilityInfo({
    chromaColor,
}: AccessibilityInfoProps) {
    // Get color contrast ratio information
    const getContrastRatioInfo = (bgColor: string) => {
        try {
            const blackContrast = chroma.contrast(bgColor, "black").toFixed(2);
            const whiteContrast = chroma.contrast(bgColor, "white").toFixed(2);

            return {
                blackContrast,
                whiteContrast,
                betterTextColor:
                    parseFloat(blackContrast) > parseFloat(whiteContrast)
                        ? "black"
                        : "white",
                wcagAA:
                    parseFloat(blackContrast) >= 4.5 ||
                    parseFloat(whiteContrast) >= 4.5,
                wcagAAA:
                    parseFloat(blackContrast) >= 7.0 ||
                    parseFloat(whiteContrast) >= 7.0,
            };
        } catch (e) {
            console.error(e);
            return {
                blackContrast: "-",
                whiteContrast: "-",
                betterTextColor: "black",
                wcagAA: false,
                wcagAAA: false,
            };
        }
    };

    const contrastInfo = getContrastRatioInfo(chromaColor.hex());

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Contrast Ratios</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>With black text:</span>
                            <span className="font-mono">
                                {contrastInfo.blackContrast}:1
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>With white text:</span>
                            <span className="font-mono">
                                {contrastInfo.whiteContrast}:1
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Recommended text color:</span>
                            <span>{contrastInfo.betterTextColor}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">WCAG Compliance</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>WCAG AA (minimum 4.5:1):</span>
                            <span>
                                {contrastInfo.wcagAA ? "✓ Pass" : "✗ Fail"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>WCAG AAA (minimum 7:1):</span>
                            <span>
                                {contrastInfo.wcagAAA ? "✓ Pass" : "✗ Fail"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div
                    className="p-6 rounded-md flex items-center justify-center"
                    style={{
                        backgroundColor: chromaColor.hex(),
                        color: contrastInfo.betterTextColor,
                        height: "180px",
                    }}
                >
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">Sample Text</h3>
                        <p>
                            This is how text would look on this background color
                        </p>
                        <p className="text-sm mt-2">
                            Using {contrastInfo.betterTextColor} text for best
                            contrast
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div
                        className="p-4 rounded-md flex items-center justify-center"
                        style={{
                            backgroundColor: chromaColor.hex(),
                            color: "black",
                            height: "80px",
                        }}
                    >
                        <span>Black Text</span>
                    </div>
                    <div
                        className="p-4 rounded-md flex items-center justify-center"
                        style={{
                            backgroundColor: chromaColor.hex(),
                            color: "white",
                            height: "80px",
                        }}
                    >
                        <span>White Text</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
