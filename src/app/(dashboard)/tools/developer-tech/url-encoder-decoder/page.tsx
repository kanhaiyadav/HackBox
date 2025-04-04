'use client';

import { useState, useEffect } from "react";
import {
    FiCopy,
    FiRefreshCw,
    FiCode,
    FiLink,
    FiLock,
    FiUnlock,
    FiAlertTriangle,
} from "react-icons/fi";
import { FaGithub } from "react-icons/fa";

type EncodingMode = "encode" | "decode";
type ContentType = "url" | "query" | "fullUrl";

export default function UrlEncoderDecoder() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [mode, setMode] = useState<EncodingMode>("encode");
    const [contentType, setContentType] = useState<ContentType>("url");
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (autoUpdate && inputText) {
            processText();
        } else {
            setError(null);
        }
    }, [inputText, mode, contentType, autoUpdate]);

    const processText = () => {
        try {
            setError(null);
            let result = "";

            if (mode === "encode") {
                if (contentType === "fullUrl") {
                    result = encodeURI(inputText);
                } else if (contentType === "query") {
                    result = encodeURIComponent(inputText);
                } else {
                    // URL path encoding (default)
                    result = encodeURIComponent(inputText)
                        .replace(/%2F/g, "/")
                        .replace(/%3A/g, ":")
                        .replace(/%3F/g, "?")
                        .replace(/%3D/g, "=")
                        .replace(/%26/g, "&");
                }
            } else {
                // Decode mode
                try {
                    if (contentType === "fullUrl") {
                        result = decodeURI(inputText);
                    } else {
                        result = decodeURIComponent(inputText);
                    }
                } catch (e) {
                    // Fallback for partial decoding
                    result = inputText.replace(/%[0-9A-Fa-f]{2}/g, (match) => {
                        try {
                            return decodeURIComponent(match);
                        } catch {
                            return match;
                        }
                    });
                }
            }

            setOutputText(result);
        } catch (err) {
            setError(
                `Error: ${err instanceof Error ? err.message : "Invalid input"}`
            );
            setOutputText("");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText("");
        setOutputText("");
        setError(null);
    };

    const handleSwap = () => {
        setInputText(outputText);
        setOutputText(inputText);
        setMode((prev) => (prev === "encode" ? "decode" : "encode"));
    };

    const getEncodingDescription = () => {
        if (mode === "encode") {
            switch (contentType) {
                case "url":
                    return "Encodes for URL path segments (preserves :/?=&)";
                case "query":
                    return "Encodes for URL query parameters";
                case "fullUrl":
                    return "Encodes a complete URL (preserves valid URL characters)";
            }
        } else {
            switch (contentType) {
                case "url":
                    return "Decodes URL-encoded path segments";
                case "query":
                    return "Decodes URL-encoded query parameters";
                case "fullUrl":
                    return "Decodes a complete URL";
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-purple-400 flex items-center gap-2">
                        <FiLink className="inline" /> URL Encoder/Decoder
                    </h1>
                    <p className="text-gray-400 mt-2">
                        A tool to encode or decode URL strings with different
                        encoding strategies
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-purple-300">
                                Input
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleClear}
                                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm flex items-center gap-1"
                                >
                                    <FiRefreshCw size={14} /> Clear
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full h-40 bg-gray-700 text-gray-100 p-3 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                            placeholder={`Enter text to ${mode}...`}
                        />
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-purple-300">
                                Output
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCopy}
                                    disabled={!outputText}
                                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                                        !outputText
                                            ? "bg-gray-700 text-gray-500"
                                            : "bg-purple-700 hover:bg-purple-600"
                                    }`}
                                >
                                    <FiCopy size={14} />{" "}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={outputText}
                            readOnly
                            className="w-full h-40 bg-gray-700 text-gray-100 p-3 rounded border border-gray-600 focus:outline-none"
                            placeholder={`${
                                mode === "encode" ? "Encoded" : "Decoded"
                            } result will appear here...`}
                        />
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-md font-semibold mb-3 text-purple-300">
                                Mode
                            </h3>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={mode === "encode"}
                                        onChange={() => setMode("encode")}
                                        className="text-purple-500 focus:ring-purple-500"
                                    />
                                    <span className="flex items-center gap-1">
                                        <FiLock size={16} /> Encode
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={mode === "decode"}
                                        onChange={() => setMode("decode")}
                                        className="text-purple-500 focus:ring-purple-500"
                                    />
                                    <span className="flex items-center gap-1">
                                        <FiUnlock size={16} /> Decode
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-md font-semibold mb-3 text-purple-300">
                                Content Type
                            </h3>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={contentType === "url"}
                                        onChange={() => setContentType("url")}
                                        className="text-purple-500 focus:ring-purple-500"
                                    />
                                    URL Path
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={contentType === "query"}
                                        onChange={() => setContentType("query")}
                                        className="text-purple-500 focus:ring-purple-500"
                                    />
                                    Query Parameter
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={contentType === "fullUrl"}
                                        onChange={() =>
                                            setContentType("fullUrl")
                                        }
                                        className="text-purple-500 focus:ring-purple-500"
                                    />
                                    Full URL
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoUpdate}
                                onChange={() => setAutoUpdate(!autoUpdate)}
                                className="text-purple-500 focus:ring-purple-500"
                            />
                            Auto-update results
                        </label>
                    </div>

                    <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
                        <FiCode className="inline mr-2" />
                        {getEncodingDescription()}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-900/50 rounded text-sm text-red-200 flex items-start gap-2">
                            <FiAlertTriangle className="mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={processText}
                        disabled={autoUpdate || !inputText}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${
                            autoUpdate || !inputText
                                ? "bg-gray-700 text-gray-500"
                                : "bg-purple-700 hover:bg-purple-600"
                        }`}
                    >
                        <FiCode /> {mode === "encode" ? "Encode" : "Decode"}
                    </button>
                    <button
                        onClick={handleSwap}
                        disabled={!inputText && !outputText}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${
                            !inputText && !outputText
                                ? "bg-gray-700 text-gray-500"
                                : "bg-blue-700 hover:bg-blue-600"
                        }`}
                    >
                        <FiRefreshCw /> Swap
                    </button>
                </div>

                <footer className="mt-12 text-center text-gray-500 text-sm">
                    <div className="flex justify-center items-center gap-2">
                        <a
                            href="https://github.com/yourusername/url-encoder-decoder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-400 flex items-center gap-1"
                        >
                            <FaGithub /> View on GitHub
                        </a>
                    </div>
                    <p className="mt-2">
                        Made with Next.js, TypeScript, and Tailwind CSS
                    </p>
                </footer>
            </div>
        </div>
    );
}
