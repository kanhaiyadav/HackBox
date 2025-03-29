"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function toUpperCase(text: string) {
    return text.toUpperCase();
}

function toLowerCase(text: string) {
    return text.toLowerCase();
}

function toTitleCase(text: string) {
    return text.replace(/\b\w/g, (char: string) => char.toUpperCase());
}

function toSentenceCase(text: string) {
    return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (char: string) => char.toUpperCase());
}

function toCamelCase(text: string) {
    return text
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word: string, index: number) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, "");
}

function toPascalCase(text: string) {
    return text
        .replace(
            /\w+/g,
            (word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .replace(/\s+/g, "");
}

function toSnakeCase(text: string) {
    return text.toLowerCase().replace(/\s+/g, "_");
}

function toKebabCase(text: string) {
    return text.toLowerCase().replace(/\s+/g, "-");
}

function toAlternatingCase(text: string) {
    return text
        .split("")
        .map((char: string, index: number) =>
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
}

function toInverseCase(text: string) {
    return text
        .split("")
        .map((char: string) =>
            char === char.toUpperCase()
                ? char.toLowerCase()
                : char.toUpperCase()
        )
        .join("");
}

interface TextCase {
    title: string;
    description: string;
    converter: (arg0: string) => string;
}

const textCases: TextCase[] = [
    {
        title: "Uppercase",
        description: "Convert text to uppercase",
        converter: toUpperCase,
    },
    {
        title: "Lowercase",
        description: "Convert text to lowercase",
        converter: toLowerCase,
    },
    {
        title: "Title Case",
        description: "Convert text to title case",
        converter: toTitleCase,
    },
    {
        title: "Sentence Case",
        description: "Convert text to sentence case",
        converter: toSentenceCase,
    },
    {
        title: "Toggle Case",
        description: "Toggle the case of the text",
        converter: toAlternatingCase,
    },
    {
        title: "Capitalize",
        description: "Capitalize the first letter of each word",
        converter: toPascalCase,
    },
    {
        title: "Invert Case",
        description: "Invert the case of the text",
        converter: toInverseCase,
    },
    {
        title: "Snake Case",
        description: "Convert text to snake case",
        converter: toSnakeCase,
    },
    {
        title: "Kebab Case",
        description: "Convert text to kebab case",
        converter: toKebabCase,
    },
    {
        title: "Pascal Case",
        description: "Convert text to pascal case",
        converter: toPascalCase,
    },
    {
        title: "Camel Case",
        description: "Convert text to camel case",
        converter: toCamelCase,
    },
];

const Main = () => {
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");

    return (
        <>
            <Textarea
                label="Input text"
                onChange={(e) => setInputText(e.target.value)}
            />
            <Select
                onValueChange={(value) => {
                    const selectedTextCase = textCases.find(
                        (textCase) => textCase.title === value
                    );
                    if (selectedTextCase) {
                        setOutputText(selectedTextCase.converter(inputText));
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select the text case" />
                </SelectTrigger>
                <SelectContent>
                    {textCases.map((textCase, index) => (
                        <SelectItem key={index} value={textCase.title}>
                            {textCase.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="w-full h-[200px] rounded-lg shadow-inset mt-4 p-4 text-white/80 relative">
                {outputText.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40">
                        Output will be shown here
                    </motion.p>
                ) : (
                    <p>{outputText}</p>
                )}
            </div>
            <div className="flex items-center justify-end gap-4">
                <Button variant={'secondary'}>Copy Output</Button>
                <Button variant={'secondary'}>Reset</Button>
            </div>
        </>
    );
};

export default Main;
