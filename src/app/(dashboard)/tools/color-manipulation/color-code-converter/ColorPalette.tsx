// File: app/components/ColorConverter/ColorPalette.tsx
"use client";

import React, { useState, useEffect } from "react";
import chroma from "chroma-js";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ColorSpace } from "@/utils/color-manipulation";

interface ColorPaletteProps {
  baseColor: chroma.Color;
  onColorSelect: (color: string, format: ColorSpace) => void;
}

export default function ColorPalette({ baseColor, onColorSelect }: ColorPaletteProps) {
  const [paletteType, setPaletteType] = useState<string>("analogous");
  const [paletteCount, setPaletteCount] = useState<number>(5);
  const [colorPalette, setColorPalette] = useState<string[]>([]);

  // Generate color palette based on selected type
  const generatePalette = () => {
    try {
      let newPalette: string[] = [];

      switch (paletteType) {
        case "analogous":
          const hslVal = baseColor.hsl();
          const baseHue = hslVal[0] || 0;
          newPalette = Array.from({ length: paletteCount }, (_, i) => {
            const hueAdjust = ((i - Math.floor(paletteCount / 2)) * 30 % 360);
            return chroma.hsl(
              (baseHue + hueAdjust + 360) % 360,
              hslVal[1],
              hslVal[2]
            ).hex();
          });
          break;

        case "monochromatic":
          newPalette = chroma
            .scale([
              baseColor.set("hsl.l", 0.2),
              baseColor.set("hsl.l", 0.8),
            ])
            .mode("lch")
            .colors(paletteCount);
          break;

        case "triad":
          const baseHue2 = baseColor.hsl()[0] || 0;
          newPalette = [
            baseColor.hex(),
            chroma.hsl(
              (baseHue2 + 120) % 360,
              baseColor.hsl()[1],
              baseColor.hsl()[2]
            ).hex(),
            chroma.hsl(
              (baseHue2 + 240) % 360,
              baseColor.hsl()[1],
              baseColor.hsl()[2]
            ).hex(),
          ];
          if (paletteCount > 3) {
            const additional = chroma
              .scale([baseColor.hex(), newPalette[1]])
              .mode("lch")
              .colors(Math.floor(paletteCount / 3) + 1);
            newPalette = [
              ...additional,
              ...chroma.scale([newPalette[1], newPalette[2]])
                .mode("lch")
                .colors(Math.floor(paletteCount / 3) + 1),
            ];
            if (newPalette.length > paletteCount) {
              newPalette = newPalette.slice(0, paletteCount);
            }
          }
          break;

        case "complementary":
          const complementary = chroma.hsl(
            (baseColor.hsl()[0] + 180) % 360,
            baseColor.hsl()[1],
            baseColor.hsl()[2]
          );
          newPalette = chroma
            .scale([baseColor, complementary])
            .mode("lch")
            .colors(paletteCount);
          break;

        case "shades":
          newPalette = chroma
            .scale(["black", baseColor.hex(), "white"])
            .mode("lab")
            .colors(paletteCount);
          break;

        default:
          newPalette = [baseColor.hex()];
      }

      setColorPalette(newPalette);
    } catch (e) {
      console.error(e);
      setColorPalette([]);
    }
  };

  // Update palette when base color or settings change
  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteType, paletteCount]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Palette Type
          </label>
          <Select
            value={paletteType}
            onValueChange={(value) => setPaletteType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select palette type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="monochromatic">Monochromatic</SelectItem>
              <SelectItem value="triad">Triadic</SelectItem>
              <SelectItem value="complementary">Complementary</SelectItem>
              <SelectItem value="shades">Shades</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Colors: {paletteCount}
          </label>
          <Slider
            value={[paletteCount]}
            min={3}
            max={10}
            step={1}
            onValueChange={(value) => setPaletteCount(value[0])}
            className="w-full"
          />
        </div>

        <Button onClick={generatePalette} className="w-full">
          Generate Palette
        </Button>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">
          Generated Palette
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {colorPalette.map((paletteColor, index) => (
            <div key={index} className="space-y-1">
              <div
                className="h-16 rounded-md border border-gray-200 flex items-end justify-center p-1 cursor-pointer"
                style={{ backgroundColor: paletteColor }}
                onClick={() => onColorSelect(paletteColor, "hex")}
                title="Click to select this color"
              >
                <span
                  className="text-xs font-mono px-1 rounded"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: "rgba(0,0,0,0.8)",
                  }}
                >
                  {paletteColor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}