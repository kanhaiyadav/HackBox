'use client';

import { useState, useEffect, useRef } from "react";
import {
    FiCopy,
    FiRefreshCw,
    FiCheck,
    FiLock,
    FiUnlock,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";

type PasswordOptions = {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
};

type PasswordHistoryItem = {
    password: string;
    timestamp: Date;
};

const PasswordGenerator = () => {
    const [password, setPassword] = useState<string>("");
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [copied, setCopied] = useState<boolean>(false);
    const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const passwordRef = useRef<HTMLInputElement>(null);

    const characterSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    const generatePassword = () => {
        let chars = "";
        let generatedPassword = "";

        if (options.uppercase) chars += characterSets.uppercase;
        if (options.lowercase) chars += characterSets.lowercase;
        if (options.numbers) chars += characterSets.numbers;
        if (options.symbols) chars += characterSets.symbols;

        if (chars.length === 0) {
            alert("Please select at least one character type");
            return;
        }

        for (let i = 0; i < options.length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            generatedPassword += chars[randomIndex];
        }

        setPassword(generatedPassword);

        // Add to history
        if (generatedPassword) {
            setHistory((prev) => [
                { password: generatedPassword, timestamp: new Date() },
                ...prev.slice(0, 9), // Keep only last 10 items
            ]);
        }
    };

    const copyToClipboard = () => {
        if (!password) return;

        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Focus the password field for visual feedback
        if (passwordRef.current) {
            passwordRef.current.select();
        }
    };

    const handleOptionChange = (key: keyof PasswordOptions, value: any) => {
        setOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const calculateStrength = () => {
        if (!password) return 0;

        let strength = 0;
        const { length } = password;

        // Length contributes up to 50 points (8 chars = 0, 32 chars = 50)
        strength += Math.min(50, Math.max(0, ((length - 8) / (32 - 8)) * 50));

        // Character variety contributes up to 50 points
        let varietyScore = 0;
        if (/[A-Z]/.test(password)) varietyScore += 10;
        if (/[a-z]/.test(password)) varietyScore += 10;
        if (/[0-9]/.test(password)) varietyScore += 10;
        if (/[^A-Za-z0-9]/.test(password)) varietyScore += 20;

        strength += varietyScore;

        return Math.min(100, Math.round(strength));
    };

    const getStrengthColor = (strength: number) => {
        if (strength < 30) return "bg-red-500";
        if (strength < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStrengthLabel = (strength: number) => {
        if (strength === 0) return "None";
        if (strength < 30) return "Weak";
        if (strength < 70) return "Moderate";
        if (strength < 90) return "Strong";
        return "Very Strong";
    };

    const strength = calculateStrength();

    useEffect(() => {
        generatePassword();
    }, []);

    const removeFromHistory = (index: number) => {
        setHistory((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
                    Advanced Password Generator
                </h1>

                <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
                    <div className="flex items-center mb-4">
                        <div className="relative flex-grow">
                            <input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                value={password}
                                readOnly
                                className="w-full bg-gray-700 border border-gray-600 rounded-l-lg py-3 px-4 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? (
                                    <FiEyeOff size={20} />
                                ) : (
                                    <FiEye size={20} />
                                )}
                            </button>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-r-lg py-3 px-4 transition-colors ${
                                copied ? "text-green-400" : "text-gray-300"
                            }`}
                            aria-label="Copy to clipboard"
                        >
                            {copied ? (
                                <FiCheck size={20} />
                            ) : (
                                <FiCopy size={20} />
                            )}
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-1">
                            <span>Password Strength:</span>
                            <span className="font-medium">
                                {getStrengthLabel(strength)} ({strength}%)
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${getStrengthColor(
                                    strength
                                )}`}
                                style={{ width: `${strength}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Length: {options.length}
                            </label>
                            <input
                                type="range"
                                min="4"
                                max="64"
                                value={options.length}
                                onChange={(e) =>
                                    handleOptionChange(
                                        "length",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium mb-2">
                                Character Types:
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="uppercase"
                                    checked={options.uppercase}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            "uppercase",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                />
                                <label
                                    htmlFor="uppercase"
                                    className="ml-2 text-sm"
                                >
                                    Uppercase (A-Z)
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="lowercase"
                                    checked={options.lowercase}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            "lowercase",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                />
                                <label
                                    htmlFor="lowercase"
                                    className="ml-2 text-sm"
                                >
                                    Lowercase (a-z)
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="numbers"
                                    checked={options.numbers}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            "numbers",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                />
                                <label
                                    htmlFor="numbers"
                                    className="ml-2 text-sm"
                                >
                                    Numbers (0-9)
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="symbols"
                                    checked={options.symbols}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            "symbols",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                />
                                <label
                                    htmlFor="symbols"
                                    className="ml-2 text-sm"
                                >
                                    Symbols (!@#$...)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-colors"
                        >
                            {showHistory ? (
                                <FiLock size={18} />
                            ) : (
                                <FiUnlock size={18} />
                            )}
                            {showHistory ? "Hide History" : "Show History"}
                        </button>
                        <button
                            onClick={generatePassword}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            <FiRefreshCw size={18} />
                            Generate New
                        </button>
                    </div>
                </div>

                {showHistory && history.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-purple-400">
                            Password History
                        </h2>
                        <ul className="space-y-3">
                            {history.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <span className="font-mono mr-4">
                                            {showPassword
                                                ? item.password
                                                : "•".repeat(
                                                      item.password.length
                                                  )}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {item.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setPassword(item.password);
                                                setShowHistory(false);
                                            }}
                                            className="text-purple-400 hover:text-purple-300"
                                            aria-label="Use this password"
                                        >
                                            <FiCheck size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeFromHistory(index)
                                            }
                                            className="text-red-400 hover:text-red-300"
                                            aria-label="Remove from history"
                                        >
                                            <FaRegTrashAlt size={16} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PasswordGenerator;