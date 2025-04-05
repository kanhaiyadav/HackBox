"use client";

// components/BarcodeGenerator.tsx
import React, { useState, useRef } from "react";
import {
    FaBarcode,
    FaQrcode,
    FaDownload,
    FaPrint,
    FaCopy,
    FaRedo,
} from "react-icons/fa";
import JsBarcode from "jsbarcode";

// Define supported barcode types
const BARCODE_TYPES = [
    { value: "CODE128", label: "Code 128" },
    { value: "EAN13", label: "EAN-13" },
    { value: "UPC", label: "UPC" },
    { value: "EAN8", label: "EAN-8" },
    { value: "CODE39", label: "Code 39" },
    { value: "ITF14", label: "ITF-14" },
    { value: "MSI", label: "MSI" },
    { value: "pharmacode", label: "Pharmacode" },
];

const BarcodeGenerator: React.FC = () => {
    // State management
    const [barcodeType, setBarcodeType] = useState<string>("CODE128");
    const [barcodeText, setBarcodeText] = useState<string>("123456789012");
    const [barcodeWidth, setBarcodeWidth] = useState<number>(2);
    const [barcodeHeight, setBarcodeHeight] = useState<number>(100);
    const [includeText, setIncludeText] = useState<boolean>(true);
    const [textMargin, setTextMargin] = useState<number>(2);
    const [error, setError] = useState<string | null>(null);
    const [generatedBarcode, setGeneratedBarcode] = useState<boolean>(true);

    // Refs
    const barcodeRef = useRef<SVGSVGElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Generate the barcode
    const generateBarcode = () => {
        setError(null);

        try {
            if (!barcodeText.trim()) {
                throw new Error("Please enter a barcode value");
            }

            // Validate input based on barcode type
            if (barcodeType === "EAN13" && !/^\d{12,13}$/.test(barcodeText)) {
                throw new Error("EAN-13 requires exactly 12 or 13 digits");
            }

            if (barcodeType === "UPC" && !/^\d{11,12}$/.test(barcodeText)) {
                throw new Error("UPC requires exactly 11 or 12 digits");
            }

            if (barcodeType === "EAN8" && !/^\d{7,8}$/.test(barcodeText)) {
                throw new Error("EAN-8 requires exactly 7 or 8 digits");
            }

            // Apply the barcode to the SVG element
            if (barcodeRef.current) {
                JsBarcode(barcodeRef.current, barcodeText, {
                    format: barcodeType,
                    width: barcodeWidth,
                    height: barcodeHeight,
                    displayValue: includeText,
                    margin: textMargin,
                    background: "transparent",
                    lineColor: "#ffffff",
                    textMargin: 2,
                    fontSize: 16,
                    font: "monospace",
                });
                setGeneratedBarcode(true);
            }
        } catch (err) {
            console.log(err);
            setError((err as Error).message || "Failed to generate barcode");
            setGeneratedBarcode(false);
        }
    };

    // Download barcode as SVG
    const downloadSVG = () => {
        if (!barcodeRef.current || !generatedBarcode) return;

        const svgData = new XMLSerializer().serializeToString(
            barcodeRef.current
        );
        const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = `barcode-${barcodeText}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
    };

    // Download barcode as PNG
    const downloadPNG = () => {
        if (!barcodeRef.current || !generatedBarcode) return;

        // Create canvas and draw SVG to it
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions
        canvas.width = barcodeRef.current.width.baseVal.value * 2;
        canvas.height = barcodeRef.current.height.baseVal.value * 2;

        if (ctx) {
            // Draw white background for transparent SVG
            ctx.fillStyle = "#1e1e1e";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Convert SVG to image and draw on canvas
            const svgData = new XMLSerializer().serializeToString(
                barcodeRef.current
            );
            const img = new Image();

            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Download image
                const downloadLink = document.createElement("a");
                downloadLink.href = canvas.toDataURL("image/png");
                downloadLink.download = `barcode-${barcodeText}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            };

            img.src = "data:image/svg+xml;base64," + btoa(svgData);
        }
    };

    // Print barcode
    const printBarcode = () => {
        if (!barcodeRef.current || !generatedBarcode) return;

        const svgData = new XMLSerializer().serializeToString(
            barcodeRef.current
        );

        // Create a printable document
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: white;
              }
            </style>
          </head>
          <body>
            ${svgData}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    // Copy barcode as text
    const copyBarcodeText = () => {
        navigator.clipboard
            .writeText(barcodeText)
            .then(() => {
                alert("Barcode text copied to clipboard");
            })
            .catch((err) => {
                console.error("Failed to copy:", err);
            });
    };

    // Reset form
    const resetForm = () => {
        setBarcodeType("CODE128");
        setBarcodeText("123456789012");
        setBarcodeWidth(2);
        setBarcodeHeight(100);
        setIncludeText(true);
        setTextMargin(2);
        setError(null);
        generateBarcode();
    };

    // Generate barcode on initial render
    React.useEffect(() => {
        generateBarcode();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-center mb-8">
                    <FaBarcode className="text-4xl text-indigo-500 mr-3" />
                    <h1 className="text-3xl font-bold text-center">
                        Barcode Generator
                    </h1>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaQrcode className="text-indigo-400 mr-2" />
                            Configure Barcode
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Barcode Type
                                </label>
                                <select
                                    value={barcodeType}
                                    onChange={(e) =>
                                        setBarcodeType(e.target.value)
                                    }
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {BARCODE_TYPES.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Barcode Value
                                </label>
                                <input
                                    type="text"
                                    value={barcodeText}
                                    onChange={(e) =>
                                        setBarcodeText(e.target.value)
                                    }
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter barcode value"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Width (px)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={barcodeWidth}
                                        onChange={(e) =>
                                            setBarcodeWidth(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Height (px)
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        max="200"
                                        value={barcodeHeight}
                                        onChange={(e) =>
                                            setBarcodeHeight(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="includeText"
                                    checked={includeText}
                                    onChange={(e) =>
                                        setIncludeText(e.target.checked)
                                    }
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="includeText"
                                    className="ml-2 block text-sm"
                                >
                                    Display value text
                                </label>
                            </div>

                            {includeText && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Text Margin
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={textMargin}
                                        onChange={(e) =>
                                            setTextMargin(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    onClick={generateBarcode}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                                >
                                    <FaBarcode className="mr-2" />
                                    Generate Barcode
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Output Display */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FaBarcode className="text-indigo-400 mr-2" />
                            Generated Barcode
                        </h2>

                        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4 mb-4 overflow-hidden">
                            {generatedBarcode ? (
                                <div className="flex items-center justify-center p-4 bg-gray-900 rounded">
                                    <svg
                                        ref={barcodeRef}
                                        className="max-w-full h-auto"
                                    ></svg>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-center">
                                    Please generate a valid barcode
                                </div>
                            )}
                            <canvas
                                ref={canvasRef}
                                style={{ display: "none" }}
                            ></canvas>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button
                                onClick={downloadSVG}
                                disabled={!generatedBarcode}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 px-3 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                <FaDownload className="mr-2" />
                                SVG
                            </button>

                            <button
                                onClick={downloadPNG}
                                disabled={!generatedBarcode}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 px-3 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                <FaDownload className="mr-2" />
                                PNG
                            </button>

                            <button
                                onClick={printBarcode}
                                disabled={!generatedBarcode}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 px-3 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                <FaPrint className="mr-2" />
                                Print
                            </button>

                            <button
                                onClick={copyBarcodeText}
                                disabled={!generatedBarcode}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 px-3 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                <FaCopy className="mr-2" />
                                Copy
                            </button>

                            <button
                                onClick={resetForm}
                                className="col-span-2 mt-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                <FaRedo className="mr-2" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;
