'use client';

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/debounce";
import {
    FaTrash,
    FaCopy,
    FaRandom,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaQuoteLeft,
    FaCode,
    FaLink,
    FaImage,
} from "react-icons/fa";
import { titleCase } from "title-case";

export default function TextCleaner() {
    const [inputText, setInputText] = useState<string>("");
    const [outputText, setOutputText] = useState<string>("");
    const [findText, setFindText] = useState<string>("");
    const [replaceText, setReplaceText] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("whitespace");
    const [history, setHistory] = useState<string[]>([]);
    const debouncedInput = useDebounce(inputText, 500);

    // Auto-process when input changes (debounced)
    useEffect(() => {
        if (debouncedInput) processText();
    }, [debouncedInput, activeTab, findText, replaceText]);

    // Process text based on active tab
    const processText = () => {
        setIsProcessing(true);
        let processedText = inputText;

        switch (activeTab) {
            // ** Whitespace Cleaner **
            case "whitespace":
                processedText = inputText
                    .trim() // Remove leading/trailing spaces
                    .replace(/\s+/g, " "); // Replace multiple spaces with one
                break;

            // ** Case Converter **
            case "case":
                processedText = inputText.toLowerCase(); // Default to lowercase
                break;

            // ** Line Break Formatter **
            case "lines":
                processedText = inputText
                    .replace(/\r\n/g, "\n") // Normalize line breaks
                    .replace(/\n+/g, "\n"); // Remove extra line breaks
                break;

            // ** Special Character Remover **
            case "special":
                processedText = inputText.replace(/[^\w\s]/gi, ""); // Remove non-alphanumeric
                break;

            // ** HTML/XML Tag Remover **
            case "html":
                processedText = inputText.replace(/<[^>]*>/g, ""); // Strip HTML tags
                break;

            // ** Duplicate Line Remover **
            case "duplicates":
                const lines = inputText.split("\n");
                processedText = [...new Set(lines)].join("\n"); // Remove duplicates
                break;

            // ** Find & Replace **
            case "replace":
                if (findText) {
                    const regex = new RegExp(findText, "g");
                    processedText = inputText.replace(regex, replaceText);
                }
                break;

            // ** Sort & Reverse **
            case "sort":
                const linesToSort = inputText.split("\n");
                processedText = linesToSort.sort().join("\n"); // Alphabetical sort
                break;

            // ** Slug Generator **
            case "slug":
                processedText = inputText
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "") // Remove special chars
                    .replace(/\s+/g, "-") // Replace spaces with hyphens
                    .replace(/-+/g, "-"); // Remove duplicate hyphens
                break;

            // ** JSON Formatter **
            case "json":
                try {
                    processedText = JSON.stringify(
                        JSON.parse(inputText),
                        null,
                        2
                    );
                } catch (e) {
                    processedText = "Invalid JSON";
                }
                break;

            default:
                processedText = inputText;
        }

        setOutputText(processedText);
        setIsProcessing(false);
    };

    // ** Copy to Clipboard **
    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputText);
    };

    // ** Download as TXT **
    const downloadText = () => {
        const blob = new Blob([outputText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cleaned-text.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ** Apply Case Formatting **
    const applyCase = (type: string) => {
        let formattedText = outputText;
        switch (type) {
            case "lower":
                formattedText = outputText.toLowerCase();
                break;
            case "upper":
                formattedText = outputText.toUpperCase();
                break;
            case "title":
                formattedText = titleCase(outputText);
                break;
            case "sentence":
                formattedText =
                    outputText.charAt(0).toUpperCase() +
                    outputText.slice(1).toLowerCase();
                break;
            case "inverse":
                formattedText = outputText
                    .split("")
                    .map((c) =>
                        c === c.toUpperCase()
                            ? c.toLowerCase()
                            : c.toUpperCase()
                    )
                    .join("");
                break;
        }
        setOutputText(formattedText);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Text Cleaner</h1>

            {/* ** Tabs for Different Cleaners ** */}
            <div className="flex overflow-x-auto mb-4 border-b border-gray-200">
                {[
                    { id: "whitespace", label: "Whitespace" },
                    { id: "case", label: "Case" },
                    { id: "lines", label: "Line Breaks" },
                    { id: "special", label: "Special Chars" },
                    { id: "html", label: "HTML Tags" },
                    { id: "duplicates", label: "Duplicates" },
                    { id: "replace", label: "Find & Replace" },
                    { id: "sort", label: "Sort/Reverse" },
                    { id: "slug", label: "Slug" },
                    { id: "json", label: "JSON" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium ${
                            activeTab === tab.id
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ** Find & Replace (Conditional) ** */}
            {activeTab === "replace" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Find
                        </label>
                        <input
                            type="text"
                            value={findText}
                            onChange={(e) => setFindText(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Text to find"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Replace
                        </label>
                        <input
                            type="text"
                            value={replaceText}
                            onChange={(e) => setReplaceText(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Replacement text"
                        />
                    </div>
                </div>
            )}

            {/* ** Text Input & Output Areas ** */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Input Text
                    </label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-64 p-3 border rounded-md font-mono"
                        placeholder="Paste your text here..."
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium">
                            Output Text
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                title="Copy"
                            >
                                <FaCopy />
                            </button>
                            <button
                                onClick={downloadText}
                                className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                                title="Download"
                            >
                                <FaTrash />{" "}
                                {/* (Using trash icon as download for demo) */}
                            </button>
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={outputText}
                        className="w-full h-64 p-3 border rounded-md font-mono bg-gray-50"
                        placeholder="Cleaned text will appear here..."
                    />
                </div>
            </div>

            {/* ** Case Conversion Buttons ** */}
            {activeTab === "case" && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => applyCase("lower")}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                    >
                        lowercase
                    </button>
                    <button
                        onClick={() => applyCase("upper")}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                    >
                        UPPERCASE
                    </button>
                    <button
                        onClick={() => applyCase("title")}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                    >
                        Title Case
                    </button>
                    <button
                        onClick={() => applyCase("sentence")}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                    >
                        Sentence case
                    </button>
                    <button
                        onClick={() => applyCase("inverse")}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                    >
                        iNVERSE cASE
                    </button>
                </div>
            )}

            {/* ** Sort & Reverse Options ** */}
            {activeTab === "sort" && (
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => {
                            const lines = outputText.split("\n");
                            setOutputText(lines.sort().join("\n"));
                        }}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded"
                    >
                        Sort A-Z
                    </button>
                    <button
                        onClick={() => {
                            const lines = outputText.split("\n");
                            setOutputText(lines.sort().reverse().join("\n"));
                        }}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded"
                    >
                        Sort Z-A
                    </button>
                    <button
                        onClick={() => {
                            setOutputText(
                                outputText.split("").reverse().join("")
                            );
                        }}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded"
                    >
                        Reverse Text
                    </button>
                </div>
            )}
        </div>
    );
}
