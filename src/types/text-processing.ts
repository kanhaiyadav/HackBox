export interface TextSettings {
    length: number;
    paragraphs: number;
    includeNumbers: boolean;
    includeSpecialChars: boolean;
    caseSetting: "lower" | "upper" | "mixed";
    wordLengthMin: number;
    wordLengthMax: number;
    sentenceLengthMin: number;
    sentenceLengthMax: number;
    includeLoremIpsum: boolean;
}
