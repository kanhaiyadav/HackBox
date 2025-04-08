// File: components/StatusDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import ApiCard from "./ApiCard";
import AddApiForm from "./AddApiForm";
import StatusFilters from "./StatusFilters";
import { ApiEndpoint, ApiStatus } from "@/types/api";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Stats from "./Stats";
import Navbar from "./Navbar";

export default function StatusDashboard() {
    const [endpoints, setEndpoints] = useLocalStorage<ApiEndpoint[]>(
        "api-endpoints",
        []
    );
    const [filteredEndpoints, setFilteredEndpoints] = useState<ApiEndpoint[]>(
        []
    );
    const [filterStatus, setFilterStatus] = useState<ApiStatus | "all">("all");
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Add a new API endpoint
    const addEndpoint = (endpoint: ApiEndpoint) => {
        setEndpoints([...endpoints, endpoint]);
    };

    // Remove an API endpoint
    const removeEndpoint = (id: string) => {
        setEndpoints(endpoints.filter((endpoint) => endpoint.id !== id));
    };

    // Update an API endpoint
    const updateEndpoint = (updatedEndpoint: ApiEndpoint) => {
        setEndpoints(
            endpoints.map((endpoint) =>
                endpoint.id === updatedEndpoint.id ? updatedEndpoint : endpoint
            )
        );
    };

    // Check all APIs status
    const checkAllStatus = async () => {
        setLoading(true);
        const updatedEndpoints = await Promise.all(
            endpoints.map(async (endpoint) => {
                const status = await checkApiStatus(endpoint.url);
                const responseTime =
                    status === "up" ? Math.floor(Math.random() * 500) + 50 : 0;
                return {
                    ...endpoint,
                    status,
                    lastChecked: new Date().toISOString(),
                    responseTime,
                    history: [
                        {
                            timestamp: new Date().toISOString(),
                            status,
                            responseTime,
                        },
                        ...(endpoint.history || []).slice(0, 99), // Keep last 100 entries
                    ],
                };
            })
        );
        setEndpoints(updatedEndpoints);
        setLoading(false);
    };

    // Simulate API status check (in a real app, this would make actual HTTP requests)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const checkApiStatus = async (url: string): Promise<ApiStatus> => {
        // Simulate network request with random success/failure
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate 95% success rate
        return Math.random() > 0.05 ? "up" : "down";
    };

    // Filter endpoints based on status and search query
    useEffect(() => {
        let filtered = [...endpoints];

        // Filter by status
        if (filterStatus !== "all") {
            filtered = filtered.filter(
                (endpoint) => endpoint.status === filterStatus
            );
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (endpoint) =>
                    endpoint.name.toLowerCase().includes(query) ||
                    endpoint.url.toLowerCase().includes(query)
            );
        }

        setFilteredEndpoints(filtered);
    }, [endpoints, filterStatus, searchQuery]);

    // Initial status check
    useEffect(() => {
        if (endpoints.length > 0) {
            checkAllStatus();
        }
        // Set up interval for regular checking (every 5 minutes)
        const interval = setInterval(() => {
            if (endpoints.length > 0) {
                checkAllStatus();
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            API Status Dashboard
                        </h1>
                        <p className="text-gray-400">
                            Monitor your API endpoints in real-time
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={checkAllStatus}
                            disabled={loading || endpoints.length === 0}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                                loading
                                    ? "bg-gray-700 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
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
                                    <span>Checking...</span>
                                </>
                            ) : (
                                <>
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
                                    <span>Check All</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <Stats endpoints={endpoints} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                                <div className="relative w-full md:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search endpoints..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full bg-gray-700 text-gray-100 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                <StatusFilters
                                    currentFilter={filterStatus}
                                    onFilterChange={setFilterStatus}
                                />
                            </div>

                            {filteredEndpoints.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredEndpoints.map((endpoint) => (
                                        <ApiCard
                                            key={endpoint.id}
                                            endpoint={endpoint}
                                            onDelete={removeEndpoint}
                                            onUpdate={updateEndpoint}
                                            onCheck={async () => {
                                                const status =
                                                    await checkApiStatus(
                                                        endpoint.url
                                                    );
                                                const responseTime =
                                                    status === "up"
                                                        ? Math.floor(
                                                              Math.random() *
                                                                  500
                                                          ) + 50
                                                        : 0;
                                                const updatedEndpoint = {
                                                    ...endpoint,
                                                    status,
                                                    lastChecked:
                                                        new Date().toISOString(),
                                                    responseTime,
                                                    history: [
                                                        {
                                                            timestamp:
                                                                new Date().toISOString(),
                                                            status,
                                                            responseTime,
                                                        },
                                                        ...(
                                                            endpoint.history ||
                                                            []
                                                        ).slice(0, 99),
                                                    ],
                                                };
                                                updateEndpoint(updatedEndpoint);
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    {endpoints.length === 0 ? (
                                        <p>
                                            No API endpoints added yet. Add your
                                            first endpoint to start monitoring.
                                        </p>
                                    ) : (
                                        <p>
                                            No endpoints match your current
                                            filters. Try changing your search or
                                            filter settings.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <AddApiForm onAdd={addEndpoint} />
                    </div>
                </div>
            </div>
        </div>
    );
}
