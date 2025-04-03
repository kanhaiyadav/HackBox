import React from "react";
import { Save } from "lucide-react";

interface ExchangeRateProps {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    result: number | null;
    amount: number;
    onSave: () => void;
}

const ExchangeRate: React.FC<ExchangeRateProps> = ({
    fromCurrency,
    toCurrency,
    rate,
    result,
    amount,
    onSave,
}) => {
    return (
        <div className="mt-6">
            <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-400">Exchange Rate</p>
                        <p className="text-lg">
                            1 {fromCurrency} = {rate?.toFixed(6)} {toCurrency}
                        </p>
                    </div>
                    <button
                        onClick={onSave}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                        aria-label="Save conversion to history"
                    >
                        <Save className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="bg-blue-900 rounded-lg p-6 mt-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-sm text-blue-300">
                            {amount} {fromCurrency} =
                        </p>
                        <p className="text-3xl font-bold mt-1">
                            {result?.toFixed(2)} {toCurrency}
                        </p>
                    </div>
                    <div className="text-right text-blue-300 text-sm">
                        <p>Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExchangeRate;