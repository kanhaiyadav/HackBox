'use client';

// components/UnitConverter.tsx
import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaHistory } from "react-icons/fa";
import {
    MdStraighten,
    MdOutlineScience,
    MdSpeed,
    MdOutlineWaterDrop,
    MdAccessTime,
    MdMemory,
    MdOutlineComputer,
    MdOutlineThermostat,
    MdMonitor,
} from "react-icons/md";
import { TbWeight } from "react-icons/tb";

// Define conversion types and their units
const conversionTypes = {
    length: {
        name: "Length",
        icon: <MdStraighten className="text-xl" />,
        units: [
            { id: "mm", name: "Millimeter (mm)", factor: 0.001 },
            { id: "cm", name: "Centimeter (cm)", factor: 0.01 },
            { id: "m", name: "Meter (m)", factor: 1 },
            { id: "km", name: "Kilometer (km)", factor: 1000 },
            { id: "in", name: "Inch (in)", factor: 0.0254 },
            { id: "ft", name: "Foot (ft)", factor: 0.3048 },
            { id: "yd", name: "Yard (yd)", factor: 0.9144 },
            { id: "mi", name: "Mile (mi)", factor: 1609.344 },
        ],
    },
    weight: {
        name: "Weight & Mass",
        icon: <TbWeight className="text-xl" />,
        units: [
            { id: "mg", name: "Milligram (mg)", factor: 0.000001 },
            { id: "g", name: "Gram (g)", factor: 0.001 },
            { id: "kg", name: "Kilogram (kg)", factor: 1 },
            { id: "t", name: "Metric Ton (t)", factor: 1000 },
            { id: "oz", name: "Ounce (oz)", factor: 0.028349523125 },
            { id: "lb", name: "Pound (lb)", factor: 0.45359237 },
            { id: "st", name: "Stone (st)", factor: 6.35029318 },
        ],
    },
    volume: {
        name: "Volume",
        icon: <MdOutlineWaterDrop className="text-xl" />,
        units: [
            { id: "ml", name: "Milliliter (ml)", factor: 0.000001 },
            { id: "l", name: "Liter (l)", factor: 0.001 },
            { id: "m3", name: "Cubic Meter (m³)", factor: 1 },
            { id: "gal_us", name: "US Gallon (gal)", factor: 0.00378541 },
            { id: "gal_uk", name: "UK Gallon (gal)", factor: 0.00454609 },
            {
                id: "fl_oz_us",
                name: "US Fluid Ounce (fl oz)",
                factor: 0.0000295735,
            },
            {
                id: "fl_oz_uk",
                name: "UK Fluid Ounce (fl oz)",
                factor: 0.0000284131,
            },
            { id: "cup_us", name: "US Cup", factor: 0.000236588 },
        ],
    },
    temperature: {
        name: "Temperature",
        icon: <MdOutlineThermostat className="text-xl" />,
        units: [
            { id: "c", name: "Celsius (°C)", factor: 1 },
            { id: "f", name: "Fahrenheit (°F)", factor: 1 },
            { id: "k", name: "Kelvin (K)", factor: 1 },
        ],
    },
    time: {
        name: "Time",
        icon: <MdAccessTime className="text-xl" />,
        units: [
            { id: "ms", name: "Millisecond (ms)", factor: 0.001 },
            { id: "s", name: "Second (s)", factor: 1 },
            { id: "min", name: "Minute (min)", factor: 60 },
            { id: "h", name: "Hour (h)", factor: 3600 },
            { id: "d", name: "Day (d)", factor: 86400 },
            { id: "wk", name: "Week (wk)", factor: 604800 },
            { id: "mo", name: "Month (avg)", factor: 2629800 },
            { id: "yr", name: "Year", factor: 31557600 },
        ],
    },
    speed: {
        name: "Speed",
        icon: <MdSpeed className="text-xl" />,
        units: [
            { id: "m_s", name: "Meter/second (m/s)", factor: 1 },
            { id: "km_h", name: "Kilometer/hour (km/h)", factor: 0.277778 },
            { id: "mph", name: "Miles/hour (mph)", factor: 0.44704 },
            { id: "knot", name: "Knot (kn)", factor: 0.514444 },
            { id: "ft_s", name: "Feet/second (ft/s)", factor: 0.3048 },
        ],
    },
    area: {
        name: "Area",
        icon: <MdMonitor className="text-xl" />,
        units: [
            { id: "mm2", name: "Square Millimeter (mm²)", factor: 0.000001 },
            { id: "cm2", name: "Square Centimeter (cm²)", factor: 0.0001 },
            { id: "m2", name: "Square Meter (m²)", factor: 1 },
            { id: "ha", name: "Hectare (ha)", factor: 10000 },
            { id: "km2", name: "Square Kilometer (km²)", factor: 1000000 },
            { id: "in2", name: "Square Inch (in²)", factor: 0.00064516 },
            { id: "ft2", name: "Square Foot (ft²)", factor: 0.09290304 },
            { id: "ac", name: "Acre (ac)", factor: 4046.86 },
            { id: "mi2", name: "Square Mile (mi²)", factor: 2589988.11 },
        ],
    },
    data: {
        name: "Data",
        icon: <MdOutlineComputer className="text-xl" />,
        units: [
            { id: "b", name: "Bit (b)", factor: 0.125 },
            { id: "B", name: "Byte (B)", factor: 1 },
            { id: "KB", name: "Kilobyte (KB)", factor: 1000 },
            { id: "KiB", name: "Kibibyte (KiB)", factor: 1024 },
            { id: "MB", name: "Megabyte (MB)", factor: 1000000 },
            { id: "MiB", name: "Mebibyte (MiB)", factor: 1048576 },
            { id: "GB", name: "Gigabyte (GB)", factor: 1000000000 },
            { id: "GiB", name: "Gibibyte (GiB)", factor: 1073741824 },
            { id: "TB", name: "Terabyte (TB)", factor: 1000000000000 },
            { id: "TiB", name: "Tebibyte (TiB)", factor: 1099511627776 },
        ],
    },
    energy: {
        name: "Energy",
        icon: <MdOutlineScience className="text-xl" />,
        units: [
            { id: "j", name: "Joule (J)", factor: 1 },
            { id: "kj", name: "Kilojoule (kJ)", factor: 1000 },
            { id: "cal", name: "Calorie (cal)", factor: 4.184 },
            { id: "kcal", name: "Kilocalorie (kcal)", factor: 4184 },
            { id: "wh", name: "Watt-hour (Wh)", factor: 3600 },
            { id: "kwh", name: "Kilowatt-hour (kWh)", factor: 3600000 },
            { id: "ev", name: "Electronvolt (eV)", factor: 1.602176634e-19 },
        ],
    },
    frequency: {
        name: "Frequency",
        icon: <MdMemory className="text-xl" />,
        units: [
            { id: "hz", name: "Hertz (Hz)", factor: 1 },
            { id: "khz", name: "Kilohertz (kHz)", factor: 1000 },
            { id: "mhz", name: "Megahertz (MHz)", factor: 1000000 },
            { id: "ghz", name: "Gigahertz (GHz)", factor: 1000000000 },
        ],
    },
};

