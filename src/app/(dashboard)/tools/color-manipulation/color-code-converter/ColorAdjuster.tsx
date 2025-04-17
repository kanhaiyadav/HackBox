// File: app/components/ColorConverter/ColorAdjuster.tsx
"use client";

import React, { useState, useEffect } from "react";
import chroma from "chroma-js";
import { Slider } from "@/components/ui/slider";
import { ColorSpace } from "@/utils/color-manipulation";

interface ColorAdjusterProps {
    chromaColor: chroma.Color;
    onColorChange: (color: string, format: ColorSpace) => void;
}

export default function ColorAdjuster({
    chromaColor,
    onColorChange,
}: ColorAdjusterProps) {
    const [hue, setHue] = useState<number>(0);
    const [saturation, setSaturation] = useState<number>(0);
    const [lightness, setLightness] = useState<number>(0);

    // Initialize HSL values when chromaColor changes
    useEffect(() => {
        try {
            const hslValues = chromaColor.hsl();
            setHue(hslValues[0] || 0);
            setSaturation(hslValues[1] || 0);
            setLightness(hslValues[2] || 0);
        } catch (e) {
            console.error(e);
        }
    }, [chromaColor]);

    // Handle HSL value changes
    const handleHslChange = (
        type: "hue" | "saturation" | "lightness",
        value: number
    ) => {
        try {
            const newHsl = [...chromaColor.hsl()];

            if (type === "hue") {
                newHsl[0] = value;
                setHue(value);
            } else if (type === "saturation") {
                newHsl[1] = value;
                setSaturation(value);
            } else if (type === "lightness") {
                newHsl[2] = value;
                setLightness(value);
            }

            const newColor = chroma.hsl(
                newHsl[0] || 0,
                newHsl[1] || 0,
                newHsl[2] || 0
            );
            onColorChange(newColor.hex(), "hex");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Hue: {Math.round(hue)}°
                    </label>
                    <Slider
                        value={[hue]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(value) =>
                            handleHslChange("hue", value[0])
                        }
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Saturation: {Math.round(saturation * 100)}%
                    </label>
                    <Slider
                        value={[saturation]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) =>
                            handleHslChange("saturation", value[0])
                        }
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Lightness: {Math.round(lightness * 100)}%
                    </label>
                    <Slider
                        value={[lightness]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(value) =>
                            handleHslChange("lightness", value[0])
                        }
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Color Preview
                </label>
                <div
                    className="h-40 rounded-md border border-gray-200"
                    style={{ backgroundColor: chromaColor.hex() }}
                ></div>
                <div className="mt-2 text-center font-mono text-sm">
                    {chromaColor.hex()}
                </div>
                <div className="mt-2 text-center font-mono text-sm">
                    {chromaColor.css()}
                </div>
                <div className="mt-2 text-center font-mono text-sm">
                    {chromaColor.css("hsl")}
                </div>
            </div>
        </div>
    );
}
