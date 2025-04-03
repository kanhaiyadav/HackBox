interface ElectronConfigurationVisualizerProps {
    configuration: string;
}

const ElectronConfigurationVisualizer = ({
    configuration,
}: ElectronConfigurationVisualizerProps) => {
    const parseConfiguration = (config: string) => {
        // Example: "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6 7s2 5f14 6d10 7p6"
        const orbitals = config.split(" ");
        return orbitals
            .map((orbital) => {
                const match = orbital.match(/^(\d+)([spdf])(\d+)$/);
                if (!match) return null;
                return {
                    level: parseInt(match[1]),
                    orbital: match[2],
                    electrons: parseInt(match[3]),
                };
            })
            .filter(Boolean);
    };

    const orbitalData = parseConfiguration(configuration);

    return (
        <div className="mt-2">
            <div className="flex flex-wrap gap-2">
                {orbitalData.map((orbital, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full border border-blue-300">
                            {orbital?.level}
                            {orbital?.orbital}
                        </div>
                        <sup className="ml-1">{orbital?.electrons}</sup>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ElectronConfigurationVisualizer;
