// File: app/components/ColorConverter/ColorConverter.tsx
"use client";

import React, { useState } from "react";
import chroma from "chroma-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorInput from "./ColorInput";
import ColorFormats from "./ColorFormats";
import ColorPalette from "./ColorPalette";
import ColorAdjuster from "./ColorAdjuster";
import AccessibilityInfo from "./AccessibilityInfo";
import { ColorSpace, ColorFormat } from "@/utils/color-manipulation";

export default function ColorConverter() {
  const [color, setColor] = useState<string>("#3498db");
  const [chromaColor, setChromaColor] = useState<chroma.Color>(chroma("#3498db"));
  const [inputFormat, setInputFormat] = useState<ColorSpace>("hex");
  const [outputFormat, setOutputFormat] = useState<ColorFormat>("rgb");

  // Handle color input change
  const handleColorChange = (inputColor: string, format: ColorSpace = "hex") => {
    try {
      const newChromaColor = chroma(inputColor);
      setColor(inputColor);
      setChromaColor(newChromaColor);
      setInputFormat(format);
    } catch (e) {
      console.error(e);
      setColor(inputColor);
    }
  };

  return (
    <Tabs defaultValue="converter" className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="converter">Converter</TabsTrigger>
        <TabsTrigger value="palette">Palette Generator</TabsTrigger>
        <TabsTrigger value="adjuster">Color Adjuster</TabsTrigger>
        <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
      </TabsList>

      <TabsContent value="converter" className="space-y-6">
        <ColorInput 
          color={color} 
          format={inputFormat}
          onColorChange={handleColorChange} 
        />
        <ColorFormats 
          chromaColor={chromaColor} 
          inputFormat={inputFormat}
          outputFormat={outputFormat}
          onOutputFormatChange={setOutputFormat}
        />
      </TabsContent>

      <TabsContent value="palette" className="space-y-6">
        <ColorPalette 
          baseColor={chromaColor} 
          onColorSelect={handleColorChange} 
        />
      </TabsContent>

      <TabsContent value="adjuster" className="space-y-6">
        <ColorAdjuster 
          chromaColor={chromaColor} 
          onColorChange={handleColorChange} 
        />
      </TabsContent>

      <TabsContent value="accessibility" className="space-y-6">
        <AccessibilityInfo chromaColor={chromaColor} />
      </TabsContent>
    </Tabs>
  );
}