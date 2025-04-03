'use client';

import React from "react";
import { ArrowsUpFromLineIcon } from "lucide-react";

interface CurrencyInputProps {
    amount: number;
    setAmount: (amount: number) => void;
    fromCurrency: string;
    setFromCurrency: (currency: string) => void;
    toCurrency: string;
    setToCurrency: (currency: string) => void;
    currencies: string[];
    handleSwapCurrencies: () => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    currencies,
    handleSwapCurrencies,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) =>
                            setAmount(parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                        className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400">{fromCurrency}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center">
                <button
                    onClick={handleSwapCurrencies}
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                    aria-label="Swap currencies"
                >
                    <ArrowsUpFromLineIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-400 mb-1">
                    Convert
                </label>
                <div className="grid grid-cols-2 gap-2">
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="block w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {currencies.map((currency) => (
                            <option key={`from-${currency}`} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>

                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="block w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {currencies.map((currency) => (
                            <option key={`to-${currency}`} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CurrencyInput;