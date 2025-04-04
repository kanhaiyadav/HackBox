// components/DisplayContent.tsx
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface DisplayContentProps {
    content: string;
    fileType: "robots" | "sitemap";
}

const DisplayContent: React.FC<DisplayContentProps> = ({
    content,
    fileType,
}) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700">
                <h2 className="text-lg font-medium">
                    {fileType === "robots" ? "robots.txt" : "sitemap.xml"}
                </h2>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 mr-1" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: "70vh" }}>
                <pre
                    className={`text-sm ${
                        fileType === "sitemap"
                            ? "text-green-300"
                            : "text-gray-300"
                    }`}
                >
                    {content}
                </pre>
            </div>
        </div>
    );
};

export default DisplayContent;
