"use client";

import { TextSettings } from "@/types/text-processing";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsFormProps {
    settings: TextSettings;
    onChange: (settings: TextSettings) => void;
    errors: Record<string, string>;
}

export default function SettingsForm({
    settings,
    onChange,
}: SettingsFormProps) {
    const handleChange = <K extends keyof TextSettings>(key: K, value: TextSettings[K]) => {
        onChange({ ...settings, [key]: value });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg">
            <div className="space-y-4">
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Text Length (characters per paragraph):
                    </Label>
                    <Input
                        type="number"
                        value={settings.length}
                        onChange={(e) =>
                            handleChange(
                                "length",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min="1"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Number of Paragraphs:
                    </Label>
                    <Input
                        type="number"
                        value={settings.paragraphs}
                        onChange={(e) =>
                            handleChange(
                                "paragraphs",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min="1"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Minimum Word Length:
                    </Label>
                    <Input
                        type="number"
                        value={settings.wordLengthMin}
                        onChange={(e) =>
                            handleChange(
                                "wordLengthMin",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min="1"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Maximum Word Length:
                    </Label>
                    <Input
                        type="number"
                        value={settings.wordLengthMax}
                        onChange={(e) =>
                            handleChange(
                                "wordLengthMax",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min="1"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Minimum Sentence Length (words):
                    </Label>
                    <Input
                        type="number"
                        value={settings.sentenceLengthMin}
                        onChange={(e) =>
                            handleChange(
                                "sentenceLengthMin",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min="1"
                    />
                </div>
                <div>
                    <Label className="block text-sm font-medium mb-1">
                        Number of Sentences:
                    </Label>
                    <Input
                        type="number"
                        value={settings.sentenceLengthMin}
                        onChange={(e) =>
                            handleChange(
                                "sentenceLengthMin",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min="1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Text Case
                    </label>
                    <Select
                        value={settings.caseSetting}
                        onValueChange={(value: "lower" | "upper" | "mixed") =>
                            handleChange("caseSetting", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Text Case" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mixed">Mixed Case</SelectItem>
                            <SelectItem value="upper">Upper Case</SelectItem>
                            <SelectItem value="lower">Lower Case</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="include-numbers"
                            checked={settings.includeNumbers}
                            onCheckedChange={(checked) =>
                                handleChange("includeNumbers", !!checked)
                            }
                        />
                        <label htmlFor="include-numbers" className="text-sm">
                            Include Numbers
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="include-special-chars"
                            checked={settings.includeSpecialChars}
                            onCheckedChange={(checked) =>
                                handleChange("includeSpecialChars", !!checked)
                            }
                        />
                        <label
                            htmlFor="include-special-chars"
                            className="text-sm"
                        >
                            Include Special Characters
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="include-lorem"
                            checked={settings.includeLoremIpsum}
                            onCheckedChange={(checked) =>
                                handleChange("includeLoremIpsum", !!checked)
                            }
                        />
                        <label htmlFor="include-lorem" className="text-sm">
                            Start with Lorem Ipsum
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
