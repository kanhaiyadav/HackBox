'use client';

import { useState, useEffect } from "react";
import {
    add,
    sub,
    format,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    isBefore,
    isAfter,
    isEqual,
    parseISO,
} from "date-fns";

type Operation = "add" | "subtract";
type Unit =
    | "days"
    | "weeks"
    | "months"
    | "years"
    | "hours"
    | "minutes"
    | "seconds";

const DateCalculator = () => {
    const [startDate, setStartDate] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [startTime, setStartTime] = useState<string>(
        format(new Date(), "HH:mm")
    );
    const [operation, setOperation] = useState<Operation>("add");
    const [value, setValue] = useState<number>(0);
    const [unit, setUnit] = useState<Unit>("days");
    const [result, setResult] = useState<string>("");
    const [differenceResult, setDifferenceResult] = useState<string>("");
    const [compareDate1, setCompareDate1] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [compareDate2, setCompareDate2] = useState<string>(
        format(new Date(), "yyyy-MM-dd")
    );
    const [compareResult, setCompareResult] = useState<string>("");
    const [activeTab, setActiveTab] = useState<
        "calculator" | "difference" | "comparison"
    >("calculator");

    // Calculate result when inputs change
    useEffect(() => {
        if (activeTab === "calculator") {
            calculateResult();
        } else if (activeTab === "difference") {
            calculateDifference();
        } else {
            compareDates();
        }
    }, [
        startDate,
        startTime,
        operation,
        value,
        unit,
        compareDate1,
        compareDate2,
        activeTab,
    ]);

    const calculateResult = () => {
        try {
            const dateTime = `${startDate}T${startTime}`;
            const date = parseISO(dateTime);
            let newDate: Date;

            if (operation === "add") {
                newDate = add(date, { [unit]: value });
            } else {
                newDate = sub(date, { [unit]: value });
            }

            setResult(format(newDate, "yyyy-MM-dd HH:mm"));
        } catch (error) {
            console.error(error);
            setResult("Invalid date/time");
        }
    };

    const calculateDifference = () => {
        try {
            const date1 = parseISO(compareDate1);
            const date2 = parseISO(compareDate2);

            const daysDiff = differenceInDays(date2, date1);
            const monthsDiff = differenceInMonths(date2, date1);
            const yearsDiff = differenceInYears(date2, date1);

            setDifferenceResult(`
        ${Math.abs(daysDiff)} days, 
        ${Math.abs(monthsDiff)} months, 
        ${Math.abs(yearsDiff)} years
      `);
        } catch (error) {
            console.error(error);
            setDifferenceResult("Invalid dates");
        }
    };

    const compareDates = () => {
        try {
            const date1 = parseISO(compareDate1);
            const date2 = parseISO(compareDate2);

            if (isEqual(date1, date2)) {
                setCompareResult("Dates are equal");
            } else if (isBefore(date1, date2)) {
                setCompareResult("First date is before second date");
            } else if (isAfter(date1, date2)) {
                setCompareResult("First date is after second date");
            }
        } catch (error) {
            console.error(error);
            setCompareResult("Invalid dates");
        }
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value as Unit);
    };

    const handleOperationChange = (op: Operation) => {
        setOperation(op);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Advanced Date & Time Calculator
            </h1>

            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "calculator"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("calculator")}
                >
                    Date Calculator
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "difference"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("difference")}
                >
                    Date Difference
                </button>
                <button
                    className={`py-2 px-4 font-medium ${
                        activeTab === "comparison"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("comparison")}
                >
                    Date Comparison
                </button>
            </div>

            {activeTab === "calculator" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Operation
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleOperationChange("add")}
                                    className={`px-4 py-2 rounded-md ${
                                        operation === "add"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() =>
                                        handleOperationChange("subtract")
                                    }
                                    className={`px-4 py-2 rounded-md ${
                                        operation === "subtract"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    Subtract
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Value
                            </label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) =>
                                    setValue(Number(e.target.value))
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                                min="0"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit
                            </label>
                            <select
                                value={unit}
                                onChange={handleUnitChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                                <option value="hours">Hours</option>
                                <option value="minutes">Minutes</option>
                                <option value="seconds">Seconds</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-medium text-gray-700 mb-2">
                            Result
                        </h2>
                        <p className="text-xl font-semibold text-gray-900">
                            {result || "Enter values to calculate"}
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "difference" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Date
                            </label>
                            <input
                                type="date"
                                value={compareDate1}
                                onChange={(e) =>
                                    setCompareDate1(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Second Date
                            </label>
                            <input
                                type="date"
                                value={compareDate2}
                                onChange={(e) =>
                                    setCompareDate2(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-medium text-gray-700 mb-2">
                            Difference
                        </h2>
                        <p className="text-xl font-semibold text-gray-900">
                            {differenceResult ||
                                "Enter dates to calculate difference"}
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "comparison" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Date
                            </label>
                            <input
                                type="date"
                                value={compareDate1}
                                onChange={(e) =>
                                    setCompareDate1(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Second Date
                            </label>
                            <input
                                type="date"
                                value={compareDate2}
                                onChange={(e) =>
                                    setCompareDate2(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                        <h2 className="text-lg font-medium text-gray-700 mb-2">
                            Comparison Result
                        </h2>
                        <p className="text-xl font-semibold text-gray-900">
                            {compareResult || "Enter dates to compare"}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">
                    Current Date & Time
                </h3>
                <p className="text-sm text-gray-600">
                    {format(new Date(), "yyyy-MM-dd HH:mm:ss")}
                </p>
            </div>
        </div>
    );
};

export default DateCalculator;
