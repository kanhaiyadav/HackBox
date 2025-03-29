import mongoose, { Schema, Document } from "mongoose";

interface ITool extends Document {
    name: string;
    description: string;
    warnings: string[];
    slug: string;
    category: string;
    categorySlug: string;
    stars: number;
    tags: string[];
}

const toolSchema = new Schema<ITool>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    warnings: { type: [String], default: [] },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    stars: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
});

export const Tool = mongoose.models.Tool || mongoose.model<ITool>("Tool", toolSchema);
