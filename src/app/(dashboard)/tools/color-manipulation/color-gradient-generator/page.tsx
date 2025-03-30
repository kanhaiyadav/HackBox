'use client';

import React, { useState, useEffect } from "react";
import chroma from "chroma-js";

const GradientGenerator = () => {
    // Gradient type state
    const [gradientType, setGradientType] = useState("linear");

    // Color stops state
    const [colorStops, setColorStops] = useState([
        { color: "#ff0080", position: 0 },
        { color: "#7928ca", position: 100 },
    ]);

    // Additional settings state
    const [angle, setAngle] = useState(90);
    const [radialShape, setRadialShape] = useState("circle");
    const [radialPosition, setRadialPosition] = useState("center");
    const [conicAngle, setConicAngle] = useState(0);
    const [conicPosition, setConicPosition] = useState("center");

    // Preview size state
    const [previewSize, setPreviewSize] = useState({ width: 400, height: 300 });

    // CSS output state
    const [cssOutput, setCssOutput] = useState("");

    // Generate gradient CSS
    useEffect(() => {
        let gradientCSS = "";

        // Build color stops string
        const stopsString = colorStops
            .sort((a, b) => a.position - b.position)
            .map((stop) => `${stop.color} ${stop.position}%`)
            .join(", ");

        // Generate appropriate CSS based on gradient type
        if (gradientType === "linear") {
            gradientCSS = `background: linear-gradient(${angle}deg, ${stopsString});`;
        } else if (gradientType === "radial") {
            gradientCSS = `background: radial-gradient(${radialShape} at ${radialPosition}, ${stopsString});`;
        } else if (gradientType === "conic") {
            gradientCSS = `background: conic-gradient(from ${conicAngle}deg at ${conicPosition}, ${stopsString});`;
        }

        setCssOutput(gradientCSS);
    }, [
        gradientType,
        colorStops,
        angle,
        radialShape,
        radialPosition,
        conicAngle,
        conicPosition,
    ]);

    // Add a new color stop
    const addColorStop = () => {
        if (colorStops.length < 10) {
            // Calculate midpoint between last two stops or add at end
            let newPosition = 50;
            if (colorStops.length >= 2) {
                const sorted = [...colorStops].sort(
                    (a, b) => a.position - b.position
                );
                const lastPosition = sorted[sorted.length - 1].position;
                const secondLastPosition = sorted[sorted.length - 2].position;
                newPosition = Math.min(
                    100,
                    Math.floor((lastPosition + secondLastPosition) / 2) + 10
                );
            }

            // Generate a color between existing colors using chroma.js
            const colors = colorStops.map((stop) => stop.color);
            const newColor = chroma.scale(colors)(Math.random()).hex();

            setColorStops([
                ...colorStops,
                { color: newColor, position: newPosition },
            ]);
        }
    };

    // Remove a color stop
    const removeColorStop = (index) => {
        if (colorStops.length > 2) {
            setColorStops(colorStops.filter((_, i) => i !== index));
        }
    };

    // Update color stop
    const updateColorStop = (index, field, value) => {
        const newStops = [...colorStops];
        newStops[index] = { ...newStops[index], [field]: value };
        setColorStops(newStops);
    };

    // Generate complimentary palette
    const generateComplimentaryPalette = () => {
        if (colorStops.length === 2) {
            const baseColor = chroma(colorStops[0].color);
            const complimentary = baseColor
                .set("hsl.h", (baseColor.get("hsl.h") + 180) % 360)
                .hex();
            setColorStops([
                { color: colorStops[0].color, position: 0 },
                { color: complimentary, position: 100 },
            ]);
        }
    };

    // Generate analogous palette
    const generateAnalogousPalette = () => {
        const baseColor = chroma(colorStops[0].color);
        const baseHue = baseColor.get("hsl.h");

        const newStops = [
            {
                color: chroma.hsl((baseHue - 30) % 360, 1, 0.5).hex(),
                position: 0,
            },
            { color: colorStops[0].color, position: 50 },
            {
                color: chroma.hsl((baseHue + 30) % 360, 1, 0.5).hex(),
                position: 100,
            },
        ];

        setColorStops(newStops);
    };

    // Distribute colors evenly
    const distributeEvenly = () => {
        const sortedStops = [...colorStops].sort(
            (a, b) => a.position - b.position
        );
        const step = 100 / (sortedStops.length - 1);

        const newStops = sortedStops.map((stop, index) => ({
            ...stop,
            position: Math.round(index * step),
        }));

        setColorStops(newStops);
    };

    // Copy CSS to clipboard
    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(cssOutput)
            .then(() => alert("CSS copied to clipboard!"))
            .catch((err) => console.error("Failed to copy: ", err));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
                Color Gradient Generator
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-1 lg:col-span-2">
                    {/* Preview */}
                    <div
                        className="w-full h-64 rounded-lg mb-4 border border-gray-200 shadow-inner flex items-center justify-center"
                        style={{
                            ...previewSize,
                            [cssOutput.split(": ")[0]]: cssOutput
                                .split(": ")[1]
                                ?.slice(0, -1),
                        }}
                    >
                        <div className="p-3 bg-white/80 rounded shadow-lg">
                            <span className="font-mono text-sm">
                                {gradientType.charAt(0).toUpperCase() +
                                    gradientType?.slice(1)}{" "}
                                Gradient
                            </span>
                        </div>
                    </div>

                    {/* Gradient Type Selector */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Gradient Type
                        </h2>
                        <div className="flex space-x-2">
                            {["linear", "radial", "conic"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setGradientType(type)}
                                    className={`px-4 py-2 rounded ${
                                        gradientType === type
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Settings */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Gradient Settings
                        </h2>

                        {gradientType === "linear" && (
                            <div className="mb-4">
                                <label className="block mb-1">
                                    Angle: {angle}°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={angle}
                                    onChange={(e) =>
                                        setAngle(Number(e.target.value))
                                    }
                                    className="w-full"
                                />
                            </div>
                        )}

                        {gradientType === "radial" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1">Shape:</label>
                                    <select
                                        value={radialShape}
                                        onChange={(e) =>
                                            setRadialShape(e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="circle">Circle</option>
                                        <option value="ellipse">Ellipse</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1">
                                        Position:
                                    </label>
                                    <select
                                        value={radialPosition}
                                        onChange={(e) =>
                                            setRadialPosition(e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="center">Center</option>
                                        <option value="top left">
                                            Top Left
                                        </option>
                                        <option value="top">Top</option>
                                        <option value="top right">
                                            Top Right
                                        </option>
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                        <option value="bottom left">
                                            Bottom Left
                                        </option>
                                        <option value="bottom">Bottom</option>
                                        <option value="bottom right">
                                            Bottom Right
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {gradientType === "conic" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1">
                                        Angle: {conicAngle}°
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={conicAngle}
                                        onChange={(e) =>
                                            setConicAngle(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">
                                        Position:
                                    </label>
                                    <select
                                        value={conicPosition}
                                        onChange={(e) =>
                                            setConicPosition(e.target.value)
                                        }
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="center">Center</option>
                                        <option value="top left">
                                            Top Left
                                        </option>
                                        <option value="top">Top</option>
                                        <option value="top right">
                                            Top Right
                                        </option>
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                        <option value="bottom left">
                                            Bottom Left
                                        </option>
                                        <option value="bottom">Bottom</option>
                                        <option value="bottom right">
                                            Bottom Right
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Color Stops */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">
                                Color Stops
                            </h2>
                            <button
                                onClick={addColorStop}
                                disabled={colorStops.length >= 10}
                                className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-blue-300"
                            >
                                + Add Stop
                            </button>
                        </div>

                        <div className="space-y-4">
                            {colorStops.map((stop, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4"
                                >
                                    <div
                                        className="w-8 h-8 rounded-full border border-gray-300"
                                        style={{ backgroundColor: stop.color }}
                                    />
                                    <input
                                        type="color"
                                        value={stop.color}
                                        onChange={(e) =>
                                            updateColorStop(
                                                index,
                                                "color",
                                                e.target.value
                                            )
                                        }
                                        className="w-16"
                                    />
                                    <div className="flex-1">
                                        <label className="block mb-1 text-sm">
                                            Position: {stop.position}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={stop.position}
                                            onChange={(e) =>
                                                updateColorStop(
                                                    index,
                                                    "position",
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeColorStop(index)}
                                        disabled={colorStops.length <= 2}
                                        className="p-2 text-red-500 disabled:text-gray-300"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Helper Tools */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Helper Tools
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={distributeEvenly}
                                className="px-3 py-1 bg-gray-600 text-white rounded"
                            >
                                Distribute Evenly
                            </button>
                            <button
                                onClick={generateComplimentaryPalette}
                                className="px-3 py-1 bg-purple-600 text-white rounded"
                            >
                                Complimentary Colors
                            </button>
                            <button
                                onClick={generateAnalogousPalette}
                                className="px-3 py-1 bg-indigo-600 text-white rounded"
                            >
                                Analogous Colors
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-span-1">
                    {/* CSS Output */}
                    <div className="sticky top-4">
                        <h2 className="text-lg font-semibold mb-2">
                            CSS Output
                        </h2>
                        <div className="relative">
                            <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm h-64">
                                <code>{cssOutput}</code>
                            </pre>
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded text-white text-xs"
                            >
                                Copy
                            </button>
                        </div>

                        {/* Export Options */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Export Options
                            </h2>
                            <div className="space-y-2">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center">
                                    <span>Download CSS</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradientGenerator;
