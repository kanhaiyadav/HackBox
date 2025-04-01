"use client";
import React, { useState, useEffect } from "react";
import {
    AlertCircle,
    Check,
    Copy,
    Upload,
    Download,
    Code,
    BookOpen,
    Eye,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ValidationResult = {
    isValid: boolean;
    error?: string;
};

const JsonFormatter: React.FC = () => {
    const [jsonInput, setJsonInput] = useState<string>("");
    const [formattedJson, setFormattedJson] = useState<string>("");
    const [validation, setValidation] = useState<ValidationResult>({
        isValid: true,
    });
    const [indentSize, setIndentSize] = useState<number>(2);
    const [copied, setCopied] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"formatted" | "raw">(
        "formatted"
    );

    // Validate and format JSON input
    useEffect(() => {
        if (!jsonInput.trim()) {
            setFormattedJson("");
            setValidation({ isValid: true });
            return;
        }

        try {
            // Parse to check validity
            const parsedJson = JSON.parse(jsonInput);
            // Format with proper indentation
            const formatted = JSON.stringify(parsedJson, null, indentSize);
            setFormattedJson(formatted);
            setValidation({ isValid: true });
        } catch (error) {
            setValidation({
                isValid: false,
                error: error instanceof Error ? error.message : "Invalid JSON",
            });
        }
    }, [jsonInput, indentSize]);

    // Handle formatting with specific indent size
    const handleFormat = () => {
        if (validation.isValid && jsonInput) {
            try {
                const parsed = JSON.parse(jsonInput);
                setJsonInput(JSON.stringify(parsed, null, indentSize));
            } catch (error) {
                // This shouldn't happen as we already validated
            }
        }
    };

    // Handle minification of JSON
    const handleMinify = () => {
        if (validation.isValid && jsonInput) {
            try {
                const parsed = JSON.parse(jsonInput);
                setJsonInput(JSON.stringify(parsed));
            } catch (error) {
                // This shouldn't happen as we already validated
            }
        }
    };

    // Handle copying to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson || jsonInput).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setJsonInput(content);
            };
            reader.readAsText(file);
        }
    };

    // Handle file download
    const handleDownload = () => {
        if (!formattedJson) return;

        const blob = new Blob([formattedJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6 text-center">
                JSON Formatter & Validator
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Input Panel */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Input JSON</h2>
                        <div className="flex space-x-2">
                            <label className="cursor-pointer px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center">
                                <Upload className="h-4 w-4 mr-1" />
                                <span className="text-sm">Upload</span>
                                <input
                                    type="file"
                                    accept=".json,application/json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <textarea
                        className={`w-full h-96 p-4 border rounded-md font-mono text-sm resize-none ${
                            validation.isValid
                                ? "border-gray-300"
                                : "border-red-500"
                        }`}
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your JSON here..."
                    />

                    {!validation.isValid && (
                        <div className="mt-2 text-red-500 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">{validation.error}</span>
                        </div>
                    )}
                    {validation.isValid && jsonInput && (
                        <div className="mt-2 text-green-500 flex items-center">
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-sm">Valid JSON</span>
                        </div>
                    )}
                </div>

                {/* Output Panel */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold">Result</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
                                disabled={!formattedJson}
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                <span className="text-sm">
                                    {copied ? "Copied!" : "Copy"}
                                </span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
                                disabled={!formattedJson}
                            >
                                <Download className="h-4 w-4 mr-1" />
                                <span className="text-sm">Download</span>
                            </button>
                        </div>
                    </div>

                    <div className="tabs flex border-b mb-2">
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "formatted"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("formatted")}
                        >
                            <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                <span>Formatted</span>
                            </div>
                        </button>
                        <button
                            className={`px-4 py-2 ${
                                activeTab === "raw"
                                    ? "border-b-2 border-blue-500 text-blue-500"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("raw")}
                        >
                            <div className="flex items-center">
                                <Code className="h-4 w-4 mr-1" />
                                <span>Raw</span>
                            </div>
                        </button>
                    </div>

                    <div className="relative h-96">
                        {/* <pre
                            className={`w-full h-full p-4 overflow-auto border rounded-md font-mono text-sm bg-gray-50 ${
                                activeTab === "formatted" ? "block" : "hidden"
                            }`}
                        >
                            {formattedJson}
                        </pre> */}
                        {activeTab === "formatted" && (
                            <SyntaxHighlighter
                                language="json"
                                style={coy}
                                customStyle={{
                                    background: "white",
                                    margin: 0,
                                    padding: "1rem",
                                    height: "16rem",
                                    overflow: "auto",
                                }}
                                codeTagProps={{
                                    style: { fontFamily: "monospace" },
                                }}
                            >
                                {formattedJson}
                            </SyntaxHighlighter>
                        )}
                        <div
                            className={`w-full h-full ${
                                activeTab === "raw" ? "block" : "hidden"
                            }`}
                        >
                            <textarea
                                readOnly
                                className="w-full h-full p-4 border rounded-md font-mono text-sm resize-none bg-gray-50"
                                value={formattedJson}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Panel */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-md">
                <div>
                    <label className="text-sm font-medium block mb-1">
                        Indentation
                    </label>
                    <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="px-3 py-2 border rounded-md bg-white"
                    >
                        <option value={2}>2 Spaces</option>
                        <option value={4}>4 Spaces</option>
                        <option value={8}>8 Spaces</option>
                    </select>
                </div>

                <div className="flex items-end gap-2">
                    <button
                        onClick={handleFormat}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={!validation.isValid || !jsonInput}
                    >
                        Format JSON
                    </button>
                    <button
                        onClick={handleMinify}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={!validation.isValid || !jsonInput}
                    >
                        Minify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JsonFormatter;
