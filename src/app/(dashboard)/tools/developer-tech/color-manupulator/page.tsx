"use client";

import { useState } from "react";
import chroma from "chroma-js";

const formats = ["hex", "rgb", "hsl", "cmyk", "lab", "lch"];

const detectColorFormat = (color: string) => {
    try {
        if (color.startsWith("#")) return "hex";
        if (color.startsWith("rgb")) return "rgb";
        if (color.startsWith("hsl")) return "hsl";
        return "hex"; // Default fallback
    } catch {
        return "hex";
    }
};

const convertColor = (color: string, format: string, alpha: number) => {
    try {
        const parsedColor = chroma(color).alpha(alpha);

        switch (format) {
            case "hex":
                return parsedColor.hex();
            case "rgb":
                return `rgba(${parsedColor.rgba().join(", ")})`;
            case "hsl":
                return `hsla(${parsedColor
                    .hsl()
                    .map((v: number, i: number) =>
                        i > 0 ? `${(v * 100).toFixed(1)}%` : v.toFixed(1)
                    )
                    .join(", ")}, ${alpha})`;
            case "cmyk":
                const [r, g, b] = parsedColor.rgb();
                const k = 1 - Math.max(r, g, b) / 255;
                const c = (1 - r / 255 - k) / (1 - k) || 0;
                const m = (1 - g / 255 - k) / (1 - k) || 0;
                const y = (1 - b / 255 - k) / (1 - k) || 0;
                return `cmyk(${(c * 100).toFixed(1)}%, ${(m * 100).toFixed(
                    1
                )}%, ${(y * 100).toFixed(1)}%, ${(k * 100).toFixed(1)}%)`;
            case "lab":
                return parsedColor
                    .lab()
                    .map((v: number) => v.toFixed(1))
                    .join(", ");
            case "lch":
                return parsedColor
                    .lch()
                    .map((v: number) => v.toFixed(1))
                    .join(", ");
            default:
                return "Invalid Format";
        }
    } catch (error) {
        console.error(error);
        return "Invalid Color";
    }
};

export default function ColorConverter() {
    const [color, setColor] = useState("#ff5733");
    const [format, setFormat] = useState("rgb");
    const [alpha, setAlpha] = useState(1);
    const [result, setResult] = useState("");

    const handleColorChange = (e: { target: { value: string } }) => {
        const newColor = e.target.value;
        setColor(newColor);
        setFormat(detectColorFormat(newColor));
    };

    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
           <h2>Color Code Converter</h2>
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
            />
            <input
                type="text"
                value={color}
                onChange={handleColorChange}
                placeholder="Enter color"
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <label>Transparency: {Math.round(alpha * 100)}%</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                style={{ width: "100%", marginBottom: "10px" }}
            />
            <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            >
                {formats.map((fmt) => (
                    <option key={fmt} value={fmt}>
                        {fmt.toUpperCase()}
                    </option>
                ))}
            </select>
            <button
                onClick={() => setResult(convertColor(color, format, alpha))}
                style={{ width: "100%", padding: "8px", cursor: "pointer" }}
            >
                Convert
            </button>
            <p
                style={{
                    marginTop: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                }}
            >
                Result: {result}
            </p>
            <input
                type="color"
                value={chroma(color).alpha(1).hex()}
                disabled
                style={{ width: "100%", padding: "5px", marginTop: "10px" }}
            />
        </div>
    );
}
