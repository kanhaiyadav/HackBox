'use client';

import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const StatisticsCalculator = () => {
    const [inputData, setInputData] = useState<string>("");
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [chartData, setChartData] = useState<any[]>([]);

    const calculateStatistics = () => {
        try {
            // Parse input data
            const data = inputData
                .split(/[,\s]+/)
                .map((num) => parseFloat(num.trim()))
                .filter((num) => !isNaN(num));

            if (data.length === 0) {
                setError(
                    "Please enter valid numerical data separated by commas or spaces"
                );
                setResults(null);
                setChartData([]);
                return;
            }

            // Sort data for calculations
            const sortedData = [...data].sort((a, b) => a - b);
            const n = data.length;

            // Calculate mean
            const sum = data.reduce((acc, val) => acc + val, 0);
            const mean = sum / n;

            // Calculate median
            let median;
            if (n % 2 === 0) {
                median = (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
            } else {
                median = sortedData[Math.floor(n / 2)];
            }

            // Calculate mode
            const frequency: Record<number, number> = {};
            data.forEach((value) => {
                frequency[value] = (frequency[value] || 0) + 1;
            });

            let maxFrequency = 0;
            let modes: number[] = [];

            Object.entries(frequency).forEach(([value, count]) => {
                const numValue = parseFloat(value);
                if (count > maxFrequency) {
                    maxFrequency = count;
                    modes = [numValue];
                } else if (count === maxFrequency) {
                    modes.push(numValue);
                }
            });

            const mode =
                modes.length === Object.keys(frequency).length
                    ? "No mode"
                    : modes.join(", ");

            // Calculate variance and standard deviation
            const squaredDiffs = data.map((value) => Math.pow(value - mean, 2));
            const variance =
                squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
            const standardDeviation = Math.sqrt(variance);

            // Calculate range
            const range = sortedData[n - 1] - sortedData[0];

            // Calculate quartiles
            const q1 = sortedData[Math.floor(n * 0.25)];
            const q3 = sortedData[Math.floor(n * 0.75)];
            const iqr = q3 - q1;

            // Calculate skewness
            const m3 =
                data.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n;
            const skewness = m3 / Math.pow(standardDeviation, 3);

            // Calculate kurtosis
            const m4 =
                data.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / n;
            const kurtosis = m4 / Math.pow(variance, 2) - 3;

            // Calculate min, max, sum
            const min = sortedData[0];
            const max = sortedData[n - 1];

            // Prepare data for histogram
            const histogramData = [];
            const binWidth = range / 10;

            for (let i = 0; i < 10; i++) {
                const binStart = min + i * binWidth;
                const binEnd = binStart + binWidth;
                const count = data.filter(
                    (val) => val >= binStart && val < binEnd
                ).length;

                histogramData.push({
                    bin: `${binStart.toFixed(2)}-${binEnd.toFixed(2)}`,
                    count: count,
                });
            }

            setChartData(histogramData);

            setResults({
                count: n,
                mean: mean.toFixed(4),
                median: median.toFixed(4),
                mode: mode,
                standardDeviation: standardDeviation.toFixed(4),
                variance: variance.toFixed(4),
                range: range.toFixed(4),
                min: min.toFixed(4),
                max: max.toFixed(4),
                sum: sum.toFixed(4),
                q1: q1.toFixed(4),
                q3: q3.toFixed(4),
                iqr: iqr.toFixed(4),
                skewness: skewness.toFixed(4),
                kurtosis: kurtosis.toFixed(4),
            });

            setError("");
        } catch (err) {
            setError("An error occurred during calculation.");
            setResults(null);
            setChartData([]);
        }
    };

    const handleClear = () => {
        setInputData("");
        setResults(null);
        setError("");
        setChartData([]);
    };

    const handleSampleData = () => {
        setInputData(
            "23, 45, 67, 12, 34, 56, 78, 90, 23, 45, 67, 12, 34, 56, 78"
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Statistics Calculator
            </h1>

            <div className="mb-6">
                <label
                    htmlFor="data-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Enter numerical data (separated by commas or spaces):
                </label>
                <div className="flex gap-2">
                    <textarea
                        id="data-input"
                        className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={3}
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder="e.g., 1.5, 2, 3.5, 4, 5.5, 6"
                    />
                </div>
                <div className="flex justify-between mt-2">
                    <button
                        onClick={handleSampleData}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Load Sample Data
                    </button>
                    <div>
                        <button
                            onClick={handleClear}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 mr-2"
                        >
                            Clear
                        </button>
                        <button
                            onClick={calculateStatistics}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {results && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Basic Statistics
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Count
                                </div>
                                <div className="font-medium">
                                    {results.count}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Sum</div>
                                <div className="font-medium">{results.sum}</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Mean
                                </div>
                                <div className="font-medium">
                                    {results.mean}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Median
                                </div>
                                <div className="font-medium">
                                    {results.median}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Mode
                                </div>
                                <div className="font-medium">
                                    {results.mode}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Range
                                </div>
                                <div className="font-medium">
                                    {results.range}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Min</div>
                                <div className="font-medium">{results.min}</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">Max</div>
                                <div className="font-medium">{results.max}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Advanced Statistics
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Standard Deviation
                                </div>
                                <div className="font-medium">
                                    {results.standardDeviation}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Variance
                                </div>
                                <div className="font-medium">
                                    {results.variance}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    First Quartile (Q1)
                                </div>
                                <div className="font-medium">{results.q1}</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Third Quartile (Q3)
                                </div>
                                <div className="font-medium">{results.q3}</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Interquartile Range
                                </div>
                                <div className="font-medium">{results.iqr}</div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Skewness
                                </div>
                                <div className="font-medium">
                                    {results.skewness}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm col-span-2">
                                <div className="text-sm text-gray-500">
                                    Kurtosis
                                </div>
                                <div className="font-medium">
                                    {results.kurtosis}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {chartData.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        Data Distribution
                    </h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="bin" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366F1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsCalculator;