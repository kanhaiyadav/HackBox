// app/page.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import DisplayContent from "./DisplayContent";
import FileTypeSelector from "./FileTypeSelector";

export default function Home() {
    const [url, setUrl] = useState("");
    const [fileType, setFileType] = useState<"robots" | "sitemap">("robots");
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchContent = async () => {
        if (!url) {
            setError("Please enter a URL");
            return;
        }

        setLoading(true);
        setError(null);
        setContent(null);

        try {
            const response = await fetch("/api/fetch-file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, fileType }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch content");
            }

            const data = await response.json();
            setContent(data.content);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchContent();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Robots.txt & Sitemap Viewer
                </h1>

                <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="url"
                                className="block text-sm font-medium"
                            >
                                Website URL
                            </label>
                            <input
                                type="text"
                                id="url"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <FileTypeSelector
                            fileType={fileType}
                            setFileType={setFileType}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Fetch Content"
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
                        <p className="text-red-100">{error}</p>
                    </div>
                )}

                {content && (
                    <DisplayContent content={content} fileType={fileType} />
                )}
            </div>
        </div>
    );
}
