// File: components/ApiDetails.tsx
"use client";

import { useState } from "react";
import { ApiEndpoint } from "@/types/api";
import StatusHistory from "./StatusHistory";

interface ApiDetailsProps {
    endpoint: ApiEndpoint;
    onUpdate: (endpoint: ApiEndpoint) => void;
}

export default function ApiDetails({ endpoint, onUpdate }: ApiDetailsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEndpoint, setEditedEndpoint] = useState<ApiEndpoint>({
        ...endpoint,
    });
    const [activeTab, setActiveTab] = useState<"history" | "settings">(
        "history"
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(editedEndpoint);
        setIsEditing(false);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setEditedEndpoint({
            ...editedEndpoint,
            [name]: value,
        });
    };

    return (
        <div className="border-t border-gray-600 bg-gray-800 p-4">
            <div className="flex border-b border-gray-700 mb-4">
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "history"
                            ? "text-blue-400 border-b-2 border-blue-400"
                            : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("history")}
                >
                    History
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${
                        activeTab === "settings"
                            ? "text-blue-400 border-b-2 border-blue-400"
                            : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("settings")}
                >
                    Settings
                </button>
            </div>

            {activeTab === "history" && (
                <StatusHistory history={endpoint.history || []} />
            )}

            {activeTab === "settings" && (
                <div>
                    {!isEditing ? (
                        <div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="text-gray-400">Method:</div>
                                <div>{endpoint.method}</div>

                                <div className="text-gray-400">Timeout:</div>
                                <div>{endpoint.timeout || "5000"}ms</div>

                                <div className="text-gray-400">Headers:</div>
                                <div className="truncate">
                                    {endpoint.headers &&
                                    Object.keys(endpoint.headers).length > 0
                                        ? Object.keys(endpoint.headers).join(
                                              ", "
                                          )
                                        : "None"}
                                </div>

                                {endpoint.body && (
                                    <>
                                        <div className="text-gray-400">
                                            Body:
                                        </div>
                                        <div className="truncate">
                                            {endpoint.body.substring(0, 30)}
                                            {endpoint.body.length > 30
                                                ? "..."
                                                : ""}
                                        </div>
                                    </>
                                )}

                                <div className="text-gray-400">
                                    Notifications:
                                </div>
                                <div>
                                    {endpoint.notifications
                                        ? "Enabled"
                                        : "Disabled"}
                                </div>

                                {endpoint.tags && endpoint.tags.length > 0 && (
                                    <>
                                        <div className="text-gray-400">
                                            Tags:
                                        </div>
                                        <div>{endpoint.tags.join(", ")}</div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm rounded text-gray-200"
                            >
                                Edit Settings
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Method
                                    </label>
                                    <select
                                        name="method"
                                        value={editedEndpoint.method}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                        <option value="HEAD">HEAD</option>
                                        <option value="OPTIONS">OPTIONS</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Timeout (ms)
                                    </label>
                                    <input
                                        type="number"
                                        name="timeout"
                                        value={editedEndpoint.timeout || 5000}
                                        onChange={handleChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {editedEndpoint.method !== "GET" &&
                                    editedEndpoint.method !== "HEAD" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Request Body
                                            </label>
                                            <textarea
                                                name="body"
                                                value={
                                                    editedEndpoint.body || ""
                                                }
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    )}

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="notifications"
                                        checked={
                                            editedEndpoint.notifications ||
                                            false
                                        }
                                        onChange={(e) =>
                                            setEditedEndpoint({
                                                ...editedEndpoint,
                                                notifications: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="notifications"
                                        className="ml-2 block text-sm text-gray-300"
                                    >
                                        Enable notifications
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm rounded text-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-sm rounded text-white"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
