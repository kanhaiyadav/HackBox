"use client";

// pages/index.tsx
import { useState } from "react";
import { AnimatedInput } from "@/components/AnimatedInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function Home() {
    // State for generator settings
    const [length, setLength] = useState(100);
    const [paragraphs, setParagraphs] = useState(1);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSpecialChars, setIncludeSpecialChars] = useState(false);
    const [caseSetting, setCaseSetting] = useState("mixed"); // 'lower', 'upper', 'mixed'
    const [wordLengthMin, setWordLengthMin] = useState(3);
    const [wordLengthMax, setWordLengthMax] = useState(10);
    const [sentenceLengthMin, setSentenceLengthMin] = useState(5);
    const [sentenceLengthMax, setSentenceLengthMax] = useState(15);
    const [includeLoremIpsum, setIncludeLoremIpsum] = useState(false);
    const [generatedText, setGeneratedText] = useState("");

    // Function to generate random text
    const generateText = () => {
        let result = "";
        const loremIpsumStart =
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

        let charset = alphabet;
        if (includeNumbers) charset += numbers;
        if (includeSpecialChars) charset += specialChars;

        for (let p = 0; p < paragraphs; p++) {
            // Start with Lorem Ipsum if option is enabled
            let paragraph = includeLoremIpsum && p === 0 ? loremIpsumStart : "";

            // Generate sentences
            const totalWords = length / 7;
            let wordCount = 0;

            while (wordCount < totalWords) {
                // Generate a sentence
                const sentenceLength =
                    Math.floor(
                        Math.random() *
                            (sentenceLengthMax - sentenceLengthMin + 1)
                    ) + sentenceLengthMin;

                let sentence = "";
                for (
                    let w = 0;
                    w < sentenceLength && wordCount < totalWords;
                    w++
                ) {
                    const wordLength =
                        Math.floor(
                            Math.random() * (wordLengthMax - wordLengthMin + 1)
                        ) + wordLengthMin;

                    let word = "";
                    for (let c = 0; c < wordLength; c++) {
                        let char = charset.charAt(
                            Math.floor(Math.random() * charset.length)
                        );

                        // Apply case setting
                        if (caseSetting === "upper") {
                            char = char.toUpperCase();
                        } else if (caseSetting === "lower") {
                            char = char.toLowerCase();
                        } else if (caseSetting === "mixed") {
                            char =
                                Math.random() > 0.5
                                    ? char.toUpperCase()
                                    : char.toLowerCase();
                        }

                        word += char;
                    }

                    sentence += word + " ";
                    wordCount++;
                }

                // Capitalize first letter and add period
                sentence = sentence.trim();
                if (sentence.length > 0) {
                    sentence =
                        sentence.charAt(0).toUpperCase() +
                        sentence.slice(1) +
                        ". ";
                    paragraph += sentence;
                }
            }

            result += paragraph + (p < paragraphs - 1 ? "\n\n" : "");
        }

        setGeneratedText(result);
    };

    return (
        <main>
            <div className="p-6 px-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-6">
                        <AnimatedInput
                            label="Text Length (characters per paragraph):"
                            type="number"
                            value={length}
                            onChange={(e) =>
                                setLength(parseInt(e.target.value))
                            }
                            min="1"
                        />

                        <AnimatedInput
                            label="Number of Paragraphs:"
                            type="number"
                            value={paragraphs}
                            onChange={(e) =>
                                setParagraphs(parseInt(e.target.value))
                            }
                            min="1"
                        />

                        <AnimatedInput
                            label="Minimum Word Length:"
                            type="number"
                            value={wordLengthMin}
                            onChange={(e) =>
                                setWordLengthMin(parseInt(e.target.value))
                            }
                            min="1"
                        />

                        <AnimatedInput
                            label="Maximum Word Length:"
                            type="number"
                            value={wordLengthMax}
                            onChange={(e) =>
                                setWordLengthMax(parseInt(e.target.value))
                            }
                            min="1"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <AnimatedInput
                            label="Minimum Sentence Length (words):"
                            type="number"
                            value={sentenceLengthMin}
                            onChange={(e) =>
                                setSentenceLengthMin(parseInt(e.target.value))
                            }
                            min="1"
                        />

                        <AnimatedInput
                            label="Maximum Sentence Length (words):"
                            type="number"
                            value={sentenceLengthMax}
                            onChange={(e) =>
                                setSentenceLengthMax(parseInt(e.target.value))
                            }
                            min="1"
                        />

                        <Select
                            value={caseSetting}
                            onValueChange={(value) => setCaseSetting(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Text Case" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mixed">
                                    Mixed Case
                                </SelectItem>
                                <SelectItem value="upper">
                                    Upper Case
                                </SelectItem>
                                <SelectItem value="lower">
                                    Lower Case
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex flex-col space-y-2 ml-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="include-numbers"
                                    checked={includeNumbers}
                                    onCheckedChange={(checked) =>
                                        setIncludeNumbers(!!checked)
                                    }
                                />
                                <label
                                    htmlFor="include-numbers"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Include Numbers
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="include-special-chars"
                                    checked={includeSpecialChars}
                                    onCheckedChange={(checked) =>
                                        setIncludeSpecialChars(!!checked)
                                    }
                                />
                                <label
                                    htmlFor="include-special-chars"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Include Special Characters
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="include-numbers"
                                    checked={includeLoremIpsum}
                                    onCheckedChange={(checked) =>
                                        setIncludeLoremIpsum(!!checked)
                                    }
                                />
                                <label
                                    htmlFor="include-numbers"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Start with Lorem Ipsum
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={generateText}
                    className="w-full mt-6 h-[60px] text-lg"
                >
                    Generate Text
                </Button>
            </div>

            <div id="output-box" className="p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-white/60 text-xl font-bold">Generated Text</h2>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            navigator.clipboard.writeText(generatedText)
                        }
                        className="mb-2"
                    >
                        Copy to Clipboard
                    </Button>
                </div>
                <div className="p-4 shadow-inset rounded-md whitespace-pre-wrap relative min-h-[200px]">
                    {generatedText ||
                        <p className="text-white/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Click &quot;Generate Text&quot; to create random text.</p>}
                </div>
            </div>
        </main>
    );
}
