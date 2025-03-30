"use client";

import React, { useState, useEffect } from "react";
import { IoListOutline } from "react-icons/io5";
import { MdFormatListNumbered } from "react-icons/md";
import { LuItalic } from "react-icons/lu";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { LuImport } from "react-icons/lu";

interface MarkdownEditorProps {
    initialValue?: string;
    onChange?: (value: string) => void;
    height?: string;
}

const EnhancedMarkdownEditor: React.FC<MarkdownEditorProps> = () => {
    const initialValue = `# Markdown Editor

<p align="center">
  <img src="/tools/text-processing/markdown-editor.png" width="150">
</p>

## Features

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- Headers with # characters
- Code blocks with syntax highlighting:

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Lists

1. First item
2. Second item
3. Third item

- Unordered list
- Another item
  - Nested item

> Blockquotes look like this and can be really useful for highlighting important information.

[Links](https://example.com) are also supported!

| Tables | Are | Supported |
|--------|-----|-----------|
| cell 1 | cell 2 | cell 3 |
| cell 4 | cell 5 | cell 6 |
`;
    const [markdownText, setMarkdownText] = useState(initialValue);
    const [htmlPreview, setHtmlPreview] = useState("");
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setMarkdownText(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    }, []);

    const { getRootProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/markdown": [".md", ".markdown"],
            "text/plain": [".txt"],
        },
    });

    const handleExport = () => {
        const blob = new Blob([markdownText], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "document.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        // Load GitHub Markdown CSS
        const linkLight = document.createElement("link");
        linkLight.href =
            "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-light.min.css";
        linkLight.rel = "stylesheet";
        linkLight.id = "github-markdown-light";
        document.head.appendChild(linkLight);

        const linkDark = document.createElement("link");
        linkDark.href =
            "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown-dark.min.css";
        linkDark.rel = "stylesheet";
        linkDark.id = "github-markdown-dark";
        document.head.appendChild(linkDark);

        // Initially hide dark theme
        linkDark.disabled = !darkMode;
        linkLight.disabled = darkMode;

        // Load Highlight.js CSS for syntax highlighting - both themes
        const highlightLightLink = document.createElement("link");
        highlightLightLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css";
        highlightLightLink.rel = "stylesheet";
        highlightLightLink.id = "highlight-light";
        document.head.appendChild(highlightLightLink);

        const highlightDarkLink = document.createElement("link");
        highlightDarkLink.href =
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css";
        highlightDarkLink.rel = "stylesheet";
        highlightDarkLink.id = "highlight-dark";
        document.head.appendChild(highlightDarkLink);

        // Initially hide dark theme
        highlightDarkLink.disabled = !darkMode;
        highlightLightLink.disabled = darkMode;

        return () => {
            document.head.removeChild(linkLight);
            document.head.removeChild(linkDark);
            document.head.removeChild(highlightLightLink);
            document.head.removeChild(highlightDarkLink);
        };
    }, []);

    // Effect to manage theme switching
    useEffect(() => {
        const lightMarkdown = document.getElementById(
            "github-markdown-light"
        ) as HTMLLinkElement;
        const darkMarkdown = document.getElementById(
            "github-markdown-dark"
        ) as HTMLLinkElement;
        const lightHighlight = document.getElementById(
            "highlight-light"
        ) as HTMLLinkElement;
        const darkHighlight = document.getElementById(
            "highlight-dark"
        ) as HTMLLinkElement;

        if (lightMarkdown && darkMarkdown && lightHighlight && darkHighlight) {
            lightMarkdown.disabled = darkMode;
            darkMarkdown.disabled = !darkMode;
            lightHighlight.disabled = darkMode;
            darkHighlight.disabled = !darkMode;
        }
    }, [darkMode]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdownText(e.target.value);
    };

    const fetchMarkdownPreview = async () => {
        if (!markdownText.trim()) {
            setHtmlPreview("");
            return;
        }

        setIsLoading(true);
        try {
            // Use GitHub's API for high-quality markdown rendering
            const response = await fetch("https://api.github.com/markdown", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/vnd.github.v3+json",
                },
                body: JSON.stringify({
                    text: markdownText,
                    mode: "gfm", // GitHub Flavored Markdown
                    context: "github/gollum",
                }),
            });

            if (response.ok) {
                const html = await response.text();
                // Make sure lists are properly styled by adding task-list-item classes
                const enhancedHtml = html
                    // Fix for list styling
                    .replace(/<ul>/g, '<ul class="contains-task-list">')
                    .replace(/<ol>/g, '<ol class="contains-task-list">');

                setHtmlPreview(enhancedHtml);

                // Apply syntax highlighting to code blocks
                setTimeout(() => {
                    if (window.hljs) {
                        document
                            .querySelectorAll(".markdown-body pre code")
                            .forEach((block) => {
                                window.hljs.highlightElement(
                                    block as HTMLElement
                                );
                            });
                    }
                }, 0);
            } else {
                console.error(
                    "Failed to convert markdown:",
                    await response.text()
                );
                setHtmlPreview(
                    "<p>Error converting markdown. Please try again.</p>"
                );
            }
        } catch (error) {
            console.error("Error:", error);
            setHtmlPreview("<p>Error connecting to markdown service.</p>");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePreview = async () => {
        if (!isPreviewMode && !htmlPreview) {
            await fetchMarkdownPreview();
        }
        setIsPreviewMode(!isPreviewMode);
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    // Utility function to insert text around selection
    const insertTextAtSelection = (before: string, after: string = "") => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selection = markdownText.substring(start, end);
            const replacement = `${before}${selection}${after}`;
            setMarkdownText(
                markdownText.substring(0, start) +
                    replacement +
                    markdownText.substring(end)
            );

            // Focus and set cursor position
            setTimeout(() => {
                textarea.focus();
                const newCursorPos =
                    start + before.length + selection.length + after.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
        }
    };

    return (
        <div
            className={`border rounded-lg overflow-hidden shadow-input ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            }`}
        >
            <div
                className={`${
                    darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-100 border-gray-200"
                } border-b flex items-center justify-between p-2`}
            >
                <div className="flex space-x-2">
                    <button
                        onClick={() => insertTextAtSelection("**", "**")}
                        className={`px-2 py-1 text-sm rounded font-bold ${
                            darkMode
                                ? "hover:bg-gray-600 text-white"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Bold"
                    >
                        B
                    </button>
                    <button
                        onClick={() => insertTextAtSelection("*", "*")}
                        className={`px-2 py-1 text-sm rounded italic ${
                            darkMode
                                ? "hover:bg-gray-600 text-white"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Italic"
                    >
                        <LuItalic size={16} />
                    </button>
                    <button
                        onClick={() => insertTextAtSelection("# ")}
                        className={`px-2 py-1 text-sm rounded font-bold ${
                            darkMode
                                ? "hover:bg-gray-600 text-white"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Heading"
                    >
                        H
                    </button>
                    <button
                        onClick={() => insertTextAtSelection("- ")}
                        className={`px-2 py-1 text-sm rounded ${
                            darkMode
                                ? "hover:bg-gray-600 text-white"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Bullet List"
                    >
                        <IoListOutline size={16} />
                    </button>
                    <button
                        onClick={() => insertTextAtSelection("1. ")}
                        className={`px-2 py-1 text-sm rounded ${
                            darkMode
                                ? "hover:bg-gray-600 text-white"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Numbered List"
                    >
                        <MdFormatListNumbered size={16} />
                    </button>
                    <button
                        onClick={() => insertTextAtSelection("```\n", "\n```")}
                        className={`px-2 py-1 text-sm rounded ${
                            darkMode
                                ? "hover:bg-gray-600 text-white"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                        title="Code Block"
                    >
                        {"</>"}
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleTheme}
                        className={`px-2 py-1 rounded ${
                            darkMode
                                ? "bg-gray-600 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {darkMode ? "☀️" : "🌙"}
                    </button>
                    <button
                        onClick={togglePreview}
                        className={`px-3 py-1 rounded ${
                            isPreviewMode
                                ? darkMode
                                    ? "bg-blue-800 text-blue-100"
                                    : "bg-blue-100 text-blue-700"
                                : darkMode
                                ? "text-gray-200 hover:bg-gray-600"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {isPreviewMode ? "Edit" : "Preview"}
                    </button>
                    {isPreviewMode && (
                        <button
                            onClick={fetchMarkdownPreview}
                            className={`px-3 py-1 rounded ${
                                isPreviewMode
                                    ? darkMode
                                        ? "bg-blue-800 text-blue-100"
                                        : "bg-blue-100 text-blue-700"
                                    : darkMode
                                    ? "text-gray-200 hover:bg-gray-600"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                            disabled={isLoading || !markdownText.trim()}
                        >
                            Refresh Preview
                        </button>
                    )}
                    <button
                        onClick={handleExport}
                        className={`px-3 py-1 rounded ${
                            isPreviewMode
                                ? darkMode
                                    ? "bg-blue-800 text-blue-100"
                                    : "bg-blue-100 text-blue-700"
                                : darkMode
                                ? "text-gray-200 hover:bg-gray-600"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        Export
                    </button>
                    {!isPreviewMode && (
                        <label
                            htmlFor="file"
                            className={`px-3 py-1 rounded ${
                                isPreviewMode
                                    ? darkMode
                                        ? "bg-blue-800 text-blue-100"
                                        : "bg-blue-100 text-blue-700"
                                    : darkMode
                                    ? "text-gray-200 hover:bg-gray-600"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Import
                            <input
                                id="file"
                                type="file"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setMarkdownText(
                                                event.target?.result as string
                                            );
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                                accept=".md, .markdown, .txt"
                            />
                        </label>
                    )}
                </div>
            </div>

            <div {...getRootProps()} className={`overflow-hidden relative`}>
                {/* <input {...getInputProps()} /> */}
                {isDragActive && (
                    <div
                        className={`absolute inset-0 bg-background/50 flex flex-col items-center justify-center`}
                    >
                        <LuImport className="text-white/80 text-8xl" />
                        <p>Drop your files here...</p>
                    </div>
                )}

                {!isPreviewMode ? (
                    <textarea
                        className={`min-h-[400px] w-full h-full p-4 resize-none focus:outline-none font-mono ${
                            darkMode
                                ? "bg-gray-800 text-gray-100"
                                : "bg-white text-gray-800"
                        }`}
                        value={markdownText}
                        onChange={handleTextChange}
                        placeholder="Write your markdown here..."
                    />
                ) : (
                    <div
                        className={`p-4 overflow-auto h-full ${
                            darkMode ? "bg-[#0d1117]" : "bg-white"
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div
                                    className={`animate-spin rounded-full h-10 w-10 border-b-2 ${
                                        darkMode
                                            ? "border-blue-400"
                                            : "border-blue-500"
                                    }`}
                                ></div>
                            </div>
                        ) : (
                            <div>
                                {/* Add custom CSS for list rendering to ensure it works regardless of the API response */}
                                <style
                                    dangerouslySetInnerHTML={{
                                        __html: `
                  .markdown-body ul {
                    list-style-type: disc !important;
                    padding-left: 2em !important;
                  }
                  .markdown-body ol {
                    list-style-type: decimal !important;
                    padding-left: 2em !important;
                  }
                  .markdown-body ul ul {
                    list-style-type: circle !important;
                  }
                  .markdown-body ul ul ul {
                    list-style-type: square !important;
                  }
                  .markdown-body li {
                    display: list-item !important;
                  }
                  .markdown-body li.task-list-item {
                    list-style-type: none !important;
                  }
                  .markdown-body {
                    color: ${darkMode ? "#c9d1d9" : "#24292e"};
                    background-color: ${darkMode ? "#0d1117" : "#ffffff"};
                  }
                  .markdown-body pre {
                    background-color: ${darkMode ? "#161b22" : "#f6f8fa"};
                  }
                `,
                                    }}
                                />
                                <div
                                    className={`markdown-body ${
                                        darkMode
                                            ? "markdown-body-dark"
                                            : "markdown-body-light"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: htmlPreview,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                className={`${
                    darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-300"
                        : "bg-gray-100 border-gray-200 text-gray-500"
                } border-t p-2 text-xs flex justify-between`}
            >
                <span>{markdownText.length} characters</span>
            </div>
        </div>
    );
};

export default EnhancedMarkdownEditor;

// Add to _app.tsx or a script tag in pages/_document.tsx
declare global {
    interface Window {
        hljs: {
            highlightElement: (element: HTMLElement) => void;
        };
    }
}
