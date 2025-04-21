'use client';

import React, { useState } from "react";
import { IPDetails } from "@/types/micellaneous";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const IpForm = ({ setDetails }: {
    setDetails: React.Dispatch<React.SetStateAction<IPDetails | null>>;
}) => {
    const [ipAddress, setIpAddress] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>([]);

    const validateIP = (ip: string): boolean => {
        // IPv4 validation
        const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        if (ipv4Pattern.test(ip)) {
            return ip.split(".").every((octet) => parseInt(octet) <= 255);
        }

        // IPv6 validation (simplified)
        const ipv6Pattern =
            /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
        return ipv6Pattern.test(ip);
    };

    const lookupIP = async (ip: string) => {
        console.log("ip");
        if (!ip.trim()) {
            setError("Please enter an IP address");
            return;
        }

        if (!validateIP(ip)) {
            setError("Invalid IP address format");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://ipwho.is/${ip}`, {
                cache: "force-cache",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            setDetails(data);

            // Add to history if not already present
            if (!history.includes(ip)) {
                setHistory((prev) => [ip, ...prev].slice(0, 10));
            }
        } catch (err) {
            setError(
                "Failed to fetch IP details. Please try again or switch API source."
            );
            console.error("Error fetching IP details:", err);
        } finally {
            setLoading(false);
        }
    };

    const lookupMyIP = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                "https://api.ipify.org?format=json"
            );
            setIpAddress(response.data.ip);
            // Lookup the obtained IP address
            await lookupIP(response.data.ip);

        } catch (err) {
            setError("Failed to fetch your IP address. Please try again.");
            console.error("Error fetching IP:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setHistory([]);
        setShowHistory(false);
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <Input
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="Enter IP address (e.g., 8.8.8.8 or 2001:4860:4860::8888)"
                        className="flex-grow px-4 py-4"
                    />
                    <Button
                        onClick={() => lookupIP(ipAddress)}
                        disabled={loading}
                        className="font-medium transition duration-200 h-[50px]"
                    >
                        {loading ? "Loading..." : "Lookup IP"}
                    </Button>
                    <Button
                        onClick={lookupMyIP}
                        disabled={loading}
                        className="font-medium transition duration-200 h-[50px]"
                    >
                        My IP
                    </Button>
                </div>

                {error && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                        role="alert"
                    >
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="text-sm text-primary hover:text-indigo-800"
                    >
                        {showHistory
                            ? "Hide Search History"
                            : "Show Search History"}
                    </button>

                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Clear History
                        </button>
                    )}
                </div>

                {showHistory && history.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="text-md font-semibold mb-2">
                            Recent Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {history.map((ip, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIpAddress(ip);
                                        setShowHistory(false);
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
                                >
                                    {ip}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IpForm;
