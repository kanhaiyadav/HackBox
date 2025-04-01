'use client';
import React, { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ComposedChart,
    RadialBarChart,
    RadialBar,
} from "recharts";

type ChartData = {
    name: string;
    [key: string]: string | number;
}[];

type ChartGeneratorProps = {
    initialData?: ChartData;
};

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
];

const ChartGenerator: React.FC<ChartGeneratorProps> = ({
    initialData = [],
}) => {
    const [chartType, setChartType] = useState<string>("bar");
    const [data, setData] = useState<ChartData>(initialData);
    const [inputData, setInputData] = useState<string>("");
    const [title, setTitle] = useState<string>("My Chart");
    const [showGrid, setShowGrid] = useState<boolean>(true);
    const [showLegend, setShowLegend] = useState<boolean>(true);
    const [showTooltip, setShowTooltip] = useState<boolean>(true);
    const [stacked, setStacked] = useState<boolean>(false);
    const [animation, setAnimation] = useState<boolean>(true);
    const [colorScheme, setColorScheme] = useState<string>("default");

    const availableChartTypes = [
        { value: "bar", label: "Bar Chart" },
        { value: "line", label: "Line Chart" },
        { value: "pie", label: "Pie Chart" },
        { value: "area", label: "Area Chart" },
        { value: "scatter", label: "Scatter Plot" },
        { value: "radar", label: "Radar Chart" },
        { value: "composed", label: "Composed Chart" },
        { value: "radial", label: "Radial Bar Chart" },
    ];

    const colorSchemes = [
        { value: "default", label: "Default" },
        { value: "pastel", label: "Pastel" },
        { value: "vibrant", label: "Vibrant" },
        { value: "monochrome", label: "Monochrome" },
    ];

    const getColors = () => {
        switch (colorScheme) {
            case "pastel":
                return [
                    "#A7C7E7",
                    "#C1E1C1",
                    "#FDFD96",
                    "#FFB347",
                    "#D4A5A5",
                    "#C3B1E1",
                ];
            case "vibrant":
                return [
                    "#FF0000",
                    "#00FF00",
                    "#0000FF",
                    "#FFFF00",
                    "#FF00FF",
                    "#00FFFF",
                ];
            case "monochrome":
                return ["#666", "#888", "#AAA", "#CCC", "#EEE", "#FFF"];
            default:
                return COLORS;
        }
    };

    const keys = useMemo(() => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).filter((key) => key !== "name");
    }, [data]);

    const parseInputData = () => {
        try {
            // Try parsing as JSON
            const parsedData = JSON.parse(inputData);
            if (Array.isArray(parsedData)) {
                setData(parsedData);
                return;
            }
        } catch (e) {
            // If not JSON, try CSV format
            const lines = inputData.trim().split("\n");
            if (lines.length < 2) return;

            const headers = lines[0].split(",").map((h) => h.trim());
            const newData = lines.slice(1).map((line) => {
                const values = line.split(",").map((v) => v.trim());
                const obj: any = {};
                headers.forEach((header, i) => {
                    obj[header] = isNaN(Number(values[i]))
                        ? values[i]
                        : Number(values[i]);
                });
                return obj;
            });

            setData(newData);
        }
    };

    const renderChart = () => {
        if (data.length === 0) {
            return (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">
                        No data available. Please input your data.
                    </p>
                </div>
            );
        }

        const colors = getColors();

        const commonProps = {
            data,
            margin: { top: 20, right: 30, left: 20, bottom: 5 },
        };

        switch (chartType) {
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart {...commonProps}>
                            {showGrid && (
                                <CartesianGrid strokeDasharray="3 3" />
                            )}
                            <XAxis dataKey="name" />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend />}
                            {keys.map((key, index) => (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={colors[index % colors.length]}
                                    stackId={stacked ? "stack" : undefined}
                                    isAnimationActive={animation}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "line":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart {...commonProps}>
                            {showGrid && (
                                <CartesianGrid strokeDasharray="3 3" />
                            )}
                            <XAxis dataKey="name" />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend />}
                            {keys.map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={colors[index % colors.length]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    isAnimationActive={animation}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart {...commonProps}>
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend />}
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey={keys[0] || ""}
                                isAnimationActive={animation}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                );
            case "area":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart {...commonProps}>
                            {showGrid && (
                                <CartesianGrid strokeDasharray="3 3" />
                            )}
                            <XAxis dataKey="name" />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend />}
                            {keys.map((key, index) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stackId={stacked ? "stack" : undefined}
                                    stroke={colors[index % colors.length]}
                                    fill={colors[index % colors.length]}
                                    isAnimationActive={animation}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case "scatter":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart {...commonProps}>
                            {showGrid && (
                                <CartesianGrid strokeDasharray="3 3" />
                            )}
                            <XAxis dataKey="name" />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend />}
                            {keys.map((key, index) => (
                                <Scatter
                                    key={key}
                                    name={key}
                                    dataKey={key}
                                    fill={colors[index % colors.length]}
                                    isAnimationActive={animation}
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                );
            case "radar":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={data}
                        >
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis />
                            {keys.map((key, index) => (
                                <Radar
                                    key={key}
                                    name={key}
                                    dataKey={key}
                                    stroke={colors[index % colors.length]}
                                    fill={colors[index % colors.length]}
                                    fillOpacity={0.6}
                                    isAnimationActive={animation}
                                />
                            ))}
                            {showLegend && <Legend />}
                            {showTooltip && <Tooltip />}
                        </RadarChart>
                    </ResponsiveContainer>
                );
            case "composed":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart {...commonProps}>
                            {showGrid && (
                                <CartesianGrid strokeDasharray="3 3" />
                            )}
                            <XAxis dataKey="name" />
                            <YAxis />
                            {showTooltip && <Tooltip />}
                            {showLegend && <Legend />}
                            {keys.map((key, index) => (
                                <Bar
                                    key={`bar-${key}`}
                                    dataKey={key}
                                    barSize={20}
                                    fill={colors[index % colors.length]}
                                    stackId={stacked ? "stack" : undefined}
                                    isAnimationActive={animation}
                                />
                            ))}
                            <Line
                                type="monotone"
                                dataKey={keys[0] || ""}
                                stroke="#ff7300"
                                strokeWidth={2}
                                isAnimationActive={animation}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                );
            case "radial":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <RadialBarChart
                            innerRadius="10%"
                            outerRadius="80%"
                            data={data}
                            startAngle={180}
                            endAngle={0}
                        >
                            <RadialBar
                                label={{
                                    position: "insideStart",
                                    fill: "#fff",
                                }}
                                background
                                dataKey={keys[0] || ""}
                                isAnimationActive={animation}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                    />
                                ))}
                            </RadialBar>
                            <Legend
                                iconSize={10}
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                            />
                            {showTooltip && <Tooltip />}
                        </RadialBarChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
                    {renderChart()}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                        Chart Controls
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chart Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chart Type
                            </label>
                            <select
                                value={chartType}
                                onChange={(e) => setChartType(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                {availableChartTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color Scheme
                            </label>
                            <select
                                value={colorScheme}
                                onChange={(e) => setColorScheme(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                {colorSchemes.map((scheme) => (
                                    <option
                                        key={scheme.value}
                                        value={scheme.value}
                                    >
                                        {scheme.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Options
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showGrid"
                                    checked={showGrid}
                                    onChange={(e) =>
                                        setShowGrid(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="showGrid">Show Grid</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showLegend"
                                    checked={showLegend}
                                    onChange={(e) =>
                                        setShowLegend(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="showLegend">Show Legend</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="showTooltip"
                                    checked={showTooltip}
                                    onChange={(e) =>
                                        setShowTooltip(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="showTooltip">
                                    Show Tooltip
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="stacked"
                                    checked={stacked}
                                    onChange={(e) =>
                                        setStacked(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="stacked">
                                    Stacked (where applicable)
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="animation"
                                    checked={animation}
                                    onChange={(e) =>
                                        setAnimation(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                <label htmlFor="animation">
                                    Enable Animation
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Data Input</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enter data in JSON or CSV format
                    </label>
                    <textarea
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded h-40"
                        placeholder={`JSON format: [{"name": "Jan", "sales": 100}, {"name": "Feb", "sales": 200}]\n\nCSV format:\nname,sales\nJan,100\nFeb,200`}
                    />
                </div>
                <button
                    onClick={parseInputData}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                    Update Chart Data
                </button>

                {data.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-1">
                            Current Data Preview:
                        </h3>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartGenerator;