"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import chroma from "chroma-js";
import { useDropzone } from "react-dropzone";
import { TbLibraryPhoto } from "react-icons/tb";

// Types of color blindness
type ColorBlindnessType =
    | "normal"
    | "protanopia"
    | "deuteranopia"
    | "tritanopia"
    | "achromatopsia";

// Color transformation matrices for different types of color blindness
const colorBlindnessMatrices: Record<
    Exclude<ColorBlindnessType, "normal">,
    number[][]
> = {
    protanopia: [
        [0.567, 0.433, 0],
        [0.558, 0.442, 0],
        [0, 0.242, 0.758],
    ],
    deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7],
    ],
    tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.433, 0.567],
        [0, 0.475, 0.525],
    ],
    achromatopsia: [
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
    ],
};

// Descriptions for each type of color blindness
const colorBlindnessDescriptions: Record<ColorBlindnessType, string> = {
    normal: "Normal vision with no color deficiency.",
    protanopia:
        "Red-blind (cannot see red light). Difficulty distinguishing between red and green colors, and red and black colors.",
    deuteranopia:
        "Green-blind (cannot see green light). Similar to protanopia but with less severity in the red spectrum.",
    tritanopia:
        "Blue-blind (cannot see blue light). Difficulty distinguishing between blue and green colors, and yellow and violet colors.",
    achromatopsia:
        "Complete color blindness. No ability to see colors at all, only shades of gray.",
};

