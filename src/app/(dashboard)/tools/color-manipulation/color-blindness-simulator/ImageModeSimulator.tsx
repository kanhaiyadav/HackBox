'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone } from "react-dropzone";
import { TbLibraryPhoto } from "react-icons/tb";
import { ColorBlindnessType } from '@/types/colorManipulation';
import { colorBlindnessDescriptions, colorBlindnessMatrices } from '../../../../../../constants/colorManipulation';

const ImageModeSimulator = () => {

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<ColorBlindnessType>("normal");
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
    
  return (
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
  )
}

export default ImageModeSimulator