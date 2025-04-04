"use client";

import { ApiStatus } from "@/types/api";

interface StatusBadgeProps {
    status: ApiStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = () => {
        switch (status) {
            case "up":
                return "bg-green-500 text-green-100";
            case "down":
                return "bg-red-500 text-red-100";
            case "degraded":
                return "bg-yellow-500 text-yellow-100";
            default:
                return "bg-gray-500 text-gray-100";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case "up":
                return "Operational";
            case "down":
                return "Down";
            case "degraded":
                return "Degraded";
            default:
                return "Unknown";
        }
    };

    return (
        <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
        >
            {getStatusText()}
        </span>
    );
}