// Special conversions for temperature
const temperatureConversions = {
    c_to_f: (celsius: number) => (celsius * 9) / 5 + 32,
    c_to_k: (celsius: number) => celsius + 273.15,
    f_to_c: (fahrenheit: number) => ((fahrenheit - 32) * 5) / 9,
    f_to_k: (fahrenheit: number) => ((fahrenheit - 32) * 5) / 9 + 273.15,
    k_to_c: (kelvin: number) => kelvin - 273.15,
    k_to_f: (kelvin: number) => ((kelvin - 273.15) * 9) / 5 + 32,
};

// History item type
interface HistoryItem {
    id: string;
    inputValue: string;
    outputValue: string;
    inputUnit: string;
    outputUnit: string;
    timestamp: Date;
    conversionType: string;
}

const UnitConverter: React.FC = () => {
    const [conversionType, setConversionType] = useState<string>("length");
    const [inputUnit, setInputUnit] = useState<string>("m");
    const [outputUnit, setOutputUnit] = useState<string>("ft");
    const [inputValue, setInputValue] = useState<string>("1");
    const [outputValue, setOutputValue] = useState<string>("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);

    // Convert units when input, input unit, or output unit changes
    useEffect(() => {
        handleConversion();
    }, [inputValue, inputUnit, outputUnit, conversionType]);

    // Load history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem("unitConverterHistory");
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                setHistory(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    parsedHistory.map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp),
                    }))
                );
            } catch (error) {
                console.error("Failed to parse history", error);
            }
        }
    }, []);

    // Save history to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("unitConverterHistory", JSON.stringify(history));
    }, [history]);

    // Handle conversion type change
    const handleConversionTypeChange = (type: string) => {
        setConversionType(type);

        // Set default units for the new conversion type
        const defaultUnits =
            conversionTypes[type as keyof typeof conversionTypes].units;
        if (defaultUnits.length >= 2) {
            setInputUnit(defaultUnits[0].id);
            setOutputUnit(defaultUnits[1].id);
        }

        setInputValue("1");
    };

    // Handle input value change
    const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Swap input and output units
    const swapUnits = () => {
        const tempUnit = inputUnit;
        setInputUnit(outputUnit);
        setOutputUnit(tempUnit);

        // Also swap the values
        setInputValue(outputValue);
    };

    // Handle conversion
    const handleConversion = () => {
        if (!inputValue || isNaN(parseFloat(inputValue))) {
            setOutputValue("");
            return;
        }

        const value = parseFloat(inputValue);

        // Handle temperature conversions specially
        if (conversionType === "temperature") {
            let result: number;

            if (inputUnit === "c" && outputUnit === "f") {
                result = temperatureConversions.c_to_f(value);
            } else if (inputUnit === "c" && outputUnit === "k") {
                result = temperatureConversions.c_to_k(value);
            } else if (inputUnit === "f" && outputUnit === "c") {
                result = temperatureConversions.f_to_c(value);
            } else if (inputUnit === "f" && outputUnit === "k") {
                result = temperatureConversions.f_to_k(value);
            } else if (inputUnit === "k" && outputUnit === "c") {
                result = temperatureConversions.k_to_c(value);
            } else if (inputUnit === "k" && outputUnit === "f") {
                result = temperatureConversions.k_to_f(value);
            } else {
                // Same unit, no conversion needed
                result = value;
            }

            setOutputValue(result.toFixed(6).replace(/\.?0+$/, ""));
        } else {
            // For regular conversions using factor method
            const units =
                conversionTypes[conversionType as keyof typeof conversionTypes]
                    .units;
            const inputFactor =
                units.find((u) => u.id === inputUnit)?.factor || 1;
            const outputFactor =
                units.find((u) => u.id === outputUnit)?.factor || 1;

            // Calculate the base value, then convert to output unit
            const baseValue = value * inputFactor;
            const result = baseValue / outputFactor;

            setOutputValue(result.toFixed(8).replace(/\.?0+$/, ""));
        }

        // Add to history
        if (value !== 0 && inputUnit !== outputUnit) {
            const newHistoryItem: HistoryItem = {
                id: Date.now().toString(),
                inputValue,
                outputValue: outputValue !== "" ? outputValue : "0",
                inputUnit,
                outputUnit,
                timestamp: new Date(),
                conversionType,
            };

            setHistory((prev) => [newHistoryItem, ...prev].slice(0, 20)); // Limit to 20 items
        }
    };

    // Clear history
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem("unitConverterHistory");
    };

    // Get unit name from id
    const getUnitName = (unitId: string, type: string) => {
        const units =
            conversionTypes[type as keyof typeof conversionTypes].units;
        return units.find((u) => u.id === unitId)?.name || unitId;
    };

    // Format date for history
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Delete a history item
    const deleteHistoryItem = (id: string) => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
    };

    // Load a history item
    const loadHistoryItem = (item: HistoryItem) => {
        setConversionType(item.conversionType);
        setInputUnit(item.inputUnit);
        setOutputUnit(item.outputUnit);
        setInputValue(item.inputValue);
        setShowHistory(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <header className="bg-gray-700 p-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Advanced Unit Converter
                    </h1>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition"
                    >
                        <FaHistory />{" "}
                        {showHistory ? "Hide History" : "View History"}
                    </button>
                </header>

                {/* Main content */}
                <div className="p-4">
                    {showHistory ? (
                        <div className="bg-gray-850 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    Conversion History
                                </h2>
                                <button
                                    onClick={clearHistory}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                                >
                                    Clear All
                                </button>
                            </div>

                            {history.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">
                                    No conversion history yet
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-700 p-3 rounded-md flex justify-between items-center"
                                            onClick={() =>
                                                loadHistoryItem(item)
                                            }
                                        >
                                            <div className="cursor-pointer flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">
                                                        {item.inputValue}{" "}
                                                        {item.inputUnit}
                                                    </span>
                                                    <FaExchangeAlt className="text-gray-400" />
                                                    <span className="font-medium">
                                                        {item.outputValue}{" "}
                                                        {item.outputUnit}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                                    {
                                                        conversionTypes[
                                                            item.conversionType as keyof typeof conversionTypes
                                                        ].icon
                                                    }
                                                    <span>
                                                        {
                                                            conversionTypes[
                                                                item.conversionType as keyof typeof conversionTypes
                                                            ].name
                                                        }
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {formatDate(
                                                            item.timestamp
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteHistoryItem(item.id);
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setShowHistory(false)}
                                className="mt-4 w-full py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition"
                            >
                                Back to Converter
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Conversion Type Selection */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">
                                    Select Conversion Type
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {Object.entries(conversionTypes).map(
                                        ([key, type]) => (
                                            <button
                                                key={key}
                                                onClick={() =>
                                                    handleConversionTypeChange(
                                                        key
                                                    )
                                                }
                                                className={`p-3 rounded-md flex flex-col items-center justify-center transition ${
                                                    conversionType === key
                                                        ? "bg-blue-600"
                                                        : "bg-gray-700 hover:bg-gray-600"
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">
                                                    {type.icon}
                                                </div>
                                                <span className="text-sm">
                                                    {type.name}
                                                </span>
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Conversion Interface */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Input Section */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-300">
                                        From
                                    </h3>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={inputValue}
                                            onChange={handleInputValueChange}
                                            className="w-full bg-gray-700 rounded-md p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter value"
                                        />
                                    </div>
                                    <select
                                        value={inputUnit}
                                        onChange={(e) =>
                                            setInputUnit(e.target.value)
                                        }
                                        className="w-full bg-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {conversionTypes[
                                            conversionType as keyof typeof conversionTypes
                                        ].units.map((unit) => (
                                            <option
                                                key={unit.id}
                                                value={unit.id}
                                            >
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Swap Button */}
                                <div className="flex items-center justify-center md:justify-start md:absolute md:left-1/2 md:transform md:-translate-x-1/2 my-4 md:my-0">
                                    <button
                                        onClick={swapUnits}
                                        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition"
                                    >
                                        <FaExchangeAlt className="text-xl" />
                                    </button>
                                </div>

                                {/* Output Section */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-300">
                                        To
                                    </h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={outputValue}
                                            readOnly
                                            className="w-full bg-gray-700 rounded-md p-4 text-lg focus:outline-none"
                                            placeholder="Result"
                                        />
                                    </div>
                                    <select
                                        value={outputUnit}
                                        onChange={(e) =>
                                            setOutputUnit(e.target.value)
                                        }
                                        className="w-full bg-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {conversionTypes[
                                            conversionType as keyof typeof conversionTypes
                                        ].units.map((unit) => (
                                            <option
                                                key={unit.id}
                                                value={unit.id}
                                            >
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Formula Info */}
                            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-lg font-medium mb-2">
                                    Conversion Formula
                                </h3>
                                <p className="text-gray-300">
                                    {conversionType === "temperature" ? (
                                        <>
                                            {inputUnit === "c" &&
                                                outputUnit === "f" &&
                                                "°F = (°C × 9/5) + 32"}
                                            {inputUnit === "c" &&
                                                outputUnit === "k" &&
                                                "K = °C + 273.15"}
                                            {inputUnit === "f" &&
                                                outputUnit === "c" &&
                                                "°C = (°F - 32) × 5/9"}
                                            {inputUnit === "f" &&
                                                outputUnit === "k" &&
                                                "K = (°F - 32) × 5/9 + 273.15"}
                                            {inputUnit === "k" &&
                                                outputUnit === "c" &&
                                                "°C = K - 273.15"}
                                            {inputUnit === "k" &&
                                                outputUnit === "f" &&
                                                "°F = (K - 273.15) × 9/5 + 32"}
                                            {inputUnit === outputUnit &&
                                                "No conversion needed"}
                                        </>
                                    ) : (
                                        <>
                                            1{" "}
                                            {getUnitName(
                                                inputUnit,
                                                conversionType
                                            )}{" "}
                                            ={" "}
                                            {(conversionTypes[
                                                conversionType as keyof typeof conversionTypes
                                            ].units.find(
                                                (u) => u.id === inputUnit
                                            )?.factor || 0) /
                                                (conversionTypes[
                                                    conversionType as keyof typeof conversionTypes
                                                ].units.find(
                                                    (u) => u.id === outputUnit
                                                )?.factor || 1)}{" "}
                                            {getUnitName(
                                                outputUnit,
                                                conversionType
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;
