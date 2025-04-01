'use client';
import { useState, useRef, useEffect } from "react";
import { parse, unparse } from "papaparse";
import { saveAs } from "file-saver";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ConversionType = "csv-to-json" | "json-to-csv";
type Delimiter = "," | ";" | "\t" | "|";
type QuoteChar = '"' | "'" | "`";

export default function FileConverter() {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [conversionType, setConversionType] =
        useState<ConversionType>("csv-to-json");
    const [delimiter, setDelimiter] = useState<Delimiter>(",");
    const [quoteChar, setQuoteChar] = useState<QuoteChar>('"');
    const [hasHeader, setHasHeader] = useState(true);
    const [prettyPrint, setPrettyPrint] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputText) {
            handleConvert();
        }
    }, [conversionType, delimiter, quoteChar, hasHeader, prettyPrint]);

    const handleConvert = () => {
        setIsProcessing(true);
        setError(null);

        try {
            if (conversionType === "csv-to-json") {
                const results = parse(inputText, {
                    header: hasHeader,
                    delimiter,
                    quoteChar,
                    skipEmptyLines: true,
                    transform: (value) => value.trim(),
                });

                if (results.errors.length > 0) {
                    throw new Error(results.errors[0].message);
                }

                const jsonOutput = prettyPrint
                    ? JSON.stringify(results.data, null, 2)
                    : JSON.stringify(results.data);

                setOutputText(jsonOutput);
            } else {
                let jsonData;
                try {
                    jsonData = JSON.parse(inputText);
                } catch (e) {
                    throw new Error("Invalid JSON format");
                }

                const csvOutput = unparse(jsonData, {
                    header: hasHeader,
                    delimiter,
                    quoteChar,
                });

                setOutputText(csvOutput);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            setOutputText("");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setInputText(content);
        };
        reader.readAsText(file);
    };

    const downloadOutput = () => {
        if (!outputText) return;

        const blob = new Blob([outputText], {
            type: "text/plain;charset=utf-8",
        });
        const extension = conversionType === "csv-to-json" ? "json" : "csv";
        saveAs(blob, `converted-file.${extension}`);
    };

    const clearAll = () => {
        setInputText("");
        setOutputText("");
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const copyToClipboard = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
    };

    const sampleData = () => {
        if (conversionType === "csv-to-json") {
            setInputText(`name,age,email
John Doe,30,john@example.com
Jane Smith,25,jane@example.com`);
        } else {
            setInputText(`[
  {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com"
  },
  {
    "name": "Jane Smith",
    "age": 25,
    "email": "jane@example.com"
  }
]`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    File Format Converter
                </h1>

                {/* Conversion Type Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex rounded-md shadow-sm">
                        <button
                            onClick={() => setConversionType("csv-to-json")}
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                                conversionType === "csv-to-json"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            CSV to JSON
                        </button>
                        <button
                            onClick={() => setConversionType("json-to-csv")}
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                                conversionType === "json-to-csv"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            JSON to CSV
                        </button>
                    </div>
                </div>

                {/* Options Panel */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delimiter
                            </label>
                            <select
                                value={delimiter}
                                onChange={(e) =>
                                    setDelimiter(e.target.value as Delimiter)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value=",">Comma (,)</option>
                                <option value=";">Semicolon (;)</option>
                                <option value="\t">Tab (\t)</option>
                                <option value="|">Pipe (|)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quote Character
                            </label>
                            <select
                                value={quoteChar}
                                onChange={(e) =>
                                    setQuoteChar(e.target.value as QuoteChar)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value='"'>&quot; (Double Quote)</option>
                                <option value="'">' (Single Quote)</option>
                                <option value="`">` (Backtick)</option>
                            </select>
                        </div>
                        <div className="flex items-end space-x-4">
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={hasHeader}
                                        onChange={(e) =>
                                            setHasHeader(e.target.checked)
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Has Header Row
                                    </span>
                                </label>
                            </div>
                            {conversionType === "csv-to-json" && (
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={prettyPrint}
                                            onChange={(e) =>
                                                setPrettyPrint(e.target.checked)
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Pretty Print
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {conversionType === "csv-to-json"
                            ? "CSV File"
                            : "JSON File"}
                    </label>
                    <div className="flex space-x-4">
                        <input
                            type="file"
                            accept={
                                conversionType === "csv-to-json"
                                    ? ".csv,.txt"
                                    : ".json,.txt"
                            }
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                        <button
                            onClick={sampleData}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                        >
                            Load Sample
                        </button>
                    </div>
                </div>

                {/* Input/Output Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {conversionType === "csv-to-json"
                                ? "CSV Input"
                                : "JSON Input"}
                        </label>
                        {/* <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
                            placeholder={
                                conversionType === "csv-to-json"
                                    ? "Paste your CSV data here..."
                                    : "Paste your JSON data here..."
                            }
                        /> */}
                        <div className="relative">
                            {conversionType === "json-to-csv" ? (
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
                                    {inputText ||
                                        "Paste your JSON data here..."}
                                </SyntaxHighlighter>
                            ) : (
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
                                    {inputText ||
                                        "Paste your JSON data here..."}
                                </SyntaxHighlighter>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {conversionType === "csv-to-json"
                                    ? "JSON Output"
                                    : "CSV Output"}
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!outputText}
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        outputText
                                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    Copy
                                </button>
                                <button
                                    onClick={downloadOutput}
                                    disabled={!outputText}
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        outputText
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            : "bg-blue-50 text-blue-300 cursor-not-allowed"
                                    }`}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-auto">
                            {conversionType === "json-to-csv" ? (
                                <SyntaxHighlighter
                                    language="csv"
                                    style={coy}
                                    customStyle={{
                                        background: "transparent",
                                        margin: 0,
                                        padding: 0,
                                    }}
                                >
                                    {outputText ||
                                        "Converted output will appear here..."}
                                </SyntaxHighlighter>
                            ) : (
                                <SyntaxHighlighter
                                    language="json"
                                    style={coy}
                                    customStyle={{
                                        background: "transparent",
                                        margin: 0,
                                        padding: 0,
                                        overflow: "auto",
                                        maxHeight: "100%",
                                    }}
                                    wrapLines
                                >
                                    {outputText ||
                                        "Converted output will appear here..."}
                                </SyntaxHighlighter>
                            )}
                        </div>
                        {/* <textarea
                            value={outputText}
                            readOnly
                            className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                            placeholder="Converted output will appear here..."
                        /> */}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleConvert}
                        disabled={!inputText || isProcessing}
                        className={`px-6 py-2 rounded-md text-white ${
                            !inputText || isProcessing
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isProcessing ? "Processing..." : "Convert"}
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Clear All
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}