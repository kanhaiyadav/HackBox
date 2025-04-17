"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/debounce";
import { FaCopy, FaDownload, FaUndo, FaRedo } from "react-icons/fa";
import { titleCase } from "title-case";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type HistoryItem = {
    input: string;
    output: string;
};

export default function TextCleaner() {
    const [inputText, setInputText] = useState<string>("");
    const [outputText, setOutputText] = useState<string>("");
    const [findText, setFindText] = useState<string>("");
    const [replaceText, setReplaceText] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("whitespace");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [autoProcess, setAutoProcess] = useState<boolean>(true);
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
    const [useRegex, setUseRegex] = useState<boolean>(false);
    const [wholeWord, setWholeWord] = useState<boolean>(false);
    const debouncedInput = useDebounce(inputText, 500);

    // Add to history
    const addToHistory = useCallback(
        (input: string, output: string) => {
            const newHistory = [
                ...history.slice(0, historyIndex + 1),
                { input, output },
            ];
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        },
        [history, historyIndex]
    );

    // Undo
    const undo = () => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setInputText(prevState.input);
            setOutputText(prevState.output);
            setHistoryIndex(historyIndex - 1);
        }
    };

    // Redo
    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setInputText(nextState.input);
            setOutputText(nextState.output);
            setHistoryIndex(historyIndex + 1);
        }
    };

    // Auto-process when input changes (debounced)
    useEffect(() => {
        if (autoProcess && debouncedInput) {
            processText();
        }
    }, [
        debouncedInput,
        activeTab,
        findText,
        replaceText,
        caseSensitive,
        useRegex,
        wholeWord,
        autoProcess,
    ]);

    // Process text based on active tab
    const processText = useCallback(() => {
        setIsProcessing(true);
        let processedText = inputText;

        try {
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
                    // Preserve common punctuation by default
                    processedText = inputText.replace(/[^\w\s.,!?;:'"-]/gi, "");
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
                        const searchPattern = useRegex
                            ? new RegExp(findText, caseSensitive ? "g" : "gi")
                            : new RegExp(
                                  wholeWord
                                      ? `\\b${escapeRegExp(findText)}\\b`
                                      : escapeRegExp(findText),
                                  caseSensitive ? "g" : "gi"
                              );

                        processedText = inputText.replace(
                            searchPattern,
                            replaceText
                        );
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
                        const parsed = JSON.parse(inputText);
                        processedText = JSON.stringify(parsed, null, 2);
                    } catch (e) {
                        throw new Error(
                            "Invalid JSON: " + (e as Error).message
                        );
                    }
                    break;

                default:
                    processedText = inputText;
            }

            setOutputText(processedText);
            addToHistory(inputText, processedText);
        } catch (error) {
            toast.error((error as Error).message);
            setOutputText(`Error: ${(error as Error).message}`);
        } finally {
            setIsProcessing(false);
        }
    }, [
        inputText,
        activeTab,
        findText,
        replaceText,
        caseSensitive,
        useRegex,
        wholeWord,
        addToHistory,
    ]);

    // Helper to escape regex in find/replace
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    // ** Copy to Clipboard **
    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(outputText)
            .then(() => toast.success("Copied to clipboard!"))
            .catch(() => toast.error("Failed to copy"));
    };

    // ** Download as TXT **
    const downloadText = () => {
        try {
            const blob = new Blob([outputText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cleaned-text-${new Date()
                .toISOString()
                .slice(0, 10)}.txt`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
            toast.success("Download started");
        } catch (error) {
            console.log(error);
            toast.error("Failed to download");
        }
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
        addToHistory(inputText, formattedText);
    };

    return (
        <div className="max-w-6xl mx-auto md:p-6">
            {/* Settings Bar */}
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <div className="flex items-center gap-2">
                    <Switch
                        id="auto-process"
                        checked={autoProcess}
                        onCheckedChange={setAutoProcess}
                    />
                    <Label htmlFor="auto-process">Auto Process</Label>
                </div>

                {!autoProcess && (
                    <Button onClick={processText} disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Process Text"}
                    </Button>
                )}

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        aria-label="Undo"
                    >
                        <FaUndo />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        aria-label="Redo"
                    >
                        <FaRedo />
                    </Button>
                </div>
            </div>

            {/* ** Tabs for Different Cleaners ** */}
            <div className="mb-4">
                <Select
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="whitespace">
                                Whitespace
                            </SelectItem>
                            <SelectItem value="case">Case</SelectItem>
                            <SelectItem value="lines">Line Breaks</SelectItem>
                            <SelectItem value="special">
                                Special Chars
                            </SelectItem>
                            <SelectItem value="html">HTML Tags</SelectItem>
                            <SelectItem value="duplicates">
                                Duplicates
                            </SelectItem>
                            <SelectItem value="replace">
                                Find & Replace
                            </SelectItem>
                            <SelectItem value="sort">Sort/Reverse</SelectItem>
                            <SelectItem value="slug">Slug</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* ** Find & Replace Options ** */}
            {activeTab === "replace" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label className="block text-sm font-medium mb-1">
                            Find
                        </Label>
                        <Input
                            type="text"
                            value={findText}
                            onChange={(e) => setFindText(e.target.value)}
                            placeholder="Text to find"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium mb-1">
                            Replace
                        </Label>
                        <Input
                            type="text"
                            value={replaceText}
                            onChange={(e) => setReplaceText(e.target.value)}
                            placeholder="Replacement text"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4 col-span-2">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="case-sensitive"
                                checked={caseSensitive}
                                onCheckedChange={setCaseSensitive}
                            />
                            <Label htmlFor="case-sensitive">
                                Case Sensitive
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="use-regex"
                                checked={useRegex}
                                onCheckedChange={setUseRegex}
                            />
                            <Label htmlFor="use-regex">Use Regex</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="whole-word"
                                checked={wholeWord}
                                onCheckedChange={setWholeWord}
                                disabled={useRegex}
                            />
                            <Label htmlFor="whole-word">Whole Word</Label>
                        </div>
                    </div>
                    {useRegex && (
                        <div className="col-span-2 text-sm text-muted-foreground">
                            Note: Using regular expressions. Special characters
                            will be interpreted as regex patterns.
                        </div>
                    )}
                </div>
            )}

            {/* ** Text Input & Output Areas ** */}
            <div className="flex flex-col gap-4">
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Input Text
                        <span className="ml-2 text-muted-foreground font-normal">
                            {inputText.length} characters,{" "}
                            {inputText.split(/\s+/).filter(Boolean).length}{" "}
                            words
                        </span>
                    </Label>
                    <Textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="h-64 font-mono"
                        placeholder="Paste your text here..."
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <Label className="block text-sm font-medium">
                            Output Text
                            <span className="ml-2 text-muted-foreground font-normal">
                                {outputText.length} characters,{" "}
                                {outputText.split(/\s+/).filter(Boolean).length}{" "}
                                words
                            </span>
                        </Label>
                        <div className="flex space-x-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={copyToClipboard}
                                aria-label="Copy to clipboard"
                                disabled={!outputText}
                            >
                                <FaCopy />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={downloadText}
                                aria-label="Download"
                                disabled={!outputText}
                            >
                                <FaDownload />
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        readOnly
                        value={outputText}
                        className="w-full h-64 font-mono"
                        placeholder="Cleaned text will appear here..."
                    />
                </div>
            </div>

            {/* ** Case Conversion Buttons ** */}
            {activeTab === "case" && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() => applyCase("lower")}
                        disabled={!outputText}
                    >
                        lowercase
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => applyCase("upper")}
                        disabled={!outputText}
                    >
                        UPPERCASE
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => applyCase("title")}
                        disabled={!outputText}
                    >
                        Title Case
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => applyCase("sentence")}
                        disabled={!outputText}
                    >
                        Sentence case
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => applyCase("inverse")}
                        disabled={!outputText}
                    >
                        iNVERSE cASE
                    </Button>
                </div>
            )}

            {/* ** Sort & Reverse Options ** */}
            {activeTab === "sort" && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const lines = outputText.split("\n");
                            setOutputText(lines.sort().join("\n"));
                            addToHistory(inputText, lines.sort().join("\n"));
                        }}
                        disabled={!outputText}
                    >
                        Sort A-Z
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            const lines = outputText.split("\n");
                            setOutputText(lines.sort().reverse().join("\n"));
                            addToHistory(
                                inputText,
                                lines.sort().reverse().join("\n")
                            );
                        }}
                        disabled={!outputText}
                    >
                        Sort Z-A
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            const reversed = outputText
                                .split("")
                                .reverse()
                                .join("");
                            setOutputText(reversed);
                            addToHistory(inputText, reversed);
                        }}
                        disabled={!outputText}
                    >
                        Reverse Text
                    </Button>
                </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
                <div className="mt-4 text-sm text-muted-foreground">
                    Processing...
                </div>
            )}
        </div>
    );
}
