/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import {
    FaLock,
    FaKey,
    FaCopy,
    // FaSync,
    FaHistory,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";

// JWT decoder types
interface JwtHeader {
    alg: string;
    typ: string;
    kid?: string;
    x5t?: string;
    [key: string]: string | undefined;
}

interface JwtPayload {
    iat?: number;
    exp?: number;
    nbf?: number;
    sub?: string;
    iss?: string;
    aud?: string;
    [key: string]: any;
}

interface DecodedJwt {
    header: JwtHeader;
    payload: JwtPayload;
    signature: string;
    expired: boolean;
    notBefore: boolean;
    validTimestamp: boolean;
}

interface HistoryItem {
    token: string;
    timestamp: number;
}

const JwtDecoder = () => {
    const [token, setToken] = useState<string>("");
    const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
    const [activeTab, setActiveTab] = useState<
        "header" | "payload" | "signature"
    >("payload");
    const [tokenHistory, setTokenHistory] = useState<HistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Load history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("jwt-history");
        if (savedHistory) {
            try {
                setTokenHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse JWT history:", e);
                console.error("Failed to parse JWT history");
                localStorage.removeItem("jwt-history");
            }
        }
    }, []);

    // Save history to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("jwt-history", JSON.stringify(tokenHistory));
    }, [tokenHistory]);

    // Decode JWT token function
    const decodeJwt = (token: string): DecodedJwt | null => {
        if (!token || token.trim() === "") {
            setError("Please enter a JWT token");
            return null;
        }

        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                setError(
                    "Invalid JWT format. Expected 3 parts separated by dots."
                );
                return null;
            }

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            const signature = parts[2];

            const now = Math.floor(Date.now() / 1000);
            const expired =
                typeof payload.exp === "number" && payload.exp < now;
            const notBefore =
                typeof payload.nbf === "number" && payload.nbf > now;
            const validTimestamp =
                (!payload.exp || payload.exp > now) &&
                (!payload.nbf || payload.nbf <= now);

            // Add to history if not already present
            const isInHistory = tokenHistory.some(
                (item) => item.token === token
            );
            if (!isInHistory) {
                const newHistory = [
                    { token, timestamp: Date.now() },
                    ...tokenHistory,
                ].slice(0, 10); // Keep only last 10 tokens
                setTokenHistory(newHistory);
            }

            setError(null);
            return {
                header,
                payload,
                signature,
                expired,
                notBefore,
                validTimestamp,
            };
        } catch (e) {
            console.error("Error decoding JWT:", e);
            setError("Error decoding JWT: Invalid token encoding");
            return null;
        }
    };

    // Handle token input change
    const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setToken(e.target.value);
        setError(null);
    };

    // Handle decode button click
    const handleDecode = () => {
        const result = decodeJwt(token);
        if (result) setDecoded(result);
    };

    // Handle copy to clipboard
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    // Format date from timestamp
    const formatDate = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleString();
    };

    // Clear the current token
    const clearToken = () => {
        setToken("");
        setDecoded(null);
        setError(null);
    };

    // Load token from history
    const loadTokenFromHistory = (historyToken: string) => {
        setToken(historyToken);
        const result = decodeJwt(historyToken);
        if (result) setDecoded(result);
    };

    // Clear history
    const clearHistory = () => {
        setTokenHistory([]);
        localStorage.removeItem("jwt-history");
    };

    return (
        <div>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-4">
                    {/* Input Section */}
                    <div className="">
                        <div className="foreground shadow-input rounded-lg p-4">
                            <div className="flex flex-col space-y-4">
                                <h2 className="text-xl font-semibold flex items-center">
                                    <FaKey className="mr-2 text-yellow-500" />{" "}
                                    Token Input
                                </h2>

                                <Textarea
                                    value={token}
                                    onChange={handleTokenChange}
                                    placeholder="Paste your JWT token here..."
                                    className="h-[100px]"
                                />

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={handleDecode}
                                    >
                                        <FaLock className="mr-2" /> Decode Token
                                    </Button>

                                    <Button
                                        variant={'secondary'}
                                        onClick={clearToken}
                                    >
                                        <MdDelete className="mr-2" /> Clear
                                    </Button>
                                </div>

                                {error && (
                                    <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-1">
                        <div className="foreground shadow-input rounded-lg p-4">
                            <div className="flex flex-col space-y-4">
                                <h2 className="text-xl font-semibold flex items-center justify-between">
                                    <span className="flex items-center">
                                        <FaHistory className="mr-2 text-green-500" />{" "}
                                        Token History
                                    </span>
                                    {tokenHistory.length > 0 && (
                                        <button
                                            onClick={clearHistory}
                                            className="text-sm text-gray-400 hover:text-white"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </h2>

                                {tokenHistory.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">
                                        No history yet
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {tokenHistory.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-900 p-2 rounded border border-gray-700 cursor-pointer hover:border-blue-500 transition-colors"
                                                onClick={() =>
                                                    loadTokenFromHistory(
                                                        item.token
                                                    )
                                                }
                                            >
                                                <div className="text-xs font-mono text-gray-400 truncate">
                                                    {item.token.substring(
                                                        0,
                                                        40
                                                    )}
                                                    ...
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {new Date(
                                                        item.timestamp
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {decoded && (
                    <div className="mt-8 foreground shadow-input rounded-lg p-4">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">
                                Token Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div
                                    className={`p-3 rounded-lg border ${
                                        decoded.expired
                                            ? "border-red-600 bg-red-900/30"
                                            : "border-green-600 bg-green-900/30"
                                    }`}
                                >
                                    <div className="font-semibold mb-1">
                                        Expiration
                                    </div>
                                    {decoded.payload.exp ? (
                                        <>
                                            <div>
                                                {decoded.expired
                                                    ? "Expired"
                                                    : "Valid"}{" "}
                                                at{" "}
                                                {formatDate(
                                                    decoded.payload.exp
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {decoded.expired
                                                    ? `Expired ${Math.floor(
                                                          (Date.now() -
                                                              decoded.payload
                                                                  .exp *
                                                                  1000) /
                                                              1000 /
                                                              60
                                                      )} minutes ago`
                                                    : `Expires in ${Math.floor(
                                                          (decoded.payload.exp *
                                                              1000 -
                                                              Date.now()) /
                                                              1000 /
                                                              60
                                                      )} minutes`}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400">
                                            No expiration specified
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 rounded-lg border border-blue-600 bg-blue-900/30">
                                    <div className="font-semibold mb-1">
                                        Issued At
                                    </div>
                                    {decoded.payload.iat ? (
                                        <div>
                                            {formatDate(decoded.payload.iat)}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            Not specified
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`p-3 rounded-lg border ${
                                        decoded.notBefore
                                            ? "border-yellow-600 bg-yellow-900/30"
                                            : "border-green-600 bg-green-900/30"
                                    }`}
                                >
                                    <div className="font-semibold mb-1">
                                        Not Before
                                    </div>
                                    {decoded.payload.nbf ? (
                                        <div>
                                            {decoded.notBefore
                                                ? "Not yet valid"
                                                : "Valid"}{" "}
                                            from{" "}
                                            {formatDate(decoded.payload.nbf)}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            Not specified
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 border-b border-gray-700">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab("header")}
                                    className={`px-4 py-2 focus:outline-none ${
                                        activeTab === "header"
                                            ? "border-b-2 border-blue-500 text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    Header
                                </button>
                                <button
                                    onClick={() => setActiveTab("payload")}
                                    className={`px-4 py-2 focus:outline-none ${
                                        activeTab === "payload"
                                            ? "border-b-2 border-blue-500 text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    Payload
                                </button>
                                <button
                                    onClick={() => setActiveTab("signature")}
                                    className={`px-4 py-2 focus:outline-none ${
                                        activeTab === "signature"
                                            ? "border-b-2 border-blue-500 text-blue-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    Signature
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            {activeTab === "header" && (
                                <div className="font-mono bg-gray-950 p-4 rounded overflow-auto max-h-96">
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                JSON.stringify(
                                                    decoded.header,
                                                    null,
                                                    2
                                                ),
                                                "header"
                                            )
                                        }
                                        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded"
                                        title="Copy to clipboard"
                                    >
                                        <FaCopy />
                                        {copied === "header" && (
                                            <span className="absolute -top-8 -right-2 bg-gray-700 text-xs px-2 py-1 rounded">
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                    <pre className="text-gray-300">
                                        {JSON.stringify(
                                            decoded.header,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            )}

                            {activeTab === "payload" && (
                                <div className="font-mono bg-gray-950 p-4 rounded overflow-auto max-h-96">
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                JSON.stringify(
                                                    decoded.payload,
                                                    null,
                                                    2
                                                ),
                                                "payload"
                                            )
                                        }
                                        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded"
                                        title="Copy to clipboard"
                                    >
                                        <FaCopy />
                                        {copied === "payload" && (
                                            <span className="absolute -top-8 -right-2 bg-gray-700 text-xs px-2 py-1 rounded">
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                    <pre className="text-gray-300">
                                        {JSON.stringify(
                                            decoded.payload,
                                            null,
                                            2
                                        )}
                                    </pre>
                                </div>
                            )}

                            {activeTab === "signature" && (
                                <div className="font-mono bg-gray-950 p-4 rounded overflow-auto max-h-96">
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                decoded.signature,
                                                "signature"
                                            )
                                        }
                                        className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded"
                                        title="Copy to clipboard"
                                    >
                                        <FaCopy />
                                        {copied === "signature" && (
                                            <span className="absolute -top-8 -right-2 bg-gray-700 text-xs px-2 py-1 rounded">
                                                Copied!
                                            </span>
                                        )}
                                    </button>
                                    <div className="text-gray-300 break-all">
                                        {decoded.signature}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JwtDecoder;
