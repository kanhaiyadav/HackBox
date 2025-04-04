// File: components/StatusHistory.tsx
"use client";

import { StatusHistoryEntry } from "@/types/api";

interface StatusHistoryProps {
    history: StatusHistoryEntry[];
}

export default function StatusHistory({ history }: StatusHistoryProps) {
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString() + ", " + date.toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "up":
                return "bg-green-500";
            case "down":
                return "bg-red-500";
            case "degraded":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div>
            {history.length === 0 ? (
                <p className="text-gray-400 text-center py-4">
                    No history available yet.
                </p>
            ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {history.map((entry, index) => (
                        <div key={index} className="flex items-center text-sm">
                            <div
                                className={`w-3 h-3 rounded-full ${getStatusColor(
                                    entry.status
                                )} mr-3`}
                            ></div>
                            <div className="flex justify-between w-full">
                                <span className="text-gray-300">
                                    {entry.status === "up" ? (
                                        <span className="text-green-400">
                                            Operational
                                        </span>
                                    ) : entry.status === "degraded" ? (
                                        <span className="text-yellow-400">
                                            Degraded
                                        </span>
                                    ) : (
                                        <span className="text-red-400">
                                            Down
                                        </span>
                                    )}
                                    {entry.responseTime > 0 &&
                                        ` (${entry.responseTime}ms)`}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {formatDate(entry.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
