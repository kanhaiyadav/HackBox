"use client";

import { useState, useEffect } from "react";
import { Element } from "@/types/element";
import ElementTile from "./ElementTile";
import TableFilters from "./TableFilters";
import ElementDetailsModal from "./ElementDetailsModal";
// import ElectronConfigurationVisualizer from './ElectronConfigurationVisualizer';
import { elementsData } from "../../../../../../constants/Element";

const PeriodicTable = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [elements, setElements] = useState<Element[]>(elementsData);
    const [filteredElements, setFilteredElements] =
        useState<Element[]>(elementsData);
    const [selectedElement, setSelectedElement] = useState<Element | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [temperature, setTemperature] = useState(298); // Default to room temperature in Kelvin
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Element;
        direction: "ascending" | "descending";
    } | null>(null);

    // Filter elements based on search term and other filters
    useEffect(() => {
        let result = [...elements];

        if (searchTerm) {
            result = result.filter(
                (el) =>
                    el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    el.symbol
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    el.number.toString().includes(searchTerm)
            );
        }

        setFilteredElements(result);
    }, [searchTerm, elements]);

    // Sort elements
    const requestSort = (key: keyof Element) => {
        let direction: "ascending" | "descending" = "ascending";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "ascending"
        ) {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedElements = [...filteredElements].sort((a, b) => {
            if (a[key] === null) return 1;
            if (b[key] === null) return -1;
            if (a[key]! < b[key]!) return direction === "ascending" ? -1 : 1;
            if (a[key]! > b[key]!) return direction === "ascending" ? 1 : -1;
            return 0;
        });

        setFilteredElements(sortedElements);
    };

    const handleElementClick = (element: Element) => {
        setSelectedElement(element);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedElement(null);
    };

    const getStateOfMatter = (element: Element, temp: number): string => {
        if (!element.melt || !element.boil) return "Unknown";
        if (temp < element.melt) return "Solid";
        if (temp < element.boil) return "Liquid";
        return "Gas";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                Periodic Table Explorer
            </h1>

            <TableFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                temperature={temperature}
                setTemperature={setTemperature}
            />

            <div className="mb-8">
                <div className="grid grid-cols-18 gap-1 max-w-6xl mx-auto">
                    {/* Render all elements */}
                    {filteredElements.map((element) => (
                        <ElementTile
                            key={element.number}
                            element={element}
                            onClick={() => handleElementClick(element)}
                            stateOfMatter={getStateOfMatter(
                                element,
                                temperature
                            )}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && selectedElement && (
                <ElementDetailsModal
                    element={selectedElement}
                    onClose={closeModal}
                    temperature={temperature}
                />
            )}

            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Element Properties
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("number")}
                                >
                                    #
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("symbol")}
                                >
                                    Symbol
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("name")}
                                >
                                    Name
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("atomic_mass")}
                                >
                                    Atomic Mass
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() =>
                                        requestSort("electronegativity_pauling")
                                    }
                                >
                                    Electronegativity
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("density")}
                                >
                                    Density (g/cm³)
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("melt")}
                                >
                                    Melting Point (K)
                                </th>
                                <th
                                    className="px-4 py-2 cursor-pointer"
                                    onClick={() => requestSort("boil")}
                                >
                                    Boiling Point (K)
                                </th>
                                {/* <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('yearDiscovered')}>Discovered</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredElements.map((element) => (
                                <tr
                                    key={element.number}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleElementClick(element)}
                                >
                                    <td className="px-4 py-2">
                                        {element.number}
                                    </td>
                                    <td className="px-4 py-2 font-bold">
                                        {element.symbol}
                                    </td>
                                    <td className="px-4 py-2">
                                        {element.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {element.atomic_mass.toFixed(4)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {element.electronegativity_pauling ||
                                            "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {element.density || "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {element.melt || "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {element.boil || "-"}
                                    </td>
                                    {/* <td className="px-4 py-2">{element.yearDiscovered}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PeriodicTable;
