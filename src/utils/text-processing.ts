import { TextSettings } from "@/types/text-processing";

export function generateRandomText(settings: TextSettings): string {
    let result = "";
    const loremIpsumStart =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    let charset = alphabet;
    if (settings.includeNumbers) charset += numbers;
    if (settings.includeSpecialChars) charset += specialChars;

    for (let p = 0; p < settings.paragraphs; p++) {
        let paragraph =
            settings.includeLoremIpsum && p === 0 ? loremIpsumStart : "";

        const totalWords = settings.length / 7;
        let wordCount = 0;

        while (wordCount < totalWords) {
            const sentenceLength =
                Math.floor(
                    Math.random() *
                        (settings.sentenceLengthMax -
                            settings.sentenceLengthMin +
                            1)
                ) + settings.sentenceLengthMin;

            let sentence = "";
            for (let w = 0; w < sentenceLength && wordCount < totalWords; w++) {
                const wordLength =
                    Math.floor(
                        Math.random() *
                            (settings.wordLengthMax -
                                settings.wordLengthMin +
                                1)
                    ) + settings.wordLengthMin;

                let word = "";
                for (let c = 0; c < wordLength; c++) {
                    let char = charset.charAt(
                        Math.floor(Math.random() * charset.length)
                    );

                    switch (settings.caseSetting) {
                        case "upper":
                            char = char.toUpperCase();
                            break;
                        case "lower":
                            char = char.toLowerCase();
                            break;
                        case "mixed":
                            char =
                                Math.random() > 0.5
                                    ? char.toUpperCase()
                                    : char.toLowerCase();
                            break;
                    }

                    word += char;
                }

                sentence += word + " ";
                wordCount++;
            }

            sentence = sentence.trim();
            if (sentence.length > 0) {
                sentence =
                    sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". ";
                paragraph += sentence;
            }
        }

        result += paragraph + (p < settings.paragraphs - 1 ? "\n\n" : "");
    }

    return result;
}


//validator
export function validateSettings(
    settings: TextSettings
): Record<string, string> {
    const errors: Record<string, string> = {};

    if (settings.length <= 0) {
        errors.length = "Length must be greater than 0";
    }

    if (settings.paragraphs <= 0) {
        errors.paragraphs = "Must have at least 1 paragraph";
    }

    if (settings.wordLengthMin <= 0) {
        errors.wordLengthMin = "Minimum word length must be positive";
    }

    if (settings.wordLengthMax <= 0) {
        errors.wordLengthMax = "Maximum word length must be positive";
    }

    if (settings.wordLengthMin > settings.wordLengthMax) {
        errors.wordLengthMin = "Minimum cannot be greater than maximum";
        errors.wordLengthMax = "Maximum cannot be less than minimum";
    }

    if (settings.sentenceLengthMin <= 0) {
        errors.sentenceLengthMin = "Minimum sentence length must be positive";
    }

    if (settings.sentenceLengthMax <= 0) {
        errors.sentenceLengthMax = "Maximum sentence length must be positive";
    }

    if (settings.sentenceLengthMin > settings.sentenceLengthMax) {
        errors.sentenceLengthMin = "Minimum cannot be greater than maximum";
        errors.sentenceLengthMax = "Maximum cannot be less than minimum";
    }

    return errors;
}