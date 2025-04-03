import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface CurrencyChartProps {
    fromCurrency: string;
    toCurrency: string;
    data: {
        dates: string[];
        rates: number[];
    };
}

const CurrencyChart: React.FC<CurrencyChartProps> = ({
    fromCurrency,
    toCurrency,
    data,
}) => {
    // Format data for recharts
    const chartData = data.dates.map((date, index) => ({
        date,
        rate: data.rates[index],
    }));

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#9ca3af" }}
                        tickFormatter={(tick) => tick.slice(5)} // Show only MM-DD
                    />
                    <YAxis
                        domain={["auto", "auto"]}
                        tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1f2937",
                            borderColor: "#374151",
                        }}
                        labelStyle={{ color: "#e5e7eb" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name={`1 ${fromCurrency} to ${toCurrency}`}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CurrencyChart;
