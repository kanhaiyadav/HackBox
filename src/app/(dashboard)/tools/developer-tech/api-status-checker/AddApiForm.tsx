// File: components/AddApiForm.tsx
'use client';

import { useState } from 'react';
import { ApiEndpoint } from '@/types/api';

interface AddApiFormProps {
  onAdd: (endpoint: ApiEndpoint) => void;
}

export default function AddApiForm({ onAdd }: AddApiFormProps) {
    const [formData, setFormData] = useState<Partial<ApiEndpoint>>({
        name: "",
        url: "",
        method: "GET",
        timeout: 5000,
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.name?.trim()) {
            setError("Name is required");
            return;
        }

        if (!formData.url?.trim()) {
            setError("URL is required");
            return;
        }

        try {
            // Basic URL validation
            new URL(formData.url);
        } catch (err) {
            setError("Please enter a valid URL");
            return;
        }

        // Create API endpoint
        const newEndpoint: ApiEndpoint = {
            id: crypto.randomUUID(),
            name: formData.name.trim(),
            url: formData.url.trim(),
            method: formData.method || "GET",
            timeout: formData.timeout || 5000,
            headers: formData.headers || {},
            body: formData.body,
            tags:
                formData.tags
                    ?.split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean) || [],
            notifications: formData.notifications || false,
            history: [],
        };

        onAdd(newEndpoint);

        // Reset form
        setFormData({
            name: "",
            url: "",
            method: "GET",
            timeout: 5000,
        });
        setError("");
        setShowAdvanced(false);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Endpoint</h2>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="mb-4 bg-red-900/50 border border-red-500 text-white px-4 py-2 rounded">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            placeholder="Payment API"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            URL
                        </label>
                        <input
                            type="text"
                            name="url"
                            value={formData.url || ""}
                            onChange={handleChange}
                            placeholder="https://api.example.com/v1/payments"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Method
                        </label>
                        <select
                            name="method"
                            value={formData.method || "GET"}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                        >
                            {showAdvanced ? "Hide" : "Show"} Advanced Options
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 ml-1 transition-transform ${
                                    showAdvanced ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>

                    {showAdvanced && (
                        <div className="space-y-4 pt-2 border-t border-gray-700">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Timeout (ms)
                                </label>
                                <input
                                    type="number"
                                    name="timeout"
                                    value={formData.timeout || 5000}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags || ""}
                                    onChange={handleChange}
                                    placeholder="payment, core, v1"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {formData.method !== "GET" &&
                                formData.method !== "HEAD" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Request Body
                                        </label>
                                        <textarea
                                            name="body"
                                            value={formData.body || ""}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder='{"key": "value"}'
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                )}

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="notifications"
                                    checked={formData.notifications || false}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
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
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add Endpoint
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}