import { Element } from "@/types/element";

interface ElementTileProps {
    element: Element;
    onClick: () => void;
    stateOfMatter: string;
}

const ElementTile = ({ element, onClick, stateOfMatter }: ElementTileProps) => {
    const getPositionStyles = () => {
        // Position elements based on their period and group
        if (element.number >= 57 && element.number <= 71) {
            // Lanthanides
            return {
                gridColumn: element.number - 57 + 3,
                gridRow: 9,
            };
        } else if (element.number >= 89 && element.number <= 103) {
            // Actinides
            return {
                gridColumn: element.number - 89 + 3,
                gridRow: 10,
            };
        } else {
            // Main table
            return {
                gridColumn: element.group || 1,
                gridRow: element.period,
            };
        }
    };

    const positionStyles = getPositionStyles();

    return (
        <div
            className={`relative w-16 h-16 flex flex-col items-center justify-center rounded-md shadow-md transition-all transform hover:scale-110 hover:z-10 cursor-pointer border-2 ${
                stateOfMatter === "Solid"
                    ? "border-gray-300"
                    : stateOfMatter === "Liquid"
                    ? "border-blue-300"
                    : "border-red-300"
            }`}
            style={{
                backgroundColor: element["cpk-hex"] || "#cccccc",
                gridColumn: positionStyles.gridColumn,
                gridRow: positionStyles.gridRow,
            }}
            onClick={onClick}
            title={`${element.name} (${element.symbol})`}
        >
            <span className="text-xs absolute top-1 left-1">
                {element.number}
            </span>
            <span className="text-lg font-bold">{element.symbol}</span>
            <span className="text-xs truncate w-full text-center">
                {element.name}
            </span>
            <span className="text-xxs absolute bottom-1">
                {stateOfMatter[0]}
            </span>
        </div>
    );
};

export default ElementTile;
