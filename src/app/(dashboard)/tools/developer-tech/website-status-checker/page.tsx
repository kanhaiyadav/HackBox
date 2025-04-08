'use client';

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle,
    // FiClock,
    FiGlobe,
    // FiInfo,
    FiExternalLink,
} from "react-icons/fi";

interface WebsiteStatus {
    url: string;
    isUp: boolean;
    statusCode?: number;
    responseTime?: number;
    lastChecked?: string;
    sslValid?: boolean;
    sslExpires?: string;
    serverInfo?: string;
    ipAddress?: string;
    dnsRecords?: DnsRecord[];
    redirects?: Redirect[];
    ports?: PortStatus[];
}

interface DnsRecord {
    type: string;
    value: string;
    ttl?: number;
}

interface Redirect {
    url: string;
    statusCode: number;
}

interface PortStatus {
    port: number;
    status: "open" | "closed" | "filtered";
    service?: string;
}

const StatusChecker = () => {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<WebsiteStatus[]>([]);
    const [currentStatus, setCurrentStatus] = useState<WebsiteStatus | null>(
        null
    );
    const [error, setError] = useState("");
    const [checkOptions, setCheckOptions] = useState({
        checkSSL: true,
        checkDNS: false,
        checkPorts: false,
        checkRedirects: true,
        checkServerInfo: true,
    });
    const [selectedPorts, setSelectedPorts] = useState<number[]>([
        80, 443, 22, 21, 8080,
    ]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(60); // in seconds

    const checkWebsiteStatus = useCallback(async () => {
        if (!url) {
            setError("Please enter a URL");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Normalize URL
            let normalizedUrl = url.trim();
            if (
                !normalizedUrl.startsWith("http://") &&
                !normalizedUrl.startsWith("https://")
            ) {
                normalizedUrl = `https://${normalizedUrl}`;
            }

            const startTime = Date.now();

            // Basic status check
            const response = await axios.get(
                `/api/check-status?url=${encodeURIComponent(normalizedUrl)}`,
                {
                    params: {
                        checkSSL: checkOptions.checkSSL,
                        checkDNS: checkOptions.checkDNS,
                        checkRedirects: checkOptions.checkRedirects,
                    },
                }
            );

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const statusData: WebsiteStatus = {
                url: normalizedUrl,
                isUp: response.data.isUp,
                statusCode: response.data.statusCode,
                responseTime,
                lastChecked: new Date().toISOString(),
                sslValid: response.data.sslValid,
                sslExpires: response.data.sslExpires,
                serverInfo: response.data.serverInfo,
                ipAddress: response.data.ipAddress,
                dnsRecords: checkOptions.checkDNS
                    ? response.data.dnsRecords
                    : undefined,
                redirects: checkOptions.checkRedirects
                    ? response.data.redirects
                    : undefined,
            };

            // Port check if enabled
            if (checkOptions.checkPorts && selectedPorts.length > 0) {
                const portsResponse = await axios.get(
                    `/api/check-ports?url=${encodeURIComponent(normalizedUrl)}`,
                    {
                        params: { ports: selectedPorts.join(",") },
                    }
                );
                statusData.ports = portsResponse.data.ports;
            }

            setCurrentStatus(statusData);
            setHistory((prev) => [statusData, ...prev.slice(0, 9)]); // Keep last 10 items
        } catch (err) {
            console.error("Error checking website status:", err);
            setError("Failed to check website status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [url, checkOptions, selectedPorts]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (autoRefresh && currentStatus) {
            intervalId = setInterval(() => {
                checkWebsiteStatus();
            }, refreshInterval * 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [autoRefresh, refreshInterval, currentStatus, checkWebsiteStatus]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            checkWebsiteStatus();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (isUp: boolean) => {
        return isUp ? "text-green-500" : "text-red-500";
    };

    const getStatusIcon = (isUp: boolean) => {
        return isUp ? (
            <FiCheckCircle className="inline" />
        ) : (
            <FiAlertCircle className="inline" />
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Website Status Checker
                </h1>

                <div className="flex space-x-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter website URL (e.g., example.com)"
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                            />
                            <button
                                onClick={checkWebsiteStatus}
                                disabled={isLoading}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md disabled:opacity-50"
                            >
                                {isLoading ? "Checking..." : "Check"}
                            </button>
                        </div>
                        {error && <p className="text-red-400 mt-2">{error}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-750 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Check Options
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={checkOptions.checkSSL}
                                    onChange={() =>
                                        setCheckOptions({
                                            ...checkOptions,
                                            checkSSL: !checkOptions.checkSSL,
                                        })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-300">
                                    Check SSL Certificate
                                </span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={checkOptions.checkDNS}
                                    onChange={() =>
                                        setCheckOptions({
                                            ...checkOptions,
                                            checkDNS: !checkOptions.checkDNS,
                                        })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-300">
                                    Check DNS Records
                                </span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={checkOptions.checkRedirects}
                                    onChange={() =>
                                        setCheckOptions({
                                            ...checkOptions,
                                            checkRedirects:
                                                !checkOptions.checkRedirects,
                                        })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-300">
                                    Check Redirects
                                </span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={checkOptions.checkServerInfo}
                                    onChange={() =>
                                        setCheckOptions({
                                            ...checkOptions,
                                            checkServerInfo:
                                                !checkOptions.checkServerInfo,
                                        })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-300">
                                    Check Server Info
                                </span>
                            </label>
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={checkOptions.checkPorts}
                                    onChange={() =>
                                        setCheckOptions({
                                            ...checkOptions,
                                            checkPorts:
                                                !checkOptions.checkPorts,
                                        })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-300">
                                    Check Ports
                                </span>
                            </label>
                        </div>

                        {checkOptions.checkPorts && (
                            <div className="mt-4">
                                <label className="block text-gray-300 mb-2">
                                    Ports to check (comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={selectedPorts.join(",")}
                                    onChange={(e) =>
                                        setSelectedPorts(
                                            e.target.value
                                                .split(",")
                                                .map((p) => parseInt(p.trim()))
                                                .filter((p) => !isNaN(p))
                                        )
                                    }
                                    className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                                    placeholder="80, 443, 22, 8080"
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-750 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Auto Refresh
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={() =>
                                        setAutoRefresh(!autoRefresh)
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                />
                                <span className="text-gray-300">
                                    Enable Auto Refresh
                                </span>
                            </label>
                            {autoRefresh && (
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Refresh Interval (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        min="10"
                                        value={refreshInterval}
                                        onChange={(e) =>
                                            setRefreshInterval(
                                                parseInt(e.target.value) || 60
                                            )
                                        }
                                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {currentStatus && (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <FiGlobe className="mr-2" />
                            {currentStatus.url}
                            <a
                                href={currentStatus.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-400 hover:text-blue-300"
                            >
                                <FiExternalLink className="inline" />
                            </a>
                        </h2>
                        <div className="flex items-center">
                            <span
                                className={`${getStatusColor(
                                    currentStatus.isUp
                                )} font-semibold mr-2`}
                            >
                                {currentStatus.isUp ? "Online" : "Offline"}
                            </span>
                            {getStatusIcon(currentStatus.isUp)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-750 rounded-lg p-4">
                            <h3 className="text-md font-semibold text-gray-400 mb-2">
                                Basic Info
                            </h3>
                            <div className="space-y-2">
                                <p className="text-white">
                                    <span className="text-gray-400">
                                        Status:{" "}
                                    </span>
                                    <span
                                        className={getStatusColor(
                                            currentStatus.isUp
                                        )}
                                    >
                                        {currentStatus.statusCode}{" "}
                                        {currentStatus.isUp ? "OK" : "Error"}
                                    </span>
                                </p>
                                <p className="text-white">
                                    <span className="text-gray-400">
                                        Response Time:{" "}
                                    </span>
                                    {currentStatus.responseTime} ms
                                </p>
                                <p className="text-white">
                                    <span className="text-gray-400">
                                        Last Checked:{" "}
                                    </span>
                                    {formatDate(
                                        currentStatus.lastChecked || ""
                                    )}
                                </p>
                                {currentStatus.ipAddress && (
                                    <p className="text-white">
                                        <span className="text-gray-400">
                                            IP Address:{" "}
                                        </span>
                                        {currentStatus.ipAddress}
                                    </p>
                                )}
                            </div>
                        </div>

                        {currentStatus.sslValid !== undefined && (
                            <div className="bg-gray-750 rounded-lg p-4">
                                <h3 className="text-md font-semibold text-gray-400 mb-2">
                                    SSL Certificate
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-white">
                                        <span className="text-gray-400">
                                            Valid:{" "}
                                        </span>
                                        {currentStatus.sslValid ? (
                                            <span className="text-green-500">
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="text-red-500">
                                                No
                                            </span>
                                        )}
                                    </p>
                                    {currentStatus.sslExpires && (
                                        <p className="text-white">
                                            <span className="text-gray-400">
                                                Expires:{" "}
                                            </span>
                                            {formatDate(
                                                currentStatus.sslExpires
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStatus.serverInfo && (
                            <div className="bg-gray-750 rounded-lg p-4">
                                <h3 className="text-md font-semibold text-gray-400 mb-2">
                                    Server Info
                                </h3>
                                <p className="text-white break-all">
                                    {currentStatus.serverInfo}
                                </p>
                            </div>
                        )}

                        {currentStatus.redirects &&
                            currentStatus.redirects.length > 0 && (
                                <div className="bg-gray-750 rounded-lg p-4">
                                    <h3 className="text-md font-semibold text-gray-400 mb-2">
                                        Redirects (
                                        {currentStatus.redirects.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {currentStatus.redirects.map(
                                            (redirect, index) => (
                                                <div
                                                    key={index}
                                                    className="text-white"
                                                >
                                                    <span className="text-gray-400">
                                                        {index + 1}.{" "}
                                                    </span>
                                                    {redirect.url}{" "}
                                                    <span className="text-yellow-400">
                                                        ({redirect.statusCode})
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {currentStatus.ports &&
                            currentStatus.ports.length > 0 && (
                                <div className="bg-gray-750 rounded-lg p-4">
                                    <h3 className="text-md font-semibold text-gray-400 mb-2">
                                        Port Status
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {currentStatus.ports.map(
                                            (port, index) => (
                                                <div
                                                    key={index}
                                                    className="text-white"
                                                >
                                                    <span className="text-gray-400">
                                                        Port {port.port}:{" "}
                                                    </span>
                                                    {port.status === "open" ? (
                                                        <span className="text-green-500">
                                                            Open
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-500">
                                                            Closed
                                                        </span>
                                                    )}
                                                    {port.service && (
                                                        <span className="text-gray-400 ml-2">
                                                            ({port.service})
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {currentStatus.dnsRecords &&
                            currentStatus.dnsRecords.length > 0 && (
                                <div className="bg-gray-750 rounded-lg p-4">
                                    <h3 className="text-md font-semibold text-gray-400 mb-2">
                                        DNS Records
                                    </h3>
                                    <div className="space-y-2">
                                        {currentStatus.dnsRecords.map(
                                            (record, index) => (
                                                <div
                                                    key={index}
                                                    className="text-white"
                                                >
                                                    <span className="text-gray-400">
                                                        {record.type}:{" "}
                                                    </span>
                                                    {record.value}
                                                    {record.ttl && (
                                                        <span className="text-gray-400 ml-2">
                                                            (TTL: {record.ttl})
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">
                        Check History
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-750 rounded-lg overflow-hidden">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        URL
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Response Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Last Checked
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {history.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white max-w-xs truncate">
                                            {item.url}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <span
                                                className={`${getStatusColor(
                                                    item.isUp
                                                )} font-semibold`}
                                            >
                                                {item.statusCode}{" "}
                                                {item.isUp ? "OK" : "Error"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                            {item.responseTime} ms
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                            {formatDate(item.lastChecked || "")}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                                            <button
                                                onClick={() => {
                                                    setUrl(item.url);
                                                    setTimeout(
                                                        () =>
                                                            checkWebsiteStatus(),
                                                        100
                                                    );
                                                }}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <FiRefreshCw className="inline mr-1" />{" "}
                                                Recheck
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusChecker;