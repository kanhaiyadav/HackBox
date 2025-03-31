import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { useMemo } from "react";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
];

export default function LanguageChart({
    languages,
}: {
    languages: Record<string, number>;
}) {
    const data = useMemo(() => {
        const total = Object.values(languages).reduce(
            (sum, count) => sum + count,
            0
        );
        return Object.entries(languages)
            .map(([name, value]) => ({
                name,
                value,
                percentage: Math.round((value / total) * 100),
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 7);
    }, [languages]);

    if (data.length === 0) {
        return (
            <p className="text-gray-500 text-center py-8">
                No language data available
            </p>
        );
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percentage }) =>
                            `${name} ${percentage}%`
                        }
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value, name, props) => [
                            `${value} repos`,
                            name,
                        ]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
