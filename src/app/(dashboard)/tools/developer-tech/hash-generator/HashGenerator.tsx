'use client';

import { useState, useEffect, useCallback } from "react";
import { FaCopy, FaRandom, FaTrash } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import * as crypto from "crypto";

type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512" | "ripemd160";

const HashGenerator = () => {
    const [inputText, setInputText] = useState("");
    const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
        md5: "",
        sha1: "",
        sha256: "",
        sha512: "",
        ripemd160: "",
    });
    const [isClient, setIsClient] = useState(false);
    const [copiedHash, setCopiedHash] = useState<string | null>(null);
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [includeSalt, setIncludeSalt] = useState(false);
    const [salt, setSalt] = useState("");
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        setIsClient(true);
        generateRandomSalt();
    }, []);

    useEffect(() => {
        if (autoUpdate) {
            generateHashes();
        }
    }, [inputText, salt, includeSalt, autoUpdate]);

    const generateRandomSalt = () => {
        const randomSalt = crypto.randomBytes(16).toString("hex");
        setSalt(randomSalt);
    };

    const generateHashes = useCallback(() => {
        if (!isClient) return;

        const textToHash = includeSalt ? inputText + salt : inputText;

        const newHashes = {
            md5: crypto.createHash("md5").update(textToHash).digest("hex"),
            sha1: crypto.createHash("sha1").update(textToHash).digest("hex"),
            sha256: crypto
                .createHash("sha256")
                .update(textToHash)
                .digest("hex"),
            sha512: crypto
                .createHash("sha512")
                .update(textToHash)
                .digest("hex"),
            ripemd160: crypto
                .createHash("ripemd160")
                .update(textToHash)
                .digest("hex"),
        };

        setHashes(newHashes);
    }, [inputText, salt, includeSalt, isClient]);

    const handleCopy = (hash: string, algorithm: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(algorithm);
        setTimeout(() => setCopiedHash(null), 2000);
    };

    const generateRandomText = () => {
        const randomText = crypto.randomBytes(20).toString("hex");
        setInputText(randomText);
    };

    const clearInput = () => {
        setInputText("");
    };

    const handleManualGenerate = () => {
        if (!autoUpdate) {
            generateHashes();
        }
    };

    const hashInfo: Record<HashAlgorithm, { name: string; security: string }> =
        {
            md5: {
                name: "MD5",
                security: "Insecure - Not recommended for security purposes",
            },
            sha1: { name: "SHA-1", security: "Weak - Vulnerable to attacks" },
            sha256: { name: "SHA-256", security: "Secure - Widely used" },
            sha512: {
                name: "SHA-512",
                security: "Very Secure - Stronger than SHA-256",
            },
            ripemd160: {
                name: "RIPEMD-160",
                security: "Secure - Used in Bitcoin and others",
            },
        };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-blue-400">
                    Hash Generator
                </h1>

                <div className="mb-6 bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <label
                            htmlFor="input-text"
                            className="block text-sm font-medium mb-1"
                        >
                            Input Text
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={generateRandomText}
                                className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                                title="Generate random text"
                            >
                                <FaRandom className="mr-1" /> Random
                            </button>
                            <button
                                onClick={clearInput}
                                className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                                title="Clear input"
                            >
                                <FaTrash className="mr-1" /> Clear
                            </button>
                        </div>
                    </div>
                    <textarea
                        id="input-text"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter text to hash..."
                    />

                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="auto-update"
                                checked={autoUpdate}
                                onChange={(e) =>
                                    setAutoUpdate(e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label
                                htmlFor="auto-update"
                                className="ml-2 text-sm"
                            >
                                Auto-update hashes
                            </label>
                        </div>

                        {!autoUpdate && (
                            <button
                                onClick={handleManualGenerate}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                                Generate Hashes
                            </button>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="include-salt"
                                checked={includeSalt}
                                onChange={(e) =>
                                    setIncludeSalt(e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label
                                htmlFor="include-salt"
                                className="ml-2 text-sm"
                            >
                                Include salt
                            </label>
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className="ml-2 text-gray-400 hover:text-gray-300"
                                title="What is salt?"
                            >
                                <MdInfo size={18} />
                            </button>
                        </div>

                        {showInfo && (
                            <div className="mt-2 p-3 bg-gray-700 rounded-md text-sm">
                                <p className="mb-2">
                                    A salt is random data that is used as an
                                    additional input to the hashing function. It
                                    helps protect against rainbow table attacks
                                    by making each hash unique even for
                                    identical inputs.
                                </p>
                                <p>
                                    When enabled, the salt is appended to your
                                    input before hashing.
                                </p>
                            </div>
                        )}

                        {includeSalt && (
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center">
                                <input
                                    type="text"
                                    value={salt}
                                    onChange={(e) => setSalt(e.target.value)}
                                    className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Salt value"
                                />
                                <button
                                    onClick={generateRandomSalt}
                                    className="mt-2 sm:mt-0 sm:ml-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                                >
                                    Generate Salt
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">
                        Generated Hashes
                    </h2>

                    {Object.entries(hashes).map(([algorithm, hash]) => (
                        <div key={algorithm} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium capitalize">
                                    {hashInfo[algorithm as HashAlgorithm].name}
                                    <span className="ml-2 text-xs text-gray-400">
                                        (
                                        {
                                            hashInfo[algorithm as HashAlgorithm]
                                                .security
                                        }
                                        )
                                    </span>
                                </label>
                                <button
                                    onClick={() => handleCopy(hash, algorithm)}
                                    className={`flex items-center px-2 py-1 rounded text-xs ${
                                        copiedHash === algorithm
                                            ? "bg-green-600"
                                            : "bg-gray-700 hover:bg-gray-600"
                                    }`}
                                    title="Copy to clipboard"
                                >
                                    <FaCopy className="mr-1" />{" "}
                                    {copiedHash === algorithm
                                        ? "Copied!"
                                        : "Copy"}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={hash}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md font-mono text-sm overflow-x-auto"
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center pr-3 text-xs text-gray-400">
                                    {hash.length} chars
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center text-sm text-gray-400">
                    <p>
                        Note: MD5 and SHA-1 are provided for compatibility but
                        should not be used for security-sensitive purposes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HashGenerator;
