'use client';

import React, { useState, useEffect } from "react";
import { ArrowBigDown} from "lucide-react";

// Random decision types
type DecisionType = "coin" | "dice" | "card" | "number" | "list";

// Type for the history entries
type HistoryEntry = {
    id: number;
    type: DecisionType;
    result: string;
    timestamp: Date;
};

const RandomDecisionMaker: React.FC = () => {
    // State management
    const [selectedType, setSelectedType] = useState<DecisionType>("coin");
    const [animating, setAnimating] = useState(false);
    const [result, setResult] = useState<string>("");
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [customList, setCustomList] = useState<string>("");
    const [customItems, setCustomItems] = useState<string[]>([]);
    const [diceCount, setDiceCount] = useState<number>(1);
    const [diceSides, setDiceSides] = useState<number>(6);
    const [minNumber, setMinNumber] = useState<number>(1);
    const [maxNumber, setMaxNumber] = useState<number>(100);
    const [rotation, setRotation] = useState<number>(0);

    // Process custom list when it changes
    useEffect(() => {
        if (customList.trim()) {
            setCustomItems(
                customList
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item)
            );
        } else {
            setCustomItems([]);
        }
    }, [customList]);

    // Function to generate a random result based on the selected type
    const generateResult = () => {
        setAnimating(true);
        setRotation((prev) => prev + 1080 + Math.floor(Math.random() * 360));

        setTimeout(() => {
            let newResult = "";

            switch (selectedType) {
                case "coin":
                    newResult = Math.random() < 0.5 ? "Heads" : "Tails";
                    break;

                case "dice":
                    const diceResults = Array.from(
                        { length: diceCount },
                        () => Math.floor(Math.random() * diceSides) + 1
                    );
                    newResult = diceResults.join(", ");
                    if (diceCount > 1) {
                        const sum = diceResults.reduce(
                            (acc, val) => acc + val,
                            0
                        );
                        newResult += ` (Sum: ${sum})`;
                    }
                    break;

                case "card":
                    const suits = ["♠️", "♥️", "♦️", "♣️"];
                    const values = [
                        "A",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "J",
                        "Q",
                        "K",
                    ];
                    const randomSuit =
                        suits[Math.floor(Math.random() * suits.length)];
                    const randomValue =
                        values[Math.floor(Math.random() * values.length)];
                    newResult = `${randomValue} ${randomSuit}`;
                    break;

                case "number":
                    newResult = String(
                        Math.floor(
                            Math.random() * (maxNumber - minNumber + 1)
                        ) + minNumber
                    );
                    break;

                case "list":
                    if (customItems.length > 0) {
                        newResult =
                            customItems[
                                Math.floor(Math.random() * customItems.length)
                            ];
                    } else {
                        newResult = "Please add items to your list";
                    }
                    break;
            }

            setResult(newResult);

            // Add to history
            if (newResult && !newResult.includes("Please add items")) {
                setHistory((prev) => [
                    {
                        id: Date.now(),
                        type: selectedType,
                        result: newResult,
                        timestamp: new Date(),
                    },
                    ...prev.slice(0, 9),
                ]);
            }

            setAnimating(false);
        }, 1000);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    // Get the appropriate icon component based on the decision type
    const getDecisionIcon = (type: DecisionType) => {
        switch (type) {
            case "coin":
                return <div className="text-2xl">🪙</div>;
            case "dice":
                return <div className="text-2xl">🎲</div>;
            case "card":
                return <div className="text-2xl">🃏</div>;
            case "number":
                return <div className="text-2xl">🔢</div>;
            case "list":
                return <div className="text-2xl">📋</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
            <div className="max-w-lg mx-auto">
                <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">
                    Random Decision Maker
                </h1>

                {/* Type selector */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Choose your randomizer
                    </h2>

                    <div className="grid grid-cols-3 gap-2 md:grid-cols-5 mb-6">
                        {(
                            [
                                "coin",
                                "dice",
                                "card",
                                "number",
                                "list",
                            ] as DecisionType[]
                        ).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                                    selectedType === type
                                        ? "bg-purple-600 text-white shadow-md scale-105"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {getDecisionIcon(type)}
                                <span className="mt-1 capitalize">{type}</span>
                            </button>
                        ))}
                    </div>

                    {/* Type-specific options */}
                    <div className="mb-6">
                        {selectedType === "dice" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Number of dice
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={diceCount}
                                        onChange={(e) =>
                                            setDiceCount(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full accent-purple-600"
                                    />
                                    <div className="text-right text-sm text-gray-600">
                                        {diceCount}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sides per die
                                    </label>
                                    <select
                                        value={diceSides}
                                        onChange={(e) =>
                                            setDiceSides(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {[4, 6, 8, 10, 12, 20, 100].map(
                                            (sides) => (
                                                <option
                                                    key={sides}
                                                    value={sides}
                                                >
                                                    d{sides}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}

                        {selectedType === "number" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min
                                    </label>
                                    <input
                                        type="number"
                                        value={minNumber}
                                        onChange={(e) =>
                                            setMinNumber(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max
                                    </label>
                                    <input
                                        type="number"
                                        value={maxNumber}
                                        onChange={(e) =>
                                            setMaxNumber(
                                                parseInt(e.target.value) ||
                                                    minNumber + 1
                                            )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                        )}

                        {selectedType === "list" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter items separated by commas
                                </label>
                                <textarea
                                    value={customList}
                                    onChange={(e) =>
                                        setCustomList(e.target.value)
                                    }
                                    placeholder="Item 1, Item 2, Item 3..."
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {customItems.length} items in your list
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generate button */}
                    <button
                        onClick={generateResult}
                        disabled={
                            animating ||
                            (selectedType === "list" &&
                                customItems.length === 0)
                        }
                        className={`w-full py-3 px-4 flex items-center justify-center rounded-lg text-white font-medium transition-all ${
                            animating ||
                            (selectedType === "list" &&
                                customItems.length === 0)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {animating ? (
                            <>
                                <ArrowBigDown className="w-5 h-5 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <ArrowBigDown className="w-5 h-5 mr-2" />
                                Generate Random{" "}
                                {selectedType.charAt(0).toUpperCase() +
                                    selectedType.slice(1)}
                            </>
                        )}
                    </button>
                </div>

                {/* Result display */}
                {result && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
                        <h2 className="text-xl font-semibold mb-2 text-gray-700">
                            Your Result
                        </h2>

                        <div
                            className={`flex items-center justify-center p-8 transition-all duration-1000 transform ${
                                animating ? "scale-110" : "scale-100"
                            }`}
                            style={{
                                transform: `rotateY(${
                                    animating ? rotation : 0
                                }deg)`,
                            }}
                        >
                            {selectedType === "coin" && (
                                <div
                                    className={`w-32 h-32 rounded-full bg-gradient-to-r ${
                                        result === "Heads"
                                            ? "from-yellow-400 to-yellow-600"
                                            : "from-yellow-400 to-yellow-600"
                                    } flex items-center justify-center shadow-lg`}
                                >
                                    <span className="text-4xl font-bold text-white">
                                        {
                                            animating ? "*" : result === "Heads" ? "H" : "T"
                                        }
                                    </span>
                                </div>
                            )}

                            {selectedType === "dice" && (
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {result
                                        .split(",")[0]
                                        .split(",")
                                        .map((die, index) => {
                                            const value = parseInt(die);
                                            return (
                                                <div
                                                    key={index}
                                                    className="w-16 h-16 bg-white border-2 border-red-500 rounded-lg flex items-center justify-center shadow-md"
                                                >
                                                    <span className="text-3xl font-bold text-red-500">
                                                        {value || "?"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}

                            {selectedType === "card" && (
                                <div className="w-32 h-48 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex flex-col items-center justify-center p-2">
                                    <span
                                        className={`text-4xl font-bold ${
                                            result.includes("♥️") ||
                                            result.includes("♦️")
                                                ? "text-red-600"
                                                : "text-black"
                                        }`}
                                    >
                                        {result}
                                    </span>
                                </div>
                            )}

                            {selectedType === "number" && (
                                <div className="text-6xl font-bold text-purple-700">
                                    {result}
                                </div>
                            )}

                            {selectedType === "list" && (
                                <div className="text-2xl font-medium text-purple-700 p-4 bg-purple-50 rounded-lg">
                                    {result}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* History section */}
                {history.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">
                                History
                            </h2>
                            <button
                                onClick={clearHistory}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-auto">
                            {history.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center p-2 border-b border-gray-100 text-sm"
                                >
                                    <div className="mr-3">
                                        {getDecisionIcon(entry.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {entry.result}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {entry.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RandomDecisionMaker;