"use client";

import { useState } from "react";
import SettingsForm from "./SettingsForm";
import OutputDisplay from "./OutputDisplay";
import { generateRandomText } from "@/utils/text-processing";
import { validateSettings } from "@/utils/text-processing";
import { TextSettings } from "@/types/text-processing";

export default function TextGenerator() {
    const [settings, setSettings] = useState<TextSettings>({
        length: 100,
        paragraphs: 1,
        includeNumbers: false,
        includeSpecialChars: false,
        caseSetting: "mixed",
        wordLengthMin: 3,
        wordLengthMax: 10,
        sentenceLengthMin: 5,
        sentenceLengthMax: 15,
        includeLoremIpsum: false,
    });

    const [generatedText, setGeneratedText] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleGenerate = () => {
        const validationErrors = validateSettings(settings);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        const text = generateRandomText(settings);
        setGeneratedText(text);
    };

    return (
        <div className="space-y-8">
            <SettingsForm
                settings={settings}
                onChange={setSettings}
                errors={errors}
            />
            <button
                onClick={handleGenerate}
                className="w-full py-4 px-6 bg-primary hover:bg-primary/80 text-black font-semibold rounded-lg transition-colors"
            >
                Generate Text
            </button>
            <OutputDisplay text={generatedText} />
        </div>
    );
}
