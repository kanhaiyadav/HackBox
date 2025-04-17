// types.ts
export type ColorFormat =
    | "hex"
    | "rgb"
    | "hsl"
    | "hsv"
    | "lab"
    | "lch"
    | "oklch"
    | "cmyk";
export type PaletteType =
    | "analogous"
    | "monochromatic"
    | "triad"
    | "complementary"
    | "shades";

export interface ContrastInfo {
    blackContrast: string;
    whiteContrast: string;
    betterTextColor: "black" | "white";
    wcagAA: boolean;
    wcagAAA: boolean;
}
