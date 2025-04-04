"use client";

import { ApiStatus } from "@/types/api";

interface StatusFiltersProps {
    currentFilter: ApiStatus | "all";
    onFilterChange: (filter: ApiStatus | "all") => void;
}

export default function StatusFilters({
    currentFilter,
    onFilterChange,
}: StatusFiltersProps) {
    const filters = [
        { value: "all", label: "All" },
        { value: "up", label: "Operational" },
        { value: "degraded", label: "Degraded" },
        { value: "down", label: "Down" },
    ];

    return (
        <div className="flex space-x-2">
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    onClick={() =>
                        onFilterChange(filter.value as ApiStatus | "all")
                    }
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                        currentFilter === filter.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
