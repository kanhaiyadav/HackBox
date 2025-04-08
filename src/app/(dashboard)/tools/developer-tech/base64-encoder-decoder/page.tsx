'use client';

// pages/index.tsx
import React, { useState, useRef, useEffect } from "react";
import {
    FiUpload,
    FiDownload,
    FiCopy,
    FiTrash2,
    FiRefreshCw,
    FiCheck,
    FiClipboard,
    FiFile,
    FiFileText,
    FiImage,
    FiInfo,
    FiAlertCircle,
    FiLink,
    FiCode,
    FiKey,
} from "react-icons/fi";

type EncodingMode = "text" | "file";
type ConversionMode = "encode" | "decode";
type HistoryItem = {
    id: string;
    input: string;
    output: string;
    mode: ConversionMode;
    timestamp: Date;
};

const Base64Tool: React.FC = () => {
    // State variables
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [mode, setMode] = useState<ConversionMode>("encode");
    const [encodingMode, setEncodingMode] = useState<EncodingMode>("text");
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [showStats, setShowStats] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [binaryOutput, setBinaryOutput] = useState<ArrayBuffer | null>(null);
    const [outputFileName, setOutputFileName] = useState<string>("");
    const [isBinaryOutput, setIsBinaryOutput] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Stats calculation
    const inputLength = input.length;
    const outputLength = output.length;
    const compressionRatio = inputLength
        ? ((outputLength / inputLength) * 100).toFixed(2)
        : "0";

    // Effect to clear the copied state after 2 seconds
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isCopied) {
            timeout = setTimeout(() => setIsCopied(false), 2000);
        }
        return () => clearTimeout(timeout);
    }, [isCopied]);

    // Reset outputs when switching modes
    useEffect(() => {
        setOutput("");
        setBinaryOutput(null);
        setIsBinaryOutput(false);
        setOutputFileName("");
        setError(null);
    }, [mode, encodingMode]);

    // Text encoding/decoding functions
    const convertText = () => {
        setError(null);
        setIsBinaryOutput(false);
        setBinaryOutput(null);

        try {
            if (mode === "encode") {
                const base64 = window.btoa(input);
                setOutput(base64);
                addToHistory(input, base64, "encode");
            } else {
                try {
                    const decoded = window.atob(input);
                    
                    // Check if the decoded string is likely binary
                    const isBinary = detectBinaryContent(decoded);
                    
                    if (isBinary && encodingMode === "file") {
                        // Convert to ArrayBuffer for binary download
                        const buffer = stringToArrayBuffer(decoded);
                        setBinaryOutput(buffer);
                        setIsBinaryOutput(true);
                        setOutput("Binary content detected - use download button");
                        setOutputFileName("decoded-file");
                    } else {
                        // It's text content
                        setOutput(decoded);
                    }
                    
                    addToHistory(input, isBinary ? "[Binary content]" : decoded.substring(0, 50) + "...", "decode");
                } catch (e) {
                    console.error(e);
                    setError("Invalid Base64 string");
                }
            }
        } catch (e) {
            console.error(e);
            setError("Conversion failed. Make sure your input is valid.");
        }
    };

    // Helper for string to ArrayBuffer conversion
    const stringToArrayBuffer = (str: string): ArrayBuffer => {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0; i < str.length; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    };

    // Detect binary content in decoded string
    const detectBinaryContent = (str: string): boolean => {
        // Check for null bytes and high concentration of non-printable characters
        let nonPrintableCount = 0;
        const sampleLength = Math.min(str.length, 100);
        
        for (let i = 0; i < sampleLength; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode === 0 || (charCode < 32 && ![9, 10, 13].includes(charCode))) {
                nonPrintableCount++;
            }
        }
        
        // If more than 10% non-printable characters, consider it binary
        return nonPrintableCount > (sampleLength * 0.1);
    };

    // Convert function - handles both text and file modes
    const convert = () => {
        if (!input.trim()) {
            setError("Please provide input to convert");
            return;
        }

        setError(null);
        
        if (encodingMode === "text") {
            convertText();
        } else {
            // For file mode
            if (mode === "encode") {
                // File already encoded during upload
                if (fileData) {
                    setOutput(input);  // The base64 is already in input
                }
            } else {
                // Decode mode with file
                try {
                    // Convert Base64 to binary
                    const binary = window.atob(input);
                    const arrayBuffer = new ArrayBuffer(binary.length);
                    const uint8Array = new Uint8Array(arrayBuffer);
                    
                    for (let i = 0; i < binary.length; i++) {
                        uint8Array[i] = binary.charCodeAt(i);
                    }
                    
                    setBinaryOutput(arrayBuffer);
                    setIsBinaryOutput(true);
                    setOutput("Binary file decoded - use download button");
                    setOutputFileName(fileName || "decoded-file");
                    
                    addToHistory(
                        fileName || "Base64 input",
                        "[Binary file]",
                        "decode"
                    );
                } catch (e) {
                    console.error(e);
                    setError("Invalid Base64 input or file");
                }
            }
        }
    };

    const addToHistory = (
        input: string,
        output: string,
        mode: ConversionMode
    ) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            input: input.length > 50 ? input.substring(0, 50) + "..." : input,
            output:
                output.length > 50 ? output.substring(0, 50) + "..." : output,
            mode,
            timestamp: new Date(),
        };

        setHistory((prev) => [newItem, ...prev.slice(0, 9)]); // Keep only last 10 items
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        if (!output || isBinaryOutput) return;
        
        try {
            await navigator.clipboard.writeText(output);
            setIsCopied(true);
        } catch (err) {
            console.error(err);
            setError("Failed to copy text to clipboard");
        }
    };

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileType(file.type);
        setError(null);

        const reader = new FileReader();

        if (mode === "encode") {
            // When encoding, read file as ArrayBuffer to encode
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    setFileData(reader.result);

                    // Convert ArrayBuffer to Base64
                    const bytes = new Uint8Array(reader.result);
                    let binary = "";
                    for (let i = 0; i < bytes.byteLength; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    
                    try {
                        const base64 = window.btoa(binary);
                        setInput(base64);
                        setOutput(base64);
                        addToHistory(
                            `File: ${file.name}`,
                            base64.substring(0, 50) + "...",
                            "encode"
                        );
                    } catch (e) {
                        console.error(e);
                        setError("Failed to encode file. The file might be too large.");
                    }
                }
            };
        } else {
            // When decoding, read file as text (assuming it contains Base64)
            reader.readAsText(file);
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    setInput(reader.result.trim());
                    setBinaryOutput(null);
                    setIsBinaryOutput(false);
                }
            };
        }
    };

    // Download output as file
    const downloadOutput = () => {
        if ((!output && !binaryOutput) || (mode === "decode" && encodingMode === "file" && !binaryOutput)) {
            return;
        }

        let blob: Blob;
        let downloadFileName: string;

        if (binaryOutput) {
            // Create blob from binary data
            blob = new Blob([binaryOutput], {
                type: fileType || "application/octet-stream",
            });
            downloadFileName = outputFileName || fileName || "decoded-file";
        } else {
            // Text download
            blob = new Blob([output], { type: "text/plain" });
            downloadFileName = mode === "encode" ? "encoded.txt" : "decoded.txt";
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Clear inputs and outputs
    const clearAll = () => {
        setInput("");
        setOutput("");
        setError(null);
        setFileName("");
        setFileType("");
        setFileData(null);
        setBinaryOutput(null);
        setIsBinaryOutput(false);
        setOutputFileName("");
    };

    // Apply an item from history
    const applyHistoryItem = (item: HistoryItem) => {
        setInput(item.input);
        setOutput(item.output);
        setMode(item.mode);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
                    Base64 Encoder/Decoder
                </h1>

                {/* Mode Selector */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setMode("encode")}
                            className={`px-4 py-2 flex-1 ${
                                mode === "encode"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setMode("decode")}
                            className={`px-4 py-2 flex-1 ${
                                mode === "decode"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                        >
                            Decode
                        </button>
                    </div>

                    <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setEncodingMode("text")}
                            className={`px-4 py-2 flex-1 ${
                                encodingMode === "text"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                        >
                            <FiFileText className="inline mr-2" /> Text
                        </button>
                        <button
                            onClick={() => setEncodingMode("file")}
                            className={`px-4 py-2 flex-1 ${
                                encodingMode === "file"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                        >
                            <FiFile className="inline mr-2" /> File
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">Input</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={clearAll}
                                    className="p-2 rounded-full hover:bg-gray-700"
                                    title="Clear all"
                                >
                                    <FiTrash2 />
                                </button>
                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="p-2 rounded-full hover:bg-gray-700"
                                    title="Upload file"
                                >
                                    <FiUpload />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </button>
                            </div>
                        </div>

                        {encodingMode === "text" || (mode === "decode" && !fileName) ? (
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-64 bg-gray-900 text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={
                                    mode === "encode"
                                        ? "Enter text to encode..."
                                        : "Enter Base64 to decode..."
                                }
                            />
                        ) : (
                            <div className="border-2 border-dashed border-gray-600 rounded-lg h-64 flex items-center justify-center flex-col p-4">
                                {fileName ? (
                                    <div className="text-center">
                                        <FiFile className="text-4xl mx-auto mb-2" />
                                        <p className="break-all">{fileName}</p>
                                        <p className="text-gray-400 text-sm">
                                            {fileType || "Unknown type"}
                                        </p>
                                        {input && (
                                            <p className="text-green-400 mt-2">
                                                <FiCheck className="inline mr-1" />{" "}
                                                File loaded
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="text-center cursor-pointer hover:text-blue-400"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <FiUpload className="text-4xl mx-auto mb-2" />
                                        <p>Click or drag file here</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Supports any file type (PDF, images,
                                            etc.)
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {encodingMode === "text" && (
                            <div className="mt-2 text-sm text-gray-400 flex justify-between">
                                <span>{inputLength} characters</span>
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">Output</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => convert()}
                                    className="p-2 rounded-full hover:bg-gray-700"
                                    title="Convert"
                                >
                                    <FiRefreshCw />
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className={`p-2 rounded-full hover:bg-gray-700 ${isBinaryOutput ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title={isBinaryOutput ? "Cannot copy binary content" : "Copy to clipboard"}
                                    disabled={!output || isBinaryOutput}
                                >
                                    {isCopied ? <FiCheck /> : <FiCopy />}
                                </button>
                                <button
                                    onClick={downloadOutput}
                                    className={`p-2 rounded-full hover:bg-gray-700 ${(!output && !binaryOutput) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="Download output"
                                    disabled={!output && !binaryOutput}
                                >
                                    <FiDownload />
                                </button>
                            </div>
                        </div>

                        {isBinaryOutput ? (
                            <div className="w-full h-64 bg-gray-900 p-3 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <FiFile className="text-4xl mx-auto mb-3 text-blue-400" />
                                    <p>Binary file detected</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Use the download button to save the decoded file
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <textarea
                                value={output}
                                readOnly
                                className="w-full h-64 bg-gray-900 text-gray-200 p-3 rounded-lg focus:outline-none"
                                placeholder={
                                    mode === "encode"
                                        ? "Encoded Base64 will appear here..."
                                        : "Decoded text will appear here..."
                                }
                            />
                        )}

                        <div className="mt-2 text-sm text-gray-400 flex justify-between">
                            <span>{isBinaryOutput ? "Binary output" : `${outputLength} characters`}</span>
                            <button
                                onClick={() => setShowStats(!showStats)}
                                className="text-blue-400 hover:underline flex items-center"
                            >
                                <FiInfo className="mr-1" />{" "}
                                {showStats ? "Hide stats" : "Show stats"}
                            </button>
                        </div>

                        {/* Stats Section */}
                        {showStats && (
                            <div className="mt-3 p-3 bg-gray-900 rounded-lg text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        Input length:{" "}
                                        <span className="text-blue-400">
                                            {inputLength}
                                        </span>
                                    </div>
                                    <div>
                                        Output:{" "}
                                        <span className="text-blue-400">
                                            {isBinaryOutput ? "Binary file" : `${outputLength} chars`}
                                        </span>
                                    </div>
                                    {!isBinaryOutput && (
                                        <div>
                                            Compression ratio:{" "}
                                            <span className="text-blue-400">
                                                {compressionRatio}%
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        Mode:{" "}
                                        <span className="text-blue-400 capitalize">
                                            {mode}
                                        </span>
                                    </div>
                                    {fileName && (
                                        <div className="col-span-2">
                                            File type:{" "}
                                            <span className="text-blue-400">
                                                {fileType || "Unknown"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 flex items-center">
                        <FiAlertCircle className="mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Convert Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={convert}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center"
                    >
                        <FiRefreshCw className="mr-2" />
                        {mode === "encode" ? "Encode" : "Decode"}
                    </button>
                </div>

                {/* Usage Info */}
                {encodingMode === "file" && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                        <h3 className="font-medium text-blue-400 mb-2">
                            Working with Files
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>
                                When <strong>encoding</strong>, upload any file
                                type (PDF, images, docx, etc.) to convert it to
                                Base64
                            </li>
                            <li>
                                When <strong>decoding</strong>, paste Base64 data or upload a text file containing Base64
                            </li>
                            <li>
                                For binary files (images, PDFs, etc.), select &quot;File&quot; mode and use the{" "}
                                <strong>Download</strong> button to save the
                                decoded file
                            </li>
                            <li>
                                The tool automatically detects binary content and handles it appropriately
                            </li>
                        </ul>
                    </div>
                )}

                {/* History Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="text-blue-400 hover:underline flex items-center"
                        >
                            <FiClipboard className="mr-1" />
                            {showHistory ? "Hide History" : "Show History"}
                        </button>
                        {history.length > 0 && showHistory && (
                            <button
                                onClick={() => setHistory([])}
                                className="text-red-400 hover:underline flex items-center text-sm"
                            >
                                <FiTrash2 className="mr-1" /> Clear
                            </button>
                        )}
                    </div>

                    {showHistory && (
                        <div className="bg-gray-800 rounded-lg overflow-hidden">
                            {history.length === 0 ? (
                                <div className="p-4 text-center text-gray-400">
                                    No conversion history yet
                                </div>
                            ) : (
                                <div className="max-h-64 overflow-y-auto">
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            className="p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                                            onClick={() => applyHistoryItem(item)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium truncate">
                                                        <span className="capitalize text-blue-400">
                                                            {item.mode}:{" "}
                                                        </span>
                                                        {item.input}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 truncate">
                                                        Result: {item.output}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                                    {item.timestamp.toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Additional Features */}
                <div className="mt-8 border-t border-gray-700 pt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Additional Tools
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* URL Encoding Tool */}
                        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="flex items-center text-blue-400 mb-2">
                                <FiLink className="mr-2" />
                                <h3 className="font-medium">URL Encoding</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Encode and decode URL components
                            </p>
                        </div>

                        {/* JSON Formatter Tool */}
                        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="flex items-center text-blue-400 mb-2">
                                <FiCode className="mr-2" />
                                <h3 className="font-medium">JSON Formatter</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Format and validate JSON data
                            </p>
                        </div>

                        {/* Image to Base64 Tool */}
                        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="flex items-center text-blue-400 mb-2">
                                <FiImage className="mr-2" />
                                <h3 className="font-medium">Image Converter</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Convert images to Base64 strings
                            </p>
                        </div>

                        {/* Hash Generator Tool */}
                        <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <div className="flex items-center text-blue-400 mb-2">
                                <FiKey className="mr-2" />
                                <h3 className="font-medium">Hash Generator</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                Generate MD5, SHA-1, SHA-256 hashes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-gray-400 text-sm">
                    <p>
                        Base64 Encoder/Decoder Tool • {new Date().getFullYear()}
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Base64Tool;