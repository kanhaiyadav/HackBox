import ChartGenerator from "./ChartGenerator";

const sampleData = [
    { name: "Jan", sales: 4000, expenses: 2400 },
    { name: "Feb", sales: 3000, expenses: 1398 },
    { name: "Mar", sales: 2000, expenses: 9800 },
    { name: "Apr", sales: 2780, expenses: 3908 },
    { name: "May", sales: 1890, expenses: 4800 },
    { name: "Jun", sales: 2390, expenses: 3800 },
];

const ChartPage = () => {
    return (
        <div className="p-4">
            <ChartGenerator initialData={sampleData} />
        </div>
    );
};

export default ChartPage;
