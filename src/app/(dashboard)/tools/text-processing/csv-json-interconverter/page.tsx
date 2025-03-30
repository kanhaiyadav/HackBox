'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Papa from "papaparse";

export default function Converter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState("csv-to-json");

    const handleConvert = () => {
        try {
            if (mode === "csv-to-json") {
                const result = Papa.parse(input, { header: true });
                setOutput(JSON.stringify(result.data, null, 2));
            } else {
                const jsonArray = JSON.parse(input);
                if (!Array.isArray(jsonArray))
                    throw new Error("Invalid JSON format");
                const csv = Papa.unparse(jsonArray);
                setOutput(csv);
            }
        } catch (error) {
            console.error("Conversion error:", error);
            setOutput("Invalid input format.");
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInput(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([output], {
            type: mode === "csv-to-json" ? "application/json" : "text/csv",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download =
            mode === "csv-to-json" ? "converted.json" : "converted.csv";
        link.click();
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between mb-4">
                <Button
                    onClick={() => setMode("csv-to-json")}
                    variant={mode === "csv-to-json" ? "default" : "outline"}
                >
                    CSV to JSON
                </Button>
                <Button
                    onClick={() => setMode("json-to-csv")}
                    variant={mode === "json-to-csv" ? "default" : "outline"}
                >
                    JSON to CSV
                </Button>
            </div>
            <input
                type="file"
                accept={mode === "csv-to-json" ? ".csv" : ".json"}
                onChange={handleFileUpload}
                className="mb-4"
            />
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                    mode === "csv-to-json"
                        ? "Paste CSV here..."
                        : "Paste JSON here..."
                }
                className="mb-4"
            />
            <Button onClick={handleConvert} className="w-full mb-4">
                Convert
            </Button>
            <Card>
                <CardContent className="p-4">
                    <pre className="whitespace-pre-wrap break-words text-sm">
                        {output}
                    </pre>
                </CardContent>
            </Card>
            {output && (
                <Button onClick={handleDownload} className="mt-4 w-full">
                    Download
                </Button>
            )}
        </div>
    );
}
