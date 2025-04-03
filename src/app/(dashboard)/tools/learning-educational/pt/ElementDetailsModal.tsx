import { Element } from "@/types/element";
import ElectronConfigurationVisualizer from "./ElectronConfigurationVisualizer";

interface ElementDetailsModalProps {
    element: Element;
    onClose: () => void;
    temperature: number;
}

const ElementDetailsModal = ({
    element,
    onClose,
    temperature,
}: ElementDetailsModalProps) => {
    const getStateOfMatter = (): string => {
        if (!element.melt || !element.boil) return "Unknown";
        if (temperature < element.melt) return "Solid";
        if (temperature < element.boil) return "Liquid";
        return "Gas";
    };

    const stateOfMatter = getStateOfMatter();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">
                        {element.name} ({element.symbol})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <div
                            className="w-32 h-32 mx-auto flex items-center justify-center rounded-full shadow-lg text-4xl font-bold mb-4"
                            style={{
                                backgroundColor:
                                    element["cpk-hex"] || "#cccccc",
                            }}
                        >
                            {element.symbol}
                        </div>

                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold">
                                    Atomic Number:
                                </span>{" "}
                                {element.number}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Atomic Mass:
                                </span>{" "}
                                {element.atomic_mass.toFixed(4)} u
                            </p>
                            <p>
                                <span className="font-semibold">Group:</span>{" "}
                                {element.group || "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Period:</span>{" "}
                                {element.period}
                            </p>
                            <p>
                                <span className="font-semibold">Block:</span>{" "}
                                {element.block.toUpperCase()}
                            </p>
                            <p>
                                <span className="font-semibold">Category:</span>{" "}
                                {element.group}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    State at {temperature}K:
                                </span>{" "}
                                {stateOfMatter}
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-xl font-semibold mb-3">
                            Physical Properties
                        </h3>
                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold">Density:</span>{" "}
                                {element.density
                                    ? `${element.density} g/cm³`
                                    : "Unknown"}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Melting Point:
                                </span>{" "}
                                {element.melt
                                    ? `${element.melt} K`
                                    : "Unknown"}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Boiling Point:
                                </span>{" "}
                                {element.boil
                                    ? `${element.boil} K`
                                    : "Unknown"}
                            </p>
                            {/* <p>
                                <span className="font-semibold">
                                    Standard State:
                                </span>{" "}
                                {element.standardState}
                            </p> */}
                            {/* <p>
                                <span className="font-semibold">
                                    Radioactive:
                                </span>{" "}
                                {element.radioactive ? "Yes" : "No"}
                            </p> */}
                            <p>
                                <span className="font-semibold">Natural:</span>{" "}
                                {element.natural ? "Yes" : "No"}
                            </p>
                        </div>

                        {/* <h3 className="text-xl font-semibold mt-4 mb-3">
                            Discovery
                        </h3>
                        <p>Year: {element.yearDiscovered}</p> */}
                    </div>

                    <div className="col-span-1">
                        <h3 className="text-xl font-semibold mb-3">
                            Chemical Properties
                        </h3>
                        <div className="space-y-2">
                            <p>
                                <span className="font-semibold">
                                    Electronegativity:
                                </span>{" "}
                                {element.electronegativity_pauling || "Unknown"}
                            </p>
                            {/* <p>
                                <span className="font-semibold">
                                    Atomic Radius:
                                </span>{" "}
                                {element.atomicRadius
                                    ? `${element.atomicRadius} pm`
                                    : "Unknown"}
                            </p> */}
                            <p>
                                <span className="font-semibold">
                                    Ionization Energy:
                                </span>{" "}
                                {element.ionization_energies
                                    ? `${element.ionization_energies} kJ/mol`
                                    : "Unknown"}
                            </p>
                            <p>
                                <span className="font-semibold">
                                    Electron Affinity:
                                </span>{" "}
                                {element.electron_affinity
                                    ? `${element.electron_affinity} kJ/mol`
                                    : "Unknown"}
                            </p>
                            {/* <p>
                                <span className="font-semibold">
                                    Oxidation States:
                                </span>{" "}
                                {element.oxidationStates}
                            </p> */}
                        </div>

                        <h3 className="text-xl font-semibold mt-4 mb-3">
                            Electron Configuration
                        </h3>
                        <p className="mb-2">{element.electron_configuration}</p>
                        <ElectronConfigurationVisualizer
                            configuration={element.electron_configuration}
                        />
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                    <h3 className="text-xl font-semibold mb-3">
                        Temperature Simulation
                    </h3>
                    <div className="flex items-center space-x-4">
                        <span>Current: {temperature} K</span>
                        <input
                            type="range"
                            min="0"
                            max="6000"
                            value={temperature}
                            onChange={() => {}}
                            className="flex-1"
                        />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                        Adjust temperature to see state changes (0K to 6000K)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElementDetailsModal;
