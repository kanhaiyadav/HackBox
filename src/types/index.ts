export interface ITool {
    name: string;
    description: string;
    warnings: string[];
    slug: string;
    category: string;
    categorySlug: string;
    stars: number;
    tags: string[];
}

export interface ToolsState {
    tools: ITool[];
    loading: boolean;
    error: null | string;
}