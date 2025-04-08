'use client';

import React, { useState, useEffect } from "react";
import {
    FiCopy,
    FiCalendar,
    FiClock,
    FiRefreshCw,
    FiGlobe,
    FiHelpCircle,
} from "react-icons/fi";

type TimeFormat = "12h" | "24h";
type ConversionDirection = "unix-to-date" | "date-to-unix";

const TimestampConverter = () => {
    const [timestamp, setTimestamp] = useState<string>(
        Math.floor(Date.now() / 1000).toString()
    );
    const [dateTime, setDateTime] = useState<string>("");
    const [timeFormat, setTimeFormat] = useState<TimeFormat>("24h");
    const [timezone, setTimezone] = useState<string>("local");
    const [direction, setDirection] =
        useState<ConversionDirection>("unix-to-date");
    const [includeMilliseconds, setIncludeMilliseconds] =
        useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    const [timezones, setTimezones] = useState<string[]>([]);

    // Initialize with current time and date
    useEffect(() => {
        if (direction === "unix-to-date") {
            convertUnixToDate(timestamp);
        } else {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            setDateTime(
                `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
            );
            convertDateToUnix(
                `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
            );
        }

        // Setup a timer to update current time every second
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        // Populate timezones
        const tzList = [
            "local",
            "UTC",
            "America/New_York",
            "America/Los_Angeles",
            "Europe/London",
            "Europe/Berlin",
            "Asia/Tokyo",
            "Australia/Sydney",
            "Pacific/Auckland",
        ];
        setTimezones(tzList);

        return () => clearInterval(interval);
    }, []);

    const convertUnixToDate = (unixTime: string) => {
        try {
            // Handle milliseconds if necessary
            let timestamp = parseInt(unixTime);
            if (timestamp.toString().length === 10) {
                timestamp = includeMilliseconds ? timestamp * 1000 : timestamp;
            } else if (timestamp.toString().length === 13) {
                timestamp = includeMilliseconds
                    ? timestamp
                    : Math.floor(timestamp / 1000);
            }

            const date = new Date(
                includeMilliseconds ? timestamp : timestamp * 1000
            );

            let dateString = "";
            if (timezone === "local") {
                dateString = date.toISOString().replace("Z", "");
            } else if (timezone === "UTC") {
                dateString = date.toISOString();
            } else {
                try {
                    dateString = date.toLocaleString("en-US", {
                        timeZone: timezone,
                    });
                    // Convert to ISO format
                    const d = new Date(dateString);
                    dateString = d.toISOString().replace("Z", "");
                } catch (e) {
                    console.error(e);
                    dateString = date.toISOString().replace("Z", "");
                }
            }

            setDateTime(dateString.slice(0, 19).replace("T", " "));
        } catch (error) {
            console.error("Error converting timestamp:", error);
            setDateTime("Invalid timestamp");
        }
    };

    const convertDateToUnix = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            const unixTime = Math.floor(date.getTime() / 1000);
            setTimestamp(
                includeMilliseconds
                    ? (unixTime * 1000).toString()
                    : unixTime.toString()
            );
        } catch (error) {
            console.error("Error converting date to timestamp:", error);
            setTimestamp("Invalid date");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (direction === "unix-to-date") {
            setTimestamp(value);
            convertUnixToDate(value);
        } else {
            setDateTime(value);
            convertDateToUnix(value);
        }
    };

    const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDateTime(value);
        convertDateToUnix(value);
    };

    const toggleDirection = () => {
        setDirection((prev) =>
            prev === "unix-to-date" ? "date-to-unix" : "unix-to-date"
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const setCurrentTimestamp = () => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(
            includeMilliseconds ? (now * 1000).toString() : now.toString()
        );
        convertUnixToDate(
            includeMilliseconds ? (now * 1000).toString() : now.toString()
        );
    };

    const formatCurrentTime = () => {
        const now = new Date(currentTime);

        let timeString;
        if (timeFormat === "12h") {
            timeString = now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });
        } else {
            timeString = now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });
        }

        const dateString = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

        return `${dateString} ${timeString}`;
    };

    const getFormattedTimestamp = (unix: string): string => {
        try {
            const timestamp = parseInt(unix);
            if (isNaN(timestamp)) return "Invalid timestamp";

            const date = new Date(
                includeMilliseconds ? timestamp : timestamp * 1000
            );

            // Format based on user preferences
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: timeFormat === "12h",
            };

            if (timezone !== "local" && timezone !== "UTC") {
                try {
                    return date.toLocaleString("en-US", {
                        ...options,
                        timeZone: timezone,
                    });
                } catch (e) {
                    console.error(e);
                    return date.toLocaleString("en-US", options);
                }
            } else if (timezone === "UTC") {
                return date.toUTCString();
            } else {
                return date.toLocaleString("en-US", options);
            }
        } catch (error) {
            console.error("Error formatting timestamp:", error);
            return "Invalid timestamp";
        }
    };

    const getRelativeTime = (unix: string): string => {
        try {
            const timestamp = parseInt(unix);
            if (isNaN(timestamp)) return "Invalid timestamp";

            const date = new Date(
                includeMilliseconds ? timestamp : timestamp * 1000
            );
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffSec = Math.round(diffMs / 1000);

            // In the future
            if (diffSec < 0) {
                const absDiff = Math.abs(diffSec);
                if (absDiff < 60) return `in ${absDiff} seconds`;
                if (absDiff < 3600)
                    return `in ${Math.floor(absDiff / 60)} minutes`;
                if (absDiff < 86400)
                    return `in ${Math.floor(absDiff / 3600)} hours`;
                if (absDiff < 2592000)
                    return `in ${Math.floor(absDiff / 86400)} days`;
                if (absDiff < 31536000)
                    return `in ${Math.floor(absDiff / 2592000)} months`;
                return `in ${Math.floor(absDiff / 31536000)} years`;
            }

            // In the past
            if (diffSec < 60) return `${diffSec} seconds ago`;
            if (diffSec < 3600)
                return `${Math.floor(diffSec / 60)} minutes ago`;
            if (diffSec < 86400)
                return `${Math.floor(diffSec / 3600)} hours ago`;
            if (diffSec < 2592000)
                return `${Math.floor(diffSec / 86400)} days ago`;
            if (diffSec < 31536000)
                return `${Math.floor(diffSec / 2592000)} months ago`;
            return `${Math.floor(diffSec / 31536000)} years ago`;
        } catch (error) {
            console.error("Error calculating relative time:", error);
            return "Invalid timestamp";
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold mb-4 lg:mb-0">
                        Timestamp Converter
                    </h1>
                    <div className="flex items-center text-lg">
                        <FiClock className="mr-2" />
                        <span className="font-mono">{formatCurrentTime()}</span>
                    </div>
                </div>

                {/* Main Converter */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold mb-2 md:mb-0">
                            {direction === "unix-to-date"
                                ? "Unix to Date"
                                : "Date to Unix"}
                        </h2>
                        <button
                            onClick={toggleDirection}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                        >
                            <FiRefreshCw className="mr-2" /> Swap Direction
                        </button>
                    </div>

                    <div className="space-y-4">
                        {direction === "unix-to-date" ? (
                            <>
                                <div className="relative">
                                    <label className="block mb-2 text-gray-300">
                                        Unix Timestamp
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={timestamp}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Unix timestamp"
                                        />
                                        <button
                                            onClick={setCurrentTimestamp}
                                            className="bg-gray-600 hover:bg-gray-500 px-4 rounded-r-md flex items-center"
                                            title="Use current timestamp"
                                        >
                                            <FiRefreshCw />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="block mb-2 text-gray-300">
                                        Human-Readable Date & Time
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={getFormattedTimestamp(
                                                timestamp
                                            )}
                                            readOnly
                                            className="w-full bg-gray-700 border border-gray-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    getFormattedTimestamp(
                                                        timestamp
                                                    )
                                                )
                                            }
                                            className="bg-gray-600 hover:bg-gray-500 px-4 rounded-r-md flex items-center"
                                            title="Copy to clipboard"
                                        >
                                            <FiCopy />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <label className="block mb-2 text-gray-300">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={dateTime}
                                        onChange={handleDateTimeChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block mb-2 text-gray-300">
                                        Unix Timestamp
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={timestamp}
                                            readOnly
                                            className="w-full bg-gray-700 border border-gray-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={() =>
                                                copyToClipboard(timestamp)
                                            }
                                            className="bg-gray-600 hover:bg-gray-500 px-4 rounded-r-md flex items-center"
                                            title="Copy to clipboard"
                                        >
                                            <FiCopy />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Options */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-2 text-gray-300">
                                Time Format
                            </label>
                            <select
                                value={timeFormat}
                                onChange={(e) =>
                                    setTimeFormat(e.target.value as TimeFormat)
                                }
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="12h">12-hour (AM/PM)</option>
                                <option value="24h">24-hour</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-gray-300">
                                Timezone
                            </label>
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {timezones.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeMilliseconds}
                                    onChange={() =>
                                        setIncludeMilliseconds(
                                            !includeMilliseconds
                                        )
                                    }
                                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-gray-300">
                                    Include milliseconds
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Copy notification */}
                    {copied && (
                        <div className="mt-4 bg-green-800 text-green-100 px-4 py-2 rounded-md">
                            Copied to clipboard!
                        </div>
                    )}
                </div>

                {/* Additional Information */}
                {direction === "unix-to-date" && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Additional Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2 flex items-center">
                                    <FiCalendar className="mr-2" /> Relative
                                    Time
                                </h3>
                                <p className="text-gray-300">
                                    {getRelativeTime(timestamp)}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-2 flex items-center">
                                    <FiGlobe className="mr-2" /> UTC Time
                                </h3>
                                <p className="text-gray-300">
                                    {(() => {
                                        try {
                                            const ts = parseInt(timestamp);
                                            if (isNaN(ts))
                                                return "Invalid timestamp";
                                            const date = new Date(
                                                includeMilliseconds
                                                    ? ts
                                                    : ts * 1000
                                            );
                                            return date.toUTCString();
                                        } catch (error) {
                                            console.error(
                                                "Error formatting UTC time:",
                                                error
                                            );
                                            return "Invalid timestamp";
                                        }
                                    })()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Common Timestamp Reference */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Common Timestamps
                        </h2>
                        <button
                            className="ml-2 text-gray-400 hover:text-white"
                            title="Explanation"
                        >
                            <FiHelpCircle />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 uppercase bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">
                                        Unix Timestamp
                                    </th>
                                    <th className="px-4 py-2">
                                        Human-Readable
                                    </th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: "Unix Epoch", value: 0 },
                                    { name: "Y2K", value: 946684800 },
                                    {
                                        name: "Current Time",
                                        value: Math.floor(Date.now() / 1000),
                                    },
                                ].map((item) => (
                                    <tr
                                        key={item.name}
                                        className="border-b border-gray-700"
                                    >
                                        <td className="px-4 py-3">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {item.value}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getFormattedTimestamp(
                                                item.value.toString()
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    setTimestamp(
                                                        item.value.toString()
                                                    );
                                                    convertUnixToDate(
                                                        item.value.toString()
                                                    );
                                                }}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                Use
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimestampConverter;