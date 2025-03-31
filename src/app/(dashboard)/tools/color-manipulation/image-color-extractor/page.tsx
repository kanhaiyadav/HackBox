"use client";
// pages/index.tsx
import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import chroma from "chroma-js";
import {
    ArrowUpCircle,
    PaletteIcon,
    SwatchBook,
    Table,
    ShareIcon,
} from "lucide-react";

interface ColorInfo {
    hex: string;
    rgb: string;
    hsl: string;
    percentage: number;
}

const ColorExtractor: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [colors, setColors] = useState<ColorInfo[]>([]);
    const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
    const [extractionMethod, setExtractionMethod] = useState<
        "dominant" | "palette" | "quantize"
    >("dominant");
    const [colorCount, setColorCount] = useState<number>(5);
    const [quality, setQuality] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [brightnessSort, setBrightnessSort] = useState<boolean>(false);
    const [saturationSort, setSaturationSort] = useState<boolean>(false);
    const [complementaryColors, setComplementaryColors] = useState<ColorInfo[]>(
        []
    );
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (imageUrl && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                    // Set canvas dimensions to match image
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw image to canvas
                    ctx.drawImage(img, 0, 0);

                    // Extract colors based on selected method
                    extractColors(ctx, canvas.width, canvas.height);
                    setIsLoading(false);
                };
                img.src = imageUrl;
            }
        }
    }, [imageUrl, extractionMethod, colorCount, quality]);

    useEffect(() => {
        if (selectedColor) {
            generateComplementaryColors(selectedColor.hex);
        }
    }, [selectedColor]);

    const extractColors = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
        const pixelData = ctx.getImageData(0, 0, width, height).data;
        const colorMap = new Map<string, number>();
        const totalPixels = width * height;

        // Sample pixels based on quality setting
        const sampleRate = Math.max(1, Math.floor(100 / quality));

        for (let i = 0; i < pixelData.length; i += 4 * sampleRate) {
            const r = pixelData[i];
            const g = pixelData[i + 1];
            const b = pixelData[i + 2];
            const a = pixelData[i + 3];

            // Skip transparent pixels
            if (a < 128) continue;

            // Create hex color
            const hex = chroma(r, g, b).hex();

            // Update color map
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }

        // Convert map to array and sort by frequency
        let colorArray = Array.from(colorMap.entries()).map(([hex, count]) => {
            const chromaColor = chroma(hex);
            return {
                hex,
                rgb: `rgb(${Math.round(chromaColor.get("rgb.r"))}, ${Math.round(
                    chromaColor.get("rgb.g")
                )}, ${Math.round(chromaColor.get("rgb.b"))})`,
                hsl: `hsl(${Math.round(
                    chromaColor.get("hsl.h") || 0
                )}, ${Math.round(
                    chromaColor.get("hsl.s") * 100
                )}%, ${Math.round(chromaColor.get("hsl.l") * 100)}%)`,
                percentage: (count / (totalPixels / sampleRate)) * 100,
            };
        });

        // Sort by frequency
        colorArray.sort((a, b) => b.percentage - a.percentage);

        if (extractionMethod === "dominant") {
            // Just take the top colors
            colorArray = colorArray.slice(0, colorCount);
        } else if (extractionMethod === "palette") {
            // Use k-means clustering for better palette
            const uniqueColors = colorArray.slice(
                0,
                Math.min(1000, colorArray.length)
            );
            const kMeansColors = kMeansClustering(
                uniqueColors.map((c) => ({
                    hex: c.hex,
                    rgb: chroma(c.hex).rgb(),
                    weight: c.percentage,
                })),
                colorCount
            );
            colorArray = kMeansColors.map((hex) => {
                const chromaColor = chroma(hex);
                return {
                    hex,
                    rgb: `rgb(${Math.round(
                        chromaColor.get("rgb.r")
                    )}, ${Math.round(chromaColor.get("rgb.g"))}, ${Math.round(
                        chromaColor.get("rgb.b")
                    )})`,
                    hsl: `hsl(${Math.round(
                        chromaColor.get("hsl.h") || 0
                    )}, ${Math.round(
                        chromaColor.get("hsl.s") * 100
                    )}%, ${Math.round(chromaColor.get("hsl.l") * 100)}%)`,
                    percentage: 0, // Recalculate percentage if needed
                };
            });
        } else if (extractionMethod === "quantize") {
            // Use median cut quantization
            const uniqueColors = colorArray.slice(
                0,
                Math.min(2000, colorArray.length)
            );
            const quantizedColors = medianCutQuantization(
                uniqueColors.map((c) => ({
                    hex: c.hex,
                    rgb: chroma(c.hex).rgb(),
                    weight: c.percentage,
                })),
                colorCount
            );
            colorArray = quantizedColors.map((hex) => {
                const chromaColor = chroma(hex);
                return {
                    hex,
                    rgb: `rgb(${Math.round(
                        chromaColor.get("rgb.r")
                    )}, ${Math.round(chromaColor.get("rgb.g"))}, ${Math.round(
                        chromaColor.get("rgb.b")
                    )})`,
                    hsl: `hsl(${Math.round(
                        chromaColor.get("hsl.h") || 0
                    )}, ${Math.round(
                        chromaColor.get("hsl.s") * 100
                    )}%, ${Math.round(chromaColor.get("hsl.l") * 100)}%)`,
                    percentage: 0, // Recalculate percentage if needed
                };
            });
        }

        // Apply sorting if needed
        if (brightnessSort) {
            colorArray.sort(
                (a, b) => chroma(b.hex).luminance() - chroma(a.hex).luminance()
            );
        }

        if (saturationSort) {
            colorArray.sort(
                (a, b) =>
                    chroma(b.hex).get("hsl.s") - chroma(a.hex).get("hsl.s")
            );
        }

        setColors(colorArray);
        setSelectedColor(colorArray.length > 0 ? colorArray[0] : null);
    };

    // K-means clustering for better palette extraction
    const kMeansClustering = (
        colors: { hex: string; rgb: number[]; weight: number }[],
        k: number
    ): string[] => {
        // Initialize centroids randomly
        let centroids = Array(k)
            .fill(0)
            .map(() => {
                const randomIndex = Math.floor(Math.random() * colors.length);
                return [...colors[randomIndex].rgb];
            });

        let iterations = 0;
        let oldCentroids: number[][] = [];

        // Iterate until convergence or max iterations
        while (iterations < 10 && !areCentroidsEqual(centroids, oldCentroids)) {
            oldCentroids = centroids.map((c) => [...c]);

            // Assign colors to nearest centroid
            const clusters: { rgb: number[]; weight: number }[][] = Array(k)
                .fill(0)
                .map(() => []);

            colors.forEach((color) => {
                let minDistance = Infinity;
                let closestCentroid = 0;

                for (let i = 0; i < centroids.length; i++) {
                    const distance = euclideanDistance(color.rgb, centroids[i]);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCentroid = i;
                    }
                }

                clusters[closestCentroid].push({
                    rgb: color.rgb,
                    weight: color.weight,
                });
            });

            // Update centroids
            centroids = clusters.map((cluster, i) => {
                if (cluster.length === 0) return oldCentroids[i];

                const totalWeight = cluster.reduce(
                    (sum, c) => sum + c.weight,
                    0
                );

                return [
                    cluster.reduce((sum, c) => sum + c.rgb[0] * c.weight, 0) /
                        totalWeight,
                    cluster.reduce((sum, c) => sum + c.rgb[1] * c.weight, 0) /
                        totalWeight,
                    cluster.reduce((sum, c) => sum + c.rgb[2] * c.weight, 0) /
                        totalWeight,
                ];
            });

            iterations++;
        }

        // Convert centroids back to hex
        return centroids.map((centroid) =>
            chroma(
                Math.round(centroid[0]),
                Math.round(centroid[1]),
                Math.round(centroid[2])
            ).hex()
        );
    };

    // Median cut quantization algorithm
    const medianCutQuantization = (
        colors: { hex: string; rgb: number[]; weight: number }[],
        k: number
    ): string[] => {
        if (colors.length <= k) {
            return colors.map((c) => c.hex);
        }

        let buckets: { hex: string; rgb: number[]; weight: number }[][] = [
            colors,
        ];

        while (buckets.length < k) {
            // Find bucket with largest range
            let bucketToSplit = 0;
            let maxRange = -1;

            for (let i = 0; i < buckets.length; i++) {
                const bucket = buckets[i];
                const ranges = [0, 1, 2].map((channel) => {
                    const values = bucket.map((c) => c.rgb[channel]);
                    return Math.max(...values) - Math.min(...values);
                });

                const bucketRange = Math.max(...ranges);
                if (bucketRange > maxRange) {
                    maxRange = bucketRange;
                    bucketToSplit = i;
                }
            }

            // No more splitting possible
            if (maxRange <= 0) break;

            const bucket = buckets[bucketToSplit];
            const channelToSplit = [0, 1, 2].reduce((maxChannel, channel) => {
                const values = bucket.map((c) => c.rgb[channel]);
                const range = Math.max(...values) - Math.min(...values);
                return range >
                    bucket
                        .map((c) => c.rgb[maxChannel])
                        .reduce((max, v) => Math.max(max, v), -Infinity) -
                        bucket
                            .map((c) => c.rgb[maxChannel])
                            .reduce((min, v) => Math.min(min, v), Infinity)
                    ? channel
                    : maxChannel;
            }, 0);

            // Sort by the channel we're splitting on
            bucket.sort(
                (a, b) => a.rgb[channelToSplit] - b.rgb[channelToSplit]
            );

            // Find median point
            const totalWeight = bucket.reduce((sum, c) => sum + c.weight, 0);
            let weightSum = 0;
            let medianIndex = 0;

            for (let i = 0; i < bucket.length; i++) {
                weightSum += bucket[i].weight;
                if (weightSum >= totalWeight / 2) {
                    medianIndex = i;
                    break;
                }
            }

            // Split bucket
            const bucket1 = bucket.slice(0, medianIndex + 1);
            const bucket2 = bucket.slice(medianIndex + 1);

            // Replace old bucket with the two new ones
            buckets.splice(bucketToSplit, 1, bucket1, bucket2);
        }

        // Average colors in each bucket to get final palette
        return buckets.map((bucket) => {
            if (bucket.length === 0) return "#000000";

            const totalWeight = bucket.reduce((sum, c) => sum + c.weight, 0);
            const avgR =
                bucket.reduce((sum, c) => sum + c.rgb[0] * c.weight, 0) /
                totalWeight;
            const avgG =
                bucket.reduce((sum, c) => sum + c.rgb[1] * c.weight, 0) /
                totalWeight;
            const avgB =
                bucket.reduce((sum, c) => sum + c.rgb[2] * c.weight, 0) /
                totalWeight;

            return chroma(
                Math.round(avgR),
                Math.round(avgG),
                Math.round(avgB)
            ).hex();
        });
    };

    const euclideanDistance = (a: number[], b: number[]): number => {
        return Math.sqrt(
            a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0)
        );
    };

    const areCentroidsEqual = (a: number[][], b: number[][]): boolean => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!a[i].every((val, j) => Math.abs(val - b[i][j]) < 0.1))
                return false;
        }
        return true;
    };

    const generateComplementaryColors = (hexColor: string) => {
        const chromaColor = chroma(hexColor);

        // Generate complementary color schemes
        const complementary = chroma(hexColor).set(
            "hsl.h",
            (chromaColor.get("hsl.h") + 180) % 360
        );
        const triadic1 = chroma(hexColor).set(
            "hsl.h",
            (chromaColor.get("hsl.h") + 120) % 360
        );
        const triadic2 = chroma(hexColor).set(
            "hsl.h",
            (chromaColor.get("hsl.h") + 240) % 360
        );
        const analogous1 = chroma(hexColor).set(
            "hsl.h",
            (chromaColor.get("hsl.h") + 30) % 360
        );
        const analogous2 = chroma(hexColor).set(
            "hsl.h",
            (chromaColor.get("hsl.h") - 30 + 360) % 360
        );

        const complementaryColors = [
            {
                hex: complementary.hex(),
                rgb: `rgb(${Math.round(
                    complementary.get("rgb.r")
                )}, ${Math.round(complementary.get("rgb.g"))}, ${Math.round(
                    complementary.get("rgb.b")
                )})`,
                hsl: `hsl(${Math.round(
                    complementary.get("hsl.h") || 0
                )}, ${Math.round(
                    complementary.get("hsl.s") * 100
                )}%, ${Math.round(complementary.get("hsl.l") * 100)}%)`,
                percentage: 0,
            },
            {
                hex: triadic1.hex(),
                rgb: `rgb(${Math.round(triadic1.get("rgb.r"))}, ${Math.round(
                    triadic1.get("rgb.g")
                )}, ${Math.round(triadic1.get("rgb.b"))})`,
                hsl: `hsl(${Math.round(
                    triadic1.get("hsl.h") || 0
                )}, ${Math.round(triadic1.get("hsl.s") * 100)}%, ${Math.round(
                    triadic1.get("hsl.l") * 100
                )}%)`,
                percentage: 0,
            },
            {
                hex: triadic2.hex(),
                rgb: `rgb(${Math.round(triadic2.get("rgb.r"))}, ${Math.round(
                    triadic2.get("rgb.g")
                )}, ${Math.round(triadic2.get("rgb.b"))})`,
                hsl: `hsl(${Math.round(
                    triadic2.get("hsl.h") || 0
                )}, ${Math.round(triadic2.get("hsl.s") * 100)}%, ${Math.round(
                    triadic2.get("hsl.l") * 100
                )}%)`,
                percentage: 0,
            },
            {
                hex: analogous1.hex(),
                rgb: `rgb(${Math.round(analogous1.get("rgb.r"))}, ${Math.round(
                    analogous1.get("rgb.g")
                )}, ${Math.round(analogous1.get("rgb.b"))})`,
                hsl: `hsl(${Math.round(
                    analogous1.get("hsl.h") || 0
                )}, ${Math.round(analogous1.get("hsl.s") * 100)}%, ${Math.round(
                    analogous1.get("hsl.l") * 100
                )}%)`,
                percentage: 0,
            },
            {
                hex: analogous2.hex(),
                rgb: `rgb(${Math.round(analogous2.get("rgb.r"))}, ${Math.round(
                    analogous2.get("rgb.g")
                )}, ${Math.round(analogous2.get("rgb.b"))})`,
                hsl: `hsl(${Math.round(
                    analogous2.get("hsl.h") || 0
                )}, ${Math.round(analogous2.get("hsl.s") * 100)}%, ${Math.round(
                    analogous2.get("hsl.l") * 100
                )}%)`,
                percentage: 0,
            },
        ];

        setComplementaryColors(complementaryColors);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const downloadPalette = () => {
        // Create a JSON representation of the palette
        const paletteData = {
            colors: colors.map((c) => ({
                hex: c.hex,
                rgb: c.rgb,
                hsl: c.hsl,
                percentage: c.percentage,
            })),
            extractionMethod,
            colorCount,
            quality,
        };

        // Create a blob and download link
        const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "color-palette.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const sharePalette = () => {
        // Create a shareable URL with the palette data
        const paletteData = {
            colors: colors.map((c) => c.hex),
            method: extractionMethod,
        };

        const shareUrl = `${
            window.location.origin
        }?palette=${encodeURIComponent(JSON.stringify(paletteData))}`;

        navigator.clipboard.writeText(shareUrl);
        alert("Shareable link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head>
                <title>Advanced Color Extractor</title>
                <meta
                    name="description"
                    content="Extract colors from any image with advanced features"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    Advanced Color Extractor
                </h1>

                {/* Image Upload */}
                <div
                    className="bg-white p-6 rounded-lg shadow-md mb-8 border-2 border-dashed border-gray-300 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    {!imageUrl ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <ArrowUpCircle className="w-16 h-16 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">
                                Upload an image
                            </h2>
                            <p className="text-gray-500 mb-4">
                                Drag and drop or click to select
                            </p>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Select Image
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="relative max-w-md mb-4">
                                <img
                                    src={imageUrl}
                                    alt="Uploaded image"
                                    className="max-w-full h-auto rounded-md"
                                />
                                <button
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
                                    onClick={() => {
                                        setImageUrl(null);
                                        setColors([]);
                                        setSelectedColor(null);
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Image
                            </button>
                        </div>
                    )}
                </div>

                {/* Hidden canvas for image processing */}
                <canvas ref={canvasRef} className="hidden"></canvas>

                {/* Extraction Controls */}
                {imageUrl && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Extraction Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Extraction Method
                                </label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        className={`px-4 py-2 rounded-md ${
                                            extractionMethod === "dominant"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200"
                                        }`}
                                        onClick={() =>
                                            setExtractionMethod("dominant")
                                        }
                                    >
                                        Dominant
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-md ${
                                            extractionMethod === "palette"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200"
                                        }`}
                                        onClick={() =>
                                            setExtractionMethod("palette")
                                        }
                                    >
                                        Palette
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-md ${
                                            extractionMethod === "quantize"
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200"
                                        }`}
                                        onClick={() =>
                                            setExtractionMethod("quantize")
                                        }
                                    >
                                        Quantize
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color Count: {colorCount}
                                </label>
                                <input
                                    type="range"
                                    min="2"
                                    max="16"
                                    value={colorCount}
                                    onChange={(e) =>
                                        setColorCount(parseInt(e.target.value))
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quality: {quality}%
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e) =>
                                        setQuality(parseInt(e.target.value))
                                    }
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort Options
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={brightnessSort}
                                            onChange={() => {
                                                setBrightnessSort(
                                                    !brightnessSort
                                                );
                                                if (!brightnessSort)
                                                    setSaturationSort(false);
                                            }}
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                        />
                                        <span className="ml-2">Brightness</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={saturationSort}
                                            onChange={() => {
                                                setSaturationSort(
                                                    !saturationSort
                                                );
                                                if (!saturationSort)
                                                    setBrightnessSort(false);
                                            }}
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                        />
                                        <span className="ml-2">Saturation</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Color Results */}
                {colors.length > 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Extracted Colors
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    className={`p-2 rounded-md ${
                                        viewMode === "grid"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Table className="w-5 h-5" />
                                </button>
                                <button
                                    className={`p-2 rounded-md ${
                                        viewMode === "list"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200"
                                    }`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <SwatchBook className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                    onClick={downloadPalette}
                                >
                                    <ArrowUpCircle className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                    onClick={sharePalette}
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-lg overflow-hidden shadow-md cursor-pointer border-2 ${
                                            selectedColor?.hex === color.hex
                                                ? "border-blue-500"
                                                : "border-transparent"
                                        }`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        <div
                                            className="h-24"
                                            style={{
                                                backgroundColor: color.hex,
                                            }}
                                        ></div>
                                        <div className="p-2 bg-white">
                                            <p className="font-mono text-sm mb-1">
                                                {color.hex}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {color.percentage.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                                            selectedColor?.hex === color.hex
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-md mr-4"
                                            style={{
                                                backgroundColor: color.hex,
                                            }}
                                        ></div>
                                        <div className="flex-1">
                                            <p className="font-mono font-semibold">
                                                {color.hex}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {color.rgb}
                                            </p>
                                        </div>
                                        <div className="w-16 text-right">
                                            <p className="font-semibold">
                                                {color.percentage.toFixed(1)}%
                                            </p>
                                        </div>
                                        <button
                                            className="ml-2 p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(color.hex);
                                                alert(
                                                    `Copied ${color.hex} to clipboard!`
                                                );
                                            }}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Selected Color Details */}
                {selectedColor && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Selected Color Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div
                                    className="h-40 rounded-lg mb-4"
                                    style={{
                                        backgroundColor: selectedColor.hex,
                                    }}
                                ></div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            HEX
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <p className="font-mono font-semibold">
                                                {selectedColor.hex}
                                            </p>
                                            <button
                                                className="p-1 text-gray-500 hover:bg-gray-200 rounded-md"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedColor.hex
                                                    )
                                                }
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            RGB
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <p className="font-mono font-semibold text-sm">
                                                {selectedColor.rgb}
                                            </p>
                                            <button
                                                className="p-1 text-gray-500 hover:bg-gray-200 rounded-md"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedColor.rgb
                                                    )
                                                }
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            HSL
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <p className="font-mono font-semibold text-sm">
                                                {selectedColor.hsl}
                                            </p>
                                            <button
                                                className="p-1 text-gray-500 hover:bg-gray-200 rounded-md"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedColor.hsl
                                                    )
                                                }
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            Usage
                                        </h3>
                                        <p className="font-semibold">
                                            {selectedColor.percentage.toFixed(
                                                1
                                            )}
                                            %
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    Complementary Colors
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                                            Complementary
                                        </h4>
                                        <div className="flex space-x-2">
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        selectedColor.hex,
                                                }}
                                            ></div>
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        complementaryColors[0]
                                                            ?.hex,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                                            Triadic
                                        </h4>
                                        <div className="flex space-x-2">
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        selectedColor.hex,
                                                }}
                                            ></div>
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        complementaryColors[1]
                                                            ?.hex,
                                                }}
                                            ></div>
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        complementaryColors[2]
                                                            ?.hex,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                                            Analogous
                                        </h4>
                                        <div className="flex space-x-2">
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        complementaryColors[3]
                                                            ?.hex,
                                                }}
                                            ></div>
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        selectedColor.hex,
                                                }}
                                            ></div>
                                            <div
                                                className="w-12 h-12 rounded-md"
                                                style={{
                                                    backgroundColor:
                                                        complementaryColors[4]
                                                            ?.hex,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                                            Shades
                                        </h4>
                                        <div className="flex space-x-2">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => {
                                                    const shade = chroma(
                                                        selectedColor.hex
                                                    ).darken((i + 1) * 0.5);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="w-12 h-12 rounded-md cursor-pointer"
                                                            style={{
                                                                backgroundColor:
                                                                    shade.hex(),
                                                            }}
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    shade.hex()
                                                                )
                                                            }
                                                            title={shade.hex()}
                                                        ></div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                                            Tints
                                        </h4>
                                        <div className="flex space-x-2">
                                            {Array.from({ length: 5 }).map(
                                                (_, i) => {
                                                    const tint = chroma(
                                                        selectedColor.hex
                                                    ).brighten((i + 1) * 0.5);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className="w-12 h-12 rounded-md cursor-pointer"
                                                            style={{
                                                                backgroundColor:
                                                                    tint.hex(),
                                                            }}
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    tint.hex()
                                                                )
                                                            }
                                                            title={tint.hex()}
                                                        ></div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Usage Examples */}
                {selectedColor && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Usage Examples
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    CSS Variables
                                </h3>
                                <pre className="bg-gray-50 p-4 rounded-md text-sm font-mono overflow-x-auto">
                                    {`:root {
  --primary-color: ${selectedColor.hex};
  --primary-color-rgb: ${chroma(selectedColor.hex).rgb().join(", ")};
  --primary-color-contrast: ${
      chroma.contrast(selectedColor.hex, "#ffffff") > 4.5
          ? "#ffffff"
          : "#000000"
  };
}`}
                                </pre>
                                <button
                                    className="mt-2 text-blue-500 text-sm flex items-center"
                                    onClick={() =>
                                        copyToClipboard(`:root {
  --primary-color: ${selectedColor.hex};
  --primary-color-rgb: ${chroma(selectedColor.hex).rgb().join(", ")};
  --primary-color-contrast: ${
      chroma.contrast(selectedColor.hex, "#ffffff") > 4.5
          ? "#ffffff"
          : "#000000"
  };
}`)
                                    }
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Copy CSS
                                </button>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    Tailwind Config
                                </h3>
                                <pre className="bg-gray-50 p-4 rounded-md text-sm font-mono overflow-x-auto">
                                    {`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${selectedColor.hex}',
          light: '${chroma(selectedColor.hex).brighten(1).hex()}',
          dark: '${chroma(selectedColor.hex).darken(1).hex()}'
        }
      }
    }
  }
}`}
                                </pre>
                                <button
                                    className="mt-2 text-blue-500 text-sm flex items-center"
                                    onClick={() =>
                                        copyToClipboard(`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${selectedColor.hex}',
          light: '${chroma(selectedColor.hex).brighten(1).hex()}',
          dark: '${chroma(selectedColor.hex).darken(1).hex()}'
        }
      }
    }
  }
}`)
                                    }
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Copy Config
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Color Accessibility */}
                {selectedColor && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Accessibility
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    Contrast Ratio
                                </h3>

                                <div className="space-y-4">
                                    <div
                                        className="flex items-center justify-between p-3 rounded-md"
                                        style={{
                                            backgroundColor: selectedColor.hex,
                                            color:
                                                chroma.contrast(
                                                    selectedColor.hex,
                                                    "#ffffff"
                                                ) > 4.5
                                                    ? "#ffffff"
                                                    : "#000000",
                                        }}
                                    >
                                        <p className="font-medium">
                                            White Text
                                        </p>
                                        <div
                                            className={`px-2 py-1 rounded-md text-sm ${
                                                chroma.contrast(
                                                    selectedColor.hex,
                                                    "#ffffff"
                                                ) >= 4.5
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {chroma
                                                .contrast(
                                                    selectedColor.hex,
                                                    "#ffffff"
                                                )
                                                .toFixed(2)}{" "}
                                            : 1{" "}
                                            {chroma.contrast(
                                                selectedColor.hex,
                                                "#ffffff"
                                            ) >= 4.5
                                                ? "✓"
                                                : "✗"}
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center justify-between p-3 rounded-md"
                                        style={{
                                            backgroundColor: selectedColor.hex,
                                            color:
                                                chroma.contrast(
                                                    selectedColor.hex,
                                                    "#000000"
                                                ) > 4.5
                                                    ? "#000000"
                                                    : "#ffffff",
                                        }}
                                    >
                                        <p className="font-medium">
                                            Black Text
                                        </p>
                                        <div
                                            className={`px-2 py-1 rounded-md text-sm ${
                                                chroma.contrast(
                                                    selectedColor.hex,
                                                    "#000000"
                                                ) >= 4.5
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {chroma
                                                .contrast(
                                                    selectedColor.hex,
                                                    "#000000"
                                                )
                                                .toFixed(2)}{" "}
                                            : 1{" "}
                                            {chroma.contrast(
                                                selectedColor.hex,
                                                "#000000"
                                            ) >= 4.5
                                                ? "✓"
                                                : "✗"}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-2">
                                    WCAG AA requires a contrast ratio of at
                                    least 4.5:1 for normal text and 3:1 for
                                    large text.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-3">
                                    Color Blindness Simulation
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Protanopia
                                        </p>
                                        <div
                                            className="h-10 rounded-md"
                                            style={{
                                                backgroundColor: chroma(
                                                    selectedColor.hex
                                                )
                                                    .set(
                                                        "lch.c",
                                                        chroma(
                                                            selectedColor.hex
                                                        ).get("lch.c") * 0.5
                                                    )
                                                    .hex(),
                                            }}
                                        ></div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Deuteranopia
                                        </p>
                                        <div
                                            className="h-10 rounded-md"
                                            style={{
                                                backgroundColor: chroma(
                                                    selectedColor.hex
                                                )
                                                    .set(
                                                        "lch.c",
                                                        chroma(
                                                            selectedColor.hex
                                                        ).get("lch.c") * 0.6
                                                    )
                                                    .hex(),
                                            }}
                                        ></div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Tritanopia
                                        </p>
                                        <div
                                            className="h-10 rounded-md"
                                            style={{
                                                backgroundColor: chroma(
                                                    selectedColor.hex
                                                )
                                                    .set(
                                                        "lch.h",
                                                        (chroma(
                                                            selectedColor.hex
                                                        ).get("lch.h") +
                                                            120) %
                                                            360
                                                    )
                                                    .hex(),
                                            }}
                                        ></div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">
                                            Grayscale
                                        </p>
                                        <div
                                            className="h-10 rounded-md"
                                            style={{
                                                backgroundColor: chroma(
                                                    selectedColor.hex
                                                )
                                                    .desaturate(1)
                                                    .hex(),
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-2">
                                    These are simplified simulations. For more
                                    accurate results, use specialized tools.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-white py-6 mt-8">
                <div className="container mx-auto px-4 text-center text-gray-500">
                    <p>
                        Advanced Color Extractor - Built with Next.js, Tailwind
                        CSS, and chroma.js
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ColorExtractor;
