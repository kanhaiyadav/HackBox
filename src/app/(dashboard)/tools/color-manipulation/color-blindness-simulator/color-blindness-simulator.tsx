"use client";

import React, { useState } from "react";
import { colorBlindnessDescriptions } from "../../../../../../constants/colorManipulation";
import { ColorBlindnessType } from "@/types/colorManipulation";
import ColorModeSimulator from "./ColorModeSimulator";
import ImageModeSimulator from "./ImageModeSimulator";
// Color transformation matrices for different types of color blindness

const ColorBlindnessSimulator: React.FC = () => {
    const [colorMode, setColorMode] = useState<boolean>(false);

    // Toggle between color picker and image upload modes
    const toggleMode = () => {
        setColorMode(!colorMode);
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
            {colorMode && <ColorModeSimulator />}

            {/* Image Upload Mode */}
            {!colorMode && <ImageModeSimulator />}

            <div className="foreground shadow-inset p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-2">
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
