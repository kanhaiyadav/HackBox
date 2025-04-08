"use client";

import { ApiEndpoint, ApiStatus } from "@/types/api";

interface StatsProps {
    endpoints: ApiEndpoint[];
}

export default function Stats({ endpoints }: StatsProps) {
    // Calculate status stats
    const getStatusCount = (status: ApiStatus) => {
        return endpoints.filter((endpoint) => endpoint.status === status)
            .length;
    };

    const upCount = getStatusCount("up");
    const degradedCount = getStatusCount("degraded");
    const downCount = getStatusCount("down");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unknownCount = endpoints.length - upCount - degradedCount - downCount;

    // Calculate uptime percentage
    const calculateUptimePercentage = () => {
        if (endpoints.length === 0) return 0;

        // Count total historical checks
        let totalChecks = 0;
        let upChecks = 0;

        endpoints.forEach((endpoint) => {
            if (endpoint.history && endpoint.history.length > 0) {
                totalChecks += endpoint.history.length;
                upChecks += endpoint.history.filter(
                    (entry) => entry.status === "up"
                ).length;
            }
        });

        return totalChecks > 0 ? Math.round((upChecks / totalChecks) * 100) : 0;
    };

    // Calculate average response time
    const calculateAverageResponseTime = () => {
        let totalTime = 0;
        let count = 0;

        endpoints.forEach((endpoint) => {
            if (endpoint.history) {
                const upEntries = endpoint.history.filter(
                    (entry) => entry.status === "up"
                );
                upEntries.forEach((entry) => {
                    totalTime += entry.responseTime;
                });
                count += upEntries.length;
            }
        });

        return count > 0 ? Math.round(totalTime / count) : 0;
    };

    const uptimePercentage = calculateUptimePercentage();
    const avgResponseTime = calculateAverageResponseTime();

    // Format uptime color
    const getUptimeColor = () => {
        if (uptimePercentage >= 99) return "text-green-400";
        if (uptimePercentage >= 95) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Total Endpoints</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {endpoints.length}
                        </h3>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="mt-4 flex space-x-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                        <span className="text-sm text-gray-300">
                            {upCount} Up
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                        <span className="text-sm text-gray-300">
                            {downCount} Down
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Uptime</p>
                        <h3
                            className={`text-2xl font-bold mt-1 ${getUptimeColor()}`}
                        >
                            {uptimePercentage}%
                        </h3>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${
                                uptimePercentage >= 99
                                    ? "bg-green-500"
                                    : uptimePercentage >= 95
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${uptimePercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">
                            Avg Response Time
                        </p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {avgResponseTime} ms
                        </h3>
                    </div>
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xs text-gray-400">
                        Based on{" "}
                        {endpoints.reduce(
                            (acc, endpoint) =>
                                acc + (endpoint.history?.length || 0),
                            0
                        )}{" "}
                        responses
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                            {downCount > 0 ? "System Issues" : "All Systems Go"}
                        </h3>
                    </div>
                    <div
                        className={`p-2 rounded-lg ${
                            downCount > 0 ? "bg-red-500/20" : "bg-green-500/20"
                        }`}
                    >
                        {downCount > 0 ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    {downCount > 0 && (
                        <p className="text-sm text-red-400">
                            {downCount} endpoint{downCount > 1 ? "s" : ""} down
                        </p>
                    )}
                    {degradedCount > 0 && (
                        <p className="text-sm text-yellow-400">
                            {degradedCount} degraded service
                            {degradedCount > 1 ? "s" : ""}
                        </p>
                    )}
                    {downCount === 0 && degradedCount === 0 && (
                        <p className="text-sm text-green-400">
                            All systems operational
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
