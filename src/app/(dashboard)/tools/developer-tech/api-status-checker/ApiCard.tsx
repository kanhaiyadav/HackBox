// File: components/ApiCard.tsx
"use client";

import { useState } from "react";
import { ApiEndpoint } from "@/types/api";
import StatusBadge from "./StatusBadge";
import ApiDetails from "./ApiDetails";

interface ApiCardProps {
    endpoint: ApiEndpoint;
    onDelete: (id: string) => void;
    onUpdate: (endpoint: ApiEndpoint) => void;
    onCheck: () => void;
}

export default function ApiCard({
    endpoint,
    onDelete,
    onUpdate,
    onCheck,
}: ApiCardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        await onCheck();
        setLoading(false);
    };

    const formatTime = (timestamp?: string) => {
        if (!timestamp) return "Never";

        const date = new Date(timestamp);
        return date.toLocaleTimeString() + " " + date.toLocaleDateString();
    };

    return (
        <div className="bg-gray-700 rounded-lg overflow-hidden shadow-md">
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-medium text-lg text-white truncate">
                            {endpoint.name}
                        </h3>
                        <p className="text-gray-400 text-sm truncate">
                            {endpoint.url}
                        </p>
                    </div>
                    <StatusBadge status={endpoint.status || "down"} />
                </div>

                <div className="mt-3 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span>Response time:</span>
                        <span className="font-medium">
                            {endpoint.responseTime
                                ? `${endpoint.responseTime}ms`
                                : "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span>Last check:</span>
                        <span className="font-medium">
                            {formatTime(endpoint.lastChecked)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-gray-300 hover:text-white text-sm flex items-center"
                    >
                        {showDetails ? "Hide Details" : "Show Details"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1 transition-transform ${
                                showDetails ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    <div className="flex space-x-2">
                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className={`p-1.5 rounded ${
                                loading
                                    ? "bg-gray-600"
                                    : "bg-gray-600 hover:bg-gray-500"
                            } text-white`}
                            title="Check status"
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => onDelete(endpoint.id)}
                            className="p-1.5 rounded bg-gray-600 hover:bg-red-600 text-white"
                            title="Delete"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {showDetails && (
                <ApiDetails endpoint={endpoint} onUpdate={onUpdate} />
            )}
        </div>
    );
}
