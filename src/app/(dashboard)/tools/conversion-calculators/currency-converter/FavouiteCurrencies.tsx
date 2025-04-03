'use client';

import React from "react";
import { Star, StarOff } from "lucide-react";

interface FavoriteCurrenciesProps {
    favorites: string[];
    rates: Record<string, number>;
    baseCurrency: string;
    toggleFavorite: (currency: string) => void;
    setFromCurrency: (currency: string) => void;
    setToCurrency: (currency: string) => void;
}

const FavoriteCurrencies: React.FC<FavoriteCurrenciesProps> = ({
    favorites,
    rates,
    baseCurrency,
    toggleFavorite,
    // setFromCurrency,
    setToCurrency,
}) => {
    // Only show currencies that are in the rates object
    const availableCurrencies = Object.keys(rates).filter(
        (curr) => curr !== baseCurrency
    );

    return (
        <div className="space-y-3">
            {favorites.length === 0 ? (
                <p className="text-gray-400 text-center py-2">
                    No favorite currencies added yet
                </p>
            ) : (
                favorites.map((currency) => {
                    // Skip if currency not in rates or is the base currency
                    if (!rates[currency] || currency === baseCurrency)
                        return null;

                    return (
                        <div
                            key={currency}
                            className="flex justify-between items-center bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                            onClick={() => setToCurrency(currency)}
                        >
                            <div>
                                <span className="font-medium">{currency}</span>
                                <div className="text-sm text-gray-400">
                                    1 {baseCurrency} ={" "}
                                    {rates[currency]?.toFixed(4)} {currency}
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(currency);
                                }}
                                className="text-yellow-400 hover:text-yellow-500"
                            >
                                <Star className="h-5 w-5" />
                            </button>
                        </div>
                    );
                })
            )}

            <div className="mt-4">
                <p className="text-sm font-medium text-gray-400 mb-2">
                    Add Favorites
                </p>
                <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                    {availableCurrencies
                        .filter((curr) => !favorites.includes(curr))
                        .map((currency) => (
                            <div
                                key={currency}
                                className="flex justify-between items-center bg-gray-700 p-2 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                                onClick={() => setToCurrency(currency)}
                            >
                                <div>
                                    <span>{currency}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(currency);
                                    }}
                                    className="text-gray-400 hover:text-yellow-400"
                                >
                                    <StarOff className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default FavoriteCurrencies;