'use client';
import { useState } from "react";

interface TableFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    temperature: number;
    setTemperature: (temp: number) => void;
}

const TableFilters = ({
    searchTerm,
    setSearchTerm,
    temperature,
    setTemperature,
}: TableFiltersProps) => {
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        // You would implement the actual filtering logic here
    };

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search elements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <span className="whitespace-nowrap">
                        Temperature: {temperature} K
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="6000"
                        value={temperature}
                        onChange={(e) =>
                            setTemperature(parseInt(e.target.value))
                        }
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-4">
                <button
                    onClick={() => handleFilterChange("all")}
                    className={`px-4 py-2 rounded-md ${
                        activeFilter === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    All Elements
                </button>
                <button
                    onClick={() => handleFilterChange("metals")}
                    className={`px-4 py-2 rounded-md ${
                        activeFilter === "metals"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Metals
                </button>
                <button
                    onClick={() => handleFilterChange("nonmetals")}
                    className={`px-4 py-2 rounded-md ${
                        activeFilter === "nonmetals"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Nonmetals
                </button>
                <button
                    onClick={() => handleFilterChange("metalloids")}
                    className={`px-4 py-2 rounded-md ${
                        activeFilter === "metalloids"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Metalloids
                </button>
                <button
                    onClick={() => handleFilterChange("radioactive")}
                    className={`px-4 py-2 rounded-md ${
                        activeFilter === "radioactive"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Radioactive
                </button>
                <button
                    onClick={() => handleFilterChange("synthetic")}
                    className={`px-4 py-2 rounded-md ${
                        activeFilter === "synthetic"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                    }`}
                >
                    Synthetic
                </button>
            </div>
        </div>
    );
};

export default TableFilters;
