"use client";

import { useState, useMemo } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { diffChars, diffWords, diffLines, diffJson, diffArrays } from "diff";
import {
    FaCopy,
    FaExchangeAlt,
    FaAlignLeft,
    FaAlignCenter,
    // FaAlignRight,
    FaFileExport,
} from "react-icons/fa";

type DiffType = "chars" | "words" | "lines" | "json";
type ViewMode = "inline" | "side-by-side";

export default function TextDiffTool() {
    const [text1, setText1] = useState<string>("");
    const [text2, setText2] = useState<string>("");
    const [diffType, setDiffType] = useState<DiffType>("words");
    const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
    const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

    // Compute differences
    const differences = useMemo(() => {
        if (!text1 || !text2) return null;

        let processedText1 = text1;
        let processedText2 = text2;

        if (!caseSensitive) {
            processedText1 = text1.toLowerCase();
            processedText2 = text2.toLowerCase();
        }

        if (ignoreWhitespace) {
            processedText1 = processedText1.replace(/\s+/g, " ");
            processedText2 = processedText2.replace(/\s+/g, " ");
        }

        switch (diffType) {
            case "chars":
                return diffChars(processedText1, processedText2);
            case "words":
                return diffWords(processedText1, processedText2);
            case "lines":
                return diffLines(processedText1, processedText2);
            case "json":
                try {
                    const obj1 = JSON.parse(text1);
                    const obj2 = JSON.parse(text2);
                    return diffJson(obj1, obj2);
                } catch {
                    return diffLines(text1, text2);
                }
            default:
                return diffWords(processedText1, processedText2);
        }
    }, [text1, text2, diffType, ignoreWhitespace, caseSensitive]);

    // Swap texts
    const swapTexts = () => {
        setText1(text2);
        setText2(text1);
    };

    // Copy diff results
    const copyDiffResults = () => {
        const diffText = differences
            ?.map((part) => {
                const prefix = part.added ? "[+]" : part.removed ? "[-]" : "";
                return `${prefix}${part.value}`;
            })
            .join("");
        if(!diffText) return;
        navigator.clipboard.writeText(diffText);
    };

    // Export diff as HTML
    const exportDiffHTML = () => {
        const html = differences
            ?.map((part) => {
                const color = part.added
                    ? "bg-green-100"
                    : part.removed
                    ? "bg-red-100"
                    : "bg-gray-50";
                return `<span class="${color} p-0.5">${part.value
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}</span>`;
            })
            .join("");

        const blob = new Blob(
            [`<!DOCTYPE html><html><body>${html}</body></html>`],
            { type: "text/html" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "text-diff.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Render diff based on view mode
    const renderDiff = () => {
        if (!differences) return null;

        if (viewMode === "inline") {
            return (
                <div className="border rounded p-4 bg-white">
                    {differences.map((part, index) => (
                        <span
                            key={index}
                            className={
                                part.added
                                    ? "bg-green-100"
                                    : part.removed
                                    ? "bg-red-100 line-through"
                                    : "bg-gray-50"
                            }
                        >
                            {part.value}
                        </span>
                    ))}
                </div>
            );
        } else {
            // Side-by-side view
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded p-4">
                        <h3 className="font-bold mb-2">Original Text</h3>
                        {differences.map((part, index) =>
                            part.removed || !part.added ? (
                                <span
                                    key={index}
                                    className={
                                        part.removed
                                            ? "bg-red-100 line-through"
                                            : ""
                                    }
                                >
                                    {part.value}
                                </span>
                            ) : null
                        )}
                    </div>
                    <div className="border rounded p-4">
                        <h3 className="font-bold mb-2">Modified Text</h3>
                        {differences.map((part, index) =>
                            part.added || !part.removed ? (
                                <span
                                    key={index}
                                    className={part.added ? "bg-green-100" : ""}
                                >
                                    {part.value}
                                </span>
                            ) : null
                        )}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Text Difference Analyzer
            </h1>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block font-medium mb-2">
                        Original Text
                    </label>
                    <textarea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        className="w-full h-64 p-3 border rounded-md font-mono"
                        placeholder="Paste the original text here..."
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block font-medium">
                            Modified Text
                        </label>
                        <button
                            onClick={swapTexts}
                            className="p-2 text-gray-600 hover:text-gray-900"
                            title="Swap texts"
                        >
                            <FaExchangeAlt />
                        </button>
                    </div>
                    <textarea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        className="w-full h-64 p-3 border rounded-md font-mono"
                        placeholder="Paste the modified text here..."
                    />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Diff Type
                    </label>
                    <select
                        value={diffType}
                        onChange={(e) =>
                            setDiffType(e.target.value as DiffType)
                        }
                        className="p-2 border rounded"
                    >
                        <option value="chars">Character-level</option>
                        <option value="words">Word-level</option>
                        <option value="lines">Line-level</option>
                        <option value="json">JSON</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        View Mode
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode("inline")}
                            className={`p-2 rounded ${
                                viewMode === "inline"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100"
                            }`}
                            title="Inline view"
                        >
                            <FaAlignLeft />
                        </button>
                        <button
                            onClick={() => setViewMode("side-by-side")}
                            className={`p-2 rounded ${
                                viewMode === "side-by-side"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100"
                            }`}
                            title="Side-by-side view"
                        >
                            <FaAlignCenter />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={ignoreWhitespace}
                            onChange={() =>
                                setIgnoreWhitespace(!ignoreWhitespace)
                            }
                            className="rounded"
                        />
                        <span className="text-sm">Ignore whitespace</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={caseSensitive}
                            onChange={() => setCaseSensitive(!caseSensitive)}
                            className="rounded"
                        />
                        <span className="text-sm">Case-sensitive</span>
                    </label>
                </div>

                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={copyDiffResults}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                        title="Copy diff"
                    >
                        <FaCopy />
                    </button>
                    <button
                        onClick={exportDiffHTML}
                        className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                        title="Export as HTML"
                    >
                        <FaFileExport />
                    </button>
                </div>
            </div>

            {/* Diff Results */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Differences</h2>
                {differences ? (
                    renderDiff()
                ) : (
                    <div className="p-4 bg-gray-50 rounded text-gray-500">
                        Enter two texts to compare them
                    </div>
                )}
            </div>

            {/* Stats */}
            {differences && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Difference Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-2 bg-white rounded shadow">
                            <div className="text-sm text-gray-500">
                                Total changes
                            </div>
                            <div className="text-xl font-bold">
                                {
                                    differences.filter(
                                        (d) => d.added || d.removed
                                    ).length
                                }
                            </div>
                        </div>
                        <div className="p-2 bg-white rounded shadow">
                            <div className="text-sm text-gray-500">Added</div>
                            <div className="text-xl font-bold text-green-600">
                                {differences.filter((d) => d.added).length}
                            </div>
                        </div>
                        <div className="p-2 bg-white rounded shadow">
                            <div className="text-sm text-gray-500">Removed</div>
                            <div className="text-xl font-bold text-red-600">
                                {differences.filter((d) => d.removed).length}
                            </div>
                        </div>
                        <div className="p-2 bg-white rounded shadow">
                            <div className="text-sm text-gray-500">
                                Unchanged
                            </div>
                            <div className="text-xl font-bold">
                                {
                                    differences.filter(
                                        (d) => !d.added && !d.removed
                                    ).length
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
