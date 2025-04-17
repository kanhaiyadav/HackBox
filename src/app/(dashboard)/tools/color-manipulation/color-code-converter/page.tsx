import ColorConverter from "./ColorConverter";

export default function ColorToolPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Advanced Color Converter
            </h1>
            <ColorConverter />
        </div>
    );
}
