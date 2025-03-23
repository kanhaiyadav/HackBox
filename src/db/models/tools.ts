import mongoose, { Schema, Document } from "mongoose";

interface ITool extends Document {
    name: string;
    description: string;
    slug: string;
    category: string;
    stars: number;
}

const toolSchema = new Schema<ITool>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    stars: { type: Number, default: 0 },
});

export const Tool = mongoose.models.Tool || mongoose.model<ITool>("Tool", toolSchema);
