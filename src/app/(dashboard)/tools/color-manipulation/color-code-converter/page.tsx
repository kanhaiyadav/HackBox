// File: app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import chroma from "chroma-js";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";

type ColorFormat = "hex" | "rgb" | "hsl" | "hsv" | "lab" | "lch" | "cmyk";

const ColorConverter = () => {
    const [color, setColor] = useState<string>("#3498db");
    const [chromaColor, setChromaColor] = useState<chroma.Color>(
        chroma("#3498db")
    );
    const [copied, setCopied] = useState<string | null>(null);
    const [colorPalette, setColorPalette] = useState<string[]>([]);
    const [paletteType, setPaletteType] = useState<string>("analogous");
    const [paletteCount, setPaletteCount] = useState<number>(5);
    const [showAdvancedOptions, setShowAdvancedOptions] =
        useState<boolean>(false);
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
            // Handle invalid colors
        }
    }, [chromaColor]);

    // Update palette when color or palette settings change
    useEffect(() => {
        generatePalette();
    }, [color, paletteType, paletteCount]);

    // Handle color input change
    const handleColorChange = (inputColor: string) => {
        try {
            // Try to parse the color to see if it's valid
            const newChromaColor = chroma(inputColor);
            setColor(inputColor);
            setChromaColor(newChromaColor);
        } catch (e) {
            // Keep the input value but don't update the chroma color if invalid
            setColor(inputColor);
        }
    };

    // Handle HSL value changes
    const handleHslChange = (
        type: "hue" | "saturation" | "lightness",
        value: number
    ) => {
        try {
            let newHsl = [...chromaColor.hsl()];

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

            const newColor = chroma.hsl(...newHsl);
            setChromaColor(newColor);
            setColor(newColor.hex());
        } catch (e) {
            // Handle errors
        }
    };

    // Generate color code in various formats
    const getColorInFormat = (format: ColorFormat): string => {
        try {
            switch (format) {
                case "hex":
                    return chromaColor.hex();
                case "rgb":
                    const [r, g, b] = chromaColor.rgb();
                    return `rgb(${Math.round(r)}, ${Math.round(
                        g
                    )}, ${Math.round(b)})`;
                case "hsl":
                    const [h, s, l] = chromaColor.hsl();
                    return `hsl(${Math.round(h || 0)}, ${Math.round(
                        (s || 0) * 100
                    )}%, ${Math.round((l || 0) * 100)}%)`;
                case "hsv":
                    const [hv, sv, v] = chromaColor.hsv();
                    return `hsv(${Math.round(hv || 0)}, ${Math.round(
                        (sv || 0) * 100
                    )}%, ${Math.round((v || 0) * 100)}%)`;
                case "lab":
                    const [L, a, b_] = chromaColor.lab();
                    return `lab(${L.toFixed(2)}, ${a.toFixed(2)}, ${b_.toFixed(
                        2
                    )})`;
                case "lch":
                    const [L_lch, c, h_lch] = chromaColor.lch();
                    return `lch(${L_lch.toFixed(2)}, ${c.toFixed(
                        2
                    )}, ${h_lch.toFixed(2)})`;
                case "cmyk":
                    const [c_, m, y, k] = chromaColor.cmyk();
                    return `cmyk(${Math.round(c_ * 100)}%, ${Math.round(
                        m * 100
                    )}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
                default:
                    return chromaColor.hex();
            }
        } catch (e) {
            return "Invalid color";
        }
    };

    // Copy color code to clipboard
    const copyToClipboard = (text: string, format: string) => {
        navigator.clipboard.writeText(text);
        setCopied(format);
        setTimeout(() => setCopied(null), 2000);
    };

    // Generate color palette based on selected type
    const generatePalette = () => {
        try {
            let newPalette: string[] = [];

            switch (paletteType) {
                case "analogous":
                    // Colors adjacent on the color wheel
                    const hslVal = chromaColor.hsl();
                    const baseHue = hslVal[0] || 0;
                    newPalette = Array.from(
                        { length: paletteCount },
                        (_, i) => {
                            const hueAdjust =
                                ((i - Math.floor(paletteCount / 2)) * 30) % 360;
                            return chroma
                                .hsl(
                                    (baseHue + hueAdjust + 360) % 360,
                                    hslVal[1],
                                    hslVal[2]
                                )
                                .hex();
                        }
                    );
                    break;

                case "monochromatic":
                    // Same hue, different lightness/saturation
                    newPalette = chroma
                        .scale([
                            chroma(color).set("hsl.l", 0.2),
                            chroma(color).set("hsl.l", 0.8),
                        ])
                        .mode("lch")
                        .colors(paletteCount);
                    break;

                case "triad":
                    // Three colors evenly spaced on color wheel
                    const baseHue2 = chromaColor.hsl()[0] || 0;
                    newPalette = [
                        chromaColor.hex(),
                        chroma
                            .hsl(
                                (baseHue2 + 120) % 360,
                                chromaColor.hsl()[1],
                                chromaColor.hsl()[2]
                            )
                            .hex(),
                        chroma
                            .hsl(
                                (baseHue2 + 240) % 360,
                                chromaColor.hsl()[1],
                                chromaColor.hsl()[2]
                            )
                            .hex(),
                    ];
                    // Fill any remaining slots with intermediate colors
                    if (paletteCount > 3) {
                        const additional = chroma
                            .scale([chromaColor.hex(), newPalette[1]])
                            .mode("lch")
                            .colors(Math.floor(paletteCount / 3) + 1);
                        newPalette = [
                            ...additional,
                            ...chroma
                                .scale([newPalette[1], newPalette[2]])
                                .mode("lch")
                                .colors(Math.floor(paletteCount / 3) + 1),
                        ];
                        if (newPalette.length > paletteCount) {
                            newPalette = newPalette.slice(0, paletteCount);
                        }
                    }
                    break;

                case "complementary":
                    // Base color and its opposite
                    const complementary = chroma.hsl(
                        (chromaColor.hsl()[0] + 180) % 360,
                        chromaColor.hsl()[1],
                        chromaColor.hsl()[2]
                    );
                    newPalette = chroma
                        .scale([chromaColor, complementary])
                        .mode("lch")
                        .colors(paletteCount);
                    break;

                case "shades":
                    // Different shades (lightness) of the same color
                    newPalette = chroma
                        .scale(["black", color, "white"])
                        .mode("lab")
                        .colors(paletteCount);
                    break;

                default:
                    newPalette = [color];
            }

            setColorPalette(newPalette);
        } catch (e) {
            setColorPalette([]);
        }
    };

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
            return {
                blackContrast: "-",
                whiteContrast: "-",
                betterTextColor: "black",
                wcagAA: false,
                wcagAAA: false,
            };
        }
    };

    const contrastInfo = getContrastRatioInfo(color);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Advanced Color Converter
            </h1>

            <Tabs defaultValue="converter" className="mb-8">
                <TabsList className="mb-4">
                    <TabsTrigger value="converter">Converter</TabsTrigger>
                    <TabsTrigger value="palette">Palette Generator</TabsTrigger>
                    <TabsTrigger value="adjuster">Color Adjuster</TabsTrigger>
                    <TabsTrigger value="accessibility">
                        Accessibility
                    </TabsTrigger>
                </TabsList>

                {/* Main Converter Tab */}
                <TabsContent value="converter" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="w-full md:w-1/3 space-y-4">
                            <label className="block font-medium">
                                Input Color
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={color}
                                    onChange={(e) =>
                                        handleColorChange(e.target.value)
                                    }
                                    className="flex-grow"
                                    placeholder="Enter color (hex, rgb, name...)"
                                />
                                <Input
                                    type="color"
                                    value={getColorInFormat("hex")}
                                    onChange={(e) =>
                                        handleColorChange(e.target.value)
                                    }
                                    className="w-12 h-10 p-1 cursor-pointer"
                                />
                            </div>

                            <div
                                className="h-24 rounded-md border border-gray-200"
                                style={{
                                    backgroundColor: getColorInFormat("hex"),
                                }}
                            ></div>
                        </div>

                        <div className="w-full md:w-2/3 space-y-4">
                            <h3 className="font-medium">Color Formats</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(
                                    [
                                        "hex",
                                        "rgb",
                                        "hsl",
                                        "hsv",
                                        "lab",
                                        "lch",
                                        "cmyk",
                                    ] as ColorFormat[]
                                ).map((format) => (
                                    <div
                                        key={format}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                                    >
                                        <div>
                                            <span className="font-medium text-sm uppercase">
                                                {format}:
                                            </span>
                                            <span className="ml-2 text-sm font-mono">
                                                {getColorInFormat(format)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(
                                                    getColorInFormat(format),
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
                    </div>
                </TabsContent>

                {/* Palette Generator Tab */}
                <TabsContent value="palette" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Palette Type
                                </label>
                                <Select
                                    value={paletteType}
                                    onValueChange={(value) =>
                                        setPaletteType(value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select palette type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="analogous">
                                            Analogous
                                        </SelectItem>
                                        <SelectItem value="monochromatic">
                                            Monochromatic
                                        </SelectItem>
                                        <SelectItem value="triad">
                                            Triadic
                                        </SelectItem>
                                        <SelectItem value="complementary">
                                            Complementary
                                        </SelectItem>
                                        <SelectItem value="shades">
                                            Shades
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Number of Colors: {paletteCount}
                                </label>
                                <Slider
                                    value={[paletteCount]}
                                    min={3}
                                    max={10}
                                    step={1}
                                    onValueChange={(value) =>
                                        setPaletteCount(value[0])
                                    }
                                    className="w-full"
                                />
                            </div>

                            <Button
                                onClick={generatePalette}
                                className="w-full"
                            >
                                Generate Palette
                            </Button>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Generated Palette
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {colorPalette.map((paletteColor, index) => (
                                    <div key={index} className="space-y-1">
                                        <div
                                            className="h-16 rounded-md border border-gray-200 flex items-end justify-center p-1 cursor-pointer"
                                            style={{
                                                backgroundColor: paletteColor,
                                            }}
                                            onClick={() =>
                                                handleColorChange(paletteColor)
                                            }
                                            title="Click to select this color"
                                        >
                                            <span
                                                className="text-xs font-mono px-1 rounded"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.8)",
                                                    color: "rgba(0,0,0,0.8)",
                                                }}
                                            >
                                                {paletteColor}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Color Adjuster Tab */}
                <TabsContent value="adjuster" className="space-y-6">
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
                                style={{
                                    backgroundColor: getColorInFormat("hex"),
                                }}
                            ></div>
                            <div className="mt-2 text-center font-mono text-sm">
                                {getColorInFormat("hex")}
                            </div>
                            <div className="mt-2 text-center font-mono text-sm">
                                {getColorInFormat("rgb")}
                            </div>
                            <div className="mt-2 text-center font-mono text-sm">
                                {getColorInFormat("hsl")}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Accessibility Tab */}
                <TabsContent value="accessibility" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="p-4 border rounded-md">
                                <h3 className="font-medium mb-2">
                                    Contrast Ratios
                                </h3>
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
                                        <span>
                                            {contrastInfo.betterTextColor}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-md">
                                <h3 className="font-medium mb-2">
                                    WCAG Compliance
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>WCAG AA (minimum 4.5:1):</span>
                                        <span>
                                            {contrastInfo.wcagAA
                                                ? "✓ Pass"
                                                : "✗ Fail"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>WCAG AAA (minimum 7:1):</span>
                                        <span>
                                            {contrastInfo.wcagAAA
                                                ? "✓ Pass"
                                                : "✗ Fail"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="p-6 rounded-md flex items-center justify-center"
                                style={{
                                    backgroundColor: getColorInFormat("hex"),
                                    color: contrastInfo.betterTextColor,
                                    height: "180px",
                                }}
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">
                                        Sample Text
                                    </h3>
                                    <p>
                                        This is how text would look on this
                                        background color
                                    </p>
                                    <p className="text-sm mt-2">
                                        Using {contrastInfo.betterTextColor}{" "}
                                        text for best contrast
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className="p-4 rounded-md flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            getColorInFormat("hex"),
                                        color: "black",
                                        height: "80px",
                                    }}
                                >
                                    <span>Black Text</span>
                                </div>
                                <div
                                    className="p-4 rounded-md flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            getColorInFormat("hex"),
                                        color: "white",
                                        height: "80px",
                                    }}
                                >
                                    <span>White Text</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ColorConverter;