const ColorBlindnessSimulator: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>("#1E90FF");
    const [colorMode, setColorMode] = useState<boolean>(false);
    const [currentView, setCurrentView] =
        useState<ColorBlindnessType>("normal");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps ,isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "image/webp",
            ]
        },
    });

    // Process image for selected color blindness type
    useEffect(() => {
        if (uploadedImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                const img = new Image();
                img.onload = () => {
                    // Set canvas dimensions to match the image
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw the original image
                    ctx.drawImage(img, 0, 0);

                    // Apply color blindness filter if not normal vision
                    if (currentView !== "normal") {
                        const imageData = ctx.getImageData(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );
                        const data = imageData.data;
                        const matrix =
                            colorBlindnessMatrices[
                                currentView as Exclude<
                                    ColorBlindnessType,
                                    "normal"
                                >
                            ];

                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i] / 255;
                            const g = data[i + 1] / 255;
                            const b = data[i + 2] / 255;

                            data[i] = Math.min(
                                255,
                                Math.max(
                                    0,
                                    Math.round(
                                        (r * matrix[0][0] +
                                            g * matrix[0][1] +
                                            b * matrix[0][2]) *
                                            255
                                    )
                                )
                            );
                            data[i + 1] = Math.min(
                                255,
                                Math.max(
                                    0,
                                    Math.round(
                                        (r * matrix[1][0] +
                                            g * matrix[1][1] +
                                            b * matrix[1][2]) *
                                            255
                                    )
                                )
                            );
                            data[i + 2] = Math.min(
                                255,
                                Math.max(
                                    0,
                                    Math.round(
                                        (r * matrix[2][0] +
                                            g * matrix[2][1] +
                                            b * matrix[2][2]) *
                                            255
                                    )
                                )
                            );
                        }

                        ctx.putImageData(imageData, 0, 0);
                    }
                };
                img.src = uploadedImage;
            }
        }
    }, [uploadedImage, currentView]);

    // Handle file upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle between color picker and image upload modes
    const toggleMode = () => {
        setColorMode(!colorMode);
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

    // Suggest alternative colors for better accessibility
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

    return (
        <div className="max-w-6xl mx-auto px-4 pb-2">
            <div className="flex justify-center mb-6 outline-primary outline-2 bg-accent w-fit m-auto rounded-md">
                <button
                    onClick={toggleMode}
                    className={` transition-colors px-8 py-2 rounded-md ${
                        colorMode
                            ? "bg-primary text-black hover:bg-primary/80"
                            : ""
                    }`}
                >
                    Color Mode
                </button>
                <button
                    onClick={toggleMode}
                    className={` transition-colors px-8 py-2 rounded-md ${
                        !colorMode
                            ? "bg-primary text-black hover:bg-primary/80"
                            : ""
                    }`}
                >
                    Image Mode
                </button>
            </div>

            {/* Color Picker Mode */}
            {colorMode && (
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-1">
                                Select a Color:
                            </label>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) =>
                                    setSelectedColor(e.target.value)
                                }
                                className="h-12 w-full cursor-pointer "
                            />
                            <div className="font-mono">{selectedColor}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {(
                            Object.keys(
                                colorBlindnessDescriptions
                            ) as ColorBlindnessType[]
                        ).map((type) => (
                            <div
                                key={type}
                                className="foreground shadow-foreground p-4 rounded-lg"
                            >
                                <div className="text-lg font-semibold mb-2">
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
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
                                        <div className="font-mono text-sm">
                                            {color}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="mt-4 p-4 bg-accent shadow-foreground rounded-md">
                            <h3 className="font-semibold mb-2">
                                Accessibility Tips:
                            </h3>
                            <ul className="list-disc pl-5 text-sm">
                                <li>
                                    Use high contrast between text and
                                    background colors
                                </li>
                                <li>
                                    Avoid red-green color combinations for
                                    important information
                                </li>
                                <li>
                                    Include patterns or shapes along with color
                                    coding
                                </li>
                                <li>
                                    Provide text alternatives for color-based
                                    information
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Upload Mode */}
            {!colorMode && (
                <div className="mb-8">
                    <div {...getRootProps()} className="mb-6">
                        <input {...getInputProps()} />
                        <div
                            className={`border-3 border-dashed border-accent rounded-md p-4 text-center py-[50px] ${
                                isDragActive
                                    ? "bg-primary/10 border-primary/60"
                                    : "bg-accent/10"
                            }`}
                        >
                            {isDragActive ? (
                                <div className="flex flex-col items-center justify-center">
                                    <TbLibraryPhoto className="inline-block mr-2 text-6xl text-gray-600" />
                                    <p className="text-gray-500">
                                        Drop the image file here
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center">
                                    <TbLibraryPhoto className="inline-block mr-2 text-6xl text-gray-600" />
                                    <p className="text-gray-500">
                                        Drop the image file here, or click to
                                        select
                                    </p>
                                </div>
                                // <p className="text-gray-500">
                                //     Drag & drop an image file here, or click to
                                //     select one
                                // </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                        {(
                            Object.keys(
                                colorBlindnessDescriptions
                            ) as ColorBlindnessType[]
                        ).map((type) => (
                            <button
                                key={type}
                                onClick={() => setCurrentView(type)}
                                className={`px-3 py-1 rounded-md ${
                                    currentView === type
                                        ? "bg-primary text-black shadow-input"
                                        : "bg-accent shadow-input"
                                }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="foreground shadow-inset py-6 px-8 rounded-lg">
                        <h3 className="text-lg font-semibold mb-0 text-white/80 underline underline-offset-2">
                            {currentView.charAt(0).toUpperCase() +
                                currentView.slice(1)}{" "}
                            View
                        </h3>
                        <p className="mb-4 text-white/80">
                            {colorBlindnessDescriptions[currentView]}
                        </p>

                        {uploadedImage ? (
                            <div className="overflow-auto border border-gray-300 rounded-md">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full h-auto"
                                ></canvas>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-64 bg-accent rounded-md">
                                <p className="text-white/50">
                                    Upload an image to see how it appears with
                                    different color vision deficiencies
                                </p>
                            </div>
                        )}
                    </div>

                    {uploadedImage && (
                        <div className="mt-6 p-4 foreground shadow-inset rounded-lg">
                            <h3 className="font-semibold mb-2">
                                Image Accessibility Recommendations:
                            </h3>
                            <ul className="list-disc pl-5 text-sm">
                                <li>
                                    Ensure important information isn&apos;t
                                    conveyed by color alone
                                </li>
                                <li>
                                    Add text labels or patterns to differentiate
                                    between areas
                                </li>
                                <li>
                                    Use a color-safe palette with high contrast
                                    for important elements
                                </li>
                                <li>
                                    Include alternative text descriptions for
                                    images
                                </li>
                                <li>
                                    Consider adjusting saturation and brightness
                                    for better visibility
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div className="foreground shadow-inset p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">
                    About Color Blindness
                </h2>
                <p className="mb-4">
                    Color blindness affects approximately 1 in 12 men and 1 in
                    200 women worldwide. It&apos;s usually inherited genetically
                    but can also result from eye, nerve, or brain damage, or due
                    to exposure to certain chemicals.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(
                        Object.keys(
                            colorBlindnessDescriptions
                        ) as ColorBlindnessType[]
                    )
                        .filter((type) => type !== "normal")
                        .map((type) => (
                            <div
                                key={type}
                                className="bg-accent shadow-foreground p-4 rounded-md"
                            >
                                <h3 className="font-semibold mb-2">
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                </h3>
                                <p className="text-sm">
                                    {colorBlindnessDescriptions[type]}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ColorBlindnessSimulator;
