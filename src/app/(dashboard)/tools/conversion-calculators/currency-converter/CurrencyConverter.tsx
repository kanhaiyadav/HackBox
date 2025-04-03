'use client';


import React, { useState, useEffect } from "react";
import CurrencyInput from "./CurrencyInput";
import ExchangeRate from "./ExchangeRate";
import ConversionHistory from "./ConversionHistory";
import FavoriteCurrencies from "./FavouiteCurrencies";
import CurrencyChart from "./CurrencyChart";

interface Conversion {
    from: string;
    to: string;
    amount: number;
    result: number;
    rate: number;
    date: Date;
}

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState<string>("USD");
    const [toCurrency, setToCurrency] = useState<string>("EUR");
    const [rates, setRates] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<number | null>(null);
    const [history, setHistory] = useState<Conversion[]>([]);
    const [favorites, setFavorites] = useState<string[]>([
        "EUR",
        "GBP",
        "JPY",
        "CAD",
    ]);
    const [historicalData, setHistoricalData] = useState<{
        dates: string[];
        rates: number[];
    }>({ dates: [], rates: [] });
    const [showChart, setShowChart] = useState<boolean>(false);

    // Fetch current exchange rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                setLoading(true);
                // In a real app, you would use an actual API key
                const response = await fetch(
                    `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
                );
                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                setRates(data.rates);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(
                    "Failed to fetch exchange rates. Using demo data instead."
                );
                // Fallback to demo data
                setRates({
                    USD: 1,
                    EUR: 0.91,
                    GBP: 0.77,
                    JPY: 151.72,
                    CAD: 1.36,
                    AUD: 1.51,
                    CHF: 0.89,
                    CNY: 7.23,
                    INR: 83.42,
                    BRL: 5.09,
                });
                setLoading(false);
            }
        };

        fetchRates();
        // Refresh rates every 5 minutes
        const interval = setInterval(fetchRates, 300000);

        return () => clearInterval(interval);
    }, [fromCurrency]);

    // Fetch historical data for chart
    useEffect(() => {
        if (showChart) {
            fetchHistoricalData();
        }
    }, [fromCurrency, toCurrency, showChart]);

    const fetchHistoricalData = async () => {
        try {
            // In a real app, this would be replaced with actual API calls
            // Simulating historical data for the past 30 days
            const dates = [];
            const rateValues = [];
            const baseRate = rates[toCurrency] || 1;

            for (let i = 30; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                dates.push(date.toISOString().slice(0, 10));

                // Generate slightly varying exchange rates for demo
                const randomVariation = 0.95 + Math.random() * 0.1;
                rateValues.push(baseRate * randomVariation);
            }

            setHistoricalData({
                dates,
                rates: rateValues,
            });
        } catch (err) {
            console.error(err);
            console.error("Failed to fetch historical data");
        }
    };

    // Calculate conversion result
    useEffect(() => {
        if (!loading && rates[toCurrency]) {
            const rate = rates[toCurrency];
            setResult(amount * rate);
        }
    }, [amount, toCurrency, rates, loading]);

    // Swap currencies
    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    // Save conversion to history
    const handleSaveConversion = () => {
        if (result !== null) {
            const newConversion: Conversion = {
                from: fromCurrency,
                to: toCurrency,
                amount,
                result,
                rate: rates[toCurrency] || 0,
                date: new Date(),
            };

            setHistory([newConversion, ...history].slice(0, 10)); // Keep last 10 conversions
        }
    };

    // Toggle favorite currencies
    const toggleFavorite = (currency: string) => {
        if (favorites.includes(currency)) {
            setFavorites(favorites.filter((c) => c !== currency));
        } else {
            setFavorites([...favorites, currency]);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gray-800 p-4 shadow-lg">
                <h1 className="text-2xl font-bold text-center">
                    Advanced Currency Converter
                </h1>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Converter Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Currency Converter
                            </h2>

                            <div className="space-y-4">
                                <CurrencyInput
                                    amount={amount}
                                    setAmount={setAmount}
                                    fromCurrency={fromCurrency}
                                    setFromCurrency={setFromCurrency}
                                    toCurrency={toCurrency}
                                    setToCurrency={setToCurrency}
                                    currencies={Object.keys(rates)}
                                    handleSwapCurrencies={handleSwapCurrencies}
                                />

                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="animate-pulse">
                                            Loading exchange rates...
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="text-red-400 text-center py-2">
                                        {error}
                                    </div>
                                ) : (
                                    <ExchangeRate
                                        fromCurrency={fromCurrency}
                                        toCurrency={toCurrency}
                                        rate={rates[toCurrency]}
                                        result={result}
                                        amount={amount}
                                        onSave={handleSaveConversion}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    Historical Rates
                                </h2>
                                <button
                                    onClick={() => setShowChart(!showChart)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                                >
                                    {showChart ? "Hide Chart" : "Show Chart"}
                                </button>
                            </div>

                            {showChart && (
                                <CurrencyChart
                                    fromCurrency={fromCurrency}
                                    toCurrency={toCurrency}
                                    data={historicalData}
                                />
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Favorite Currencies */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Favorite Currencies
                            </h2>
                            <FavoriteCurrencies
                                favorites={favorites}
                                rates={rates}
                                baseCurrency={fromCurrency}
                                toggleFavorite={toggleFavorite}
                                setFromCurrency={setFromCurrency}
                                setToCurrency={setToCurrency}
                            />
                        </div>

                        {/* Conversion History */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Conversion History
                            </h2>
                            <ConversionHistory
                                history={history}
                                setFromCurrency={setFromCurrency}
                                setToCurrency={setToCurrency}
                                setAmount={setAmount}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 p-4 text-center text-gray-400 text-sm">
                <p>Exchange rates updated every 5 minutes</p>
                <p className="mt-1">© 2025 Advanced Currency Converter</p>
            </footer>
        </div>
    );
};

export default CurrencyConverter;