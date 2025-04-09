import { ColorBlindnessType } from "@/types/colorManipulation";

export const colorBlindnessDescriptions: Record<ColorBlindnessType, string> = {
    normal: "Normal vision with no color deficiency.",
    protanopia:
        "Red-blind (cannot see red light). Difficulty distinguishing between red and green colors, and red and black colors.",
    deuteranopia:
        "Green-blind (cannot see green light). Similar to protanopia but with less severity in the red spectrum.",
    tritanopia:
        "Blue-blind (cannot see blue light). Difficulty distinguishing between blue and green colors, and yellow and violet colors.",
    achromatopsia:
        "Complete color blindness. No ability to see colors at all, only shades of gray.",
};

export const colorBlindnessMatrices: Record<
    Exclude<ColorBlindnessType, "normal">,
    number[][]
> = {
    protanopia: [
        [0.567, 0.433, 0],
        [0.558, 0.442, 0],
        [0, 0.242, 0.758],
    ],
    deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7],
    ],
    tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.433, 0.567],
        [0, 0.475, 0.525],
    ],
    achromatopsia: [
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
        [0.299, 0.587, 0.114],
    ],
};