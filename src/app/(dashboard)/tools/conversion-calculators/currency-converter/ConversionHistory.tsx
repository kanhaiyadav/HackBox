import React from "react";

interface Conversion {
    from: string;
    to: string;
    amount: number;
    result: number;
    rate: number;
    date: Date;
}

interface ConversionHistoryProps {
    history: Conversion[];
    setFromCurrency: (currency: string) => void;
    setToCurrency: (currency: string) => void;
    setAmount: (amount: number) => void;
}

const ConversionHistory: React.FC<ConversionHistoryProps> = ({
    history,
    setFromCurrency,
    setToCurrency,
    setAmount,
}) => {
    // Reuse a conversion
    const handleReuse = (conversion: Conversion) => {
        setFromCurrency(conversion.from);
        setToCurrency(conversion.to);
        setAmount(conversion.amount);
    };

    return (
        <div>
            {history.length === 0 ? (
                <p className="text-gray-400 text-center py-2">
                    No conversion history yet
                </p>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {history.map((conversion, index) => (
                        <div
                            key={index}
                            className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                            onClick={() => handleReuse(conversion)}
                        >
                            <div className="flex justify-between">
                                <span className="font-medium">
                                    {conversion.from} → {conversion.to}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {new Date(
                                        conversion.date
                                    ).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="mt-1">
                                <span>
                                    {conversion.amount} {conversion.from} ={" "}
                                </span>
                                <span className="font-medium">
                                    {conversion.result.toFixed(2)}{" "}
                                    {conversion.to}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                Rate: 1 {conversion.from} ={" "}
                                {conversion.rate.toFixed(6)} {conversion.to}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConversionHistory;
