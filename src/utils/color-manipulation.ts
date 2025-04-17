export const getShareUrl = (platform: string, url: string, text: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
        case "whatsapp":
            return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        case "twitter":
            return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        case "linkedin":
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        case "instagram":
            // No official Instagram web share link. Provide instructions or copy link.
            return "https://www.instagram.com"; // fallback
        default:
            return url;
    }
};

// File: app/components/ColorConverter/utils.ts
import chroma from "chroma-js";

export type ColorFormat = 
  | "hex" | "rgb" | "rgba" | "hsl" | "hsla" 
  | "hsv" | "lab" | "lch" | "oklab" | "oklch" 
  | "cmyk" | "css";

export type ColorSpace = ColorFormat | "name";

export const colorSpaces: ColorSpace[] = [
  "hex", "rgb", "rgba", "hsl", "hsla", 
  "hsv", "lab", "lch", "oklab", "oklch", 
  "cmyk", "css", "name"
];

export const formatNames: Record<ColorSpace, string> = {
  hex: "HEX",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  hsv: "HSV",
  lab: "CIELAB",
  lch: "LCH",
  oklab: "OKLAB",
  oklch: "OKLCH",
  cmyk: "CMYK",
  css: "CSS",
  name: "Color Name"
};

export const getColorInFormat = (color: chroma.Color, format: ColorFormat): string => {
  try {
    switch (format) {
      case "hex":
        return color.hex();
      case "rgb":
        const [r, g, b] = color.rgb();
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      case "rgba":
        const [r2, g2, b2, a] = color.rgba();
        return `rgba(${Math.round(r2)}, ${Math.round(g2)}, ${Math.round(b2)}, ${a.toFixed(2)})`;
      case "hsl":
        const [h, s, l] = color.hsl();
        return `hsl(${Math.round(h || 0)}, ${Math.round((s || 0) * 100)}%, ${Math.round((l || 0) * 100)}%)`;
      case "hsla":
        const [h3, s3, l3] = color.hsl();
        const alpha = color.alpha();
        return `hsla(${Math.round(h3 || 0)}, ${Math.round((s3 || 0) * 100)}%, ${Math.round((l3 || 0) * 100)}%, ${alpha.toFixed(2)})`;
      case "hsv":
        const [hv, sv, v] = color.hsv();
        return `hsv(${Math.round(hv || 0)}, ${Math.round((sv || 0) * 100)}%, ${Math.round((v || 0) * 100)}%)`;
      case "lab":
        const [L, a3, b_] = color.lab();
        return `lab(${L.toFixed(2)}, ${a3.toFixed(2)}, ${b_.toFixed(2)})`;
      case "lch":
        const [L_lch, c, h_lch] = color.lch();
        return `lch(${L_lch.toFixed(2)}, ${c.toFixed(2)}, ${h_lch.toFixed(2)})`;
      case "oklab":
        const [L2, a4, b3] = color.oklab();
        return `oklab(${L2.toFixed(2)}, ${a4.toFixed(2)}, ${b3.toFixed(2)})`;
      case "oklch":
        const [L3, c2, h2] = color.oklch();
        return `oklch(${L3.toFixed(2)}, ${c2.toFixed(2)}, ${h2.toFixed(2)})`;
      case "cmyk":
        const [c_, m, y, k] = color.cmyk();
        return `cmyk(${Math.round(c_ * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
      case "css":
        return color.css();
      default:
        return color.hex();
    }
  } catch (e) {
    console.error(e);
    return "Invalid color";
  }
};

export const parseColorInput = (input: string, format: ColorSpace): string => {
  try {
    if (format === "name") {
      return chroma(input).hex();
    }
    return chroma(input).hex();
  } catch (e) {
    console.error(e);   
    return input;
  }
};