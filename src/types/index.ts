export interface ITool {
    name: string;
    description: string;
    slug: string;
    category: string;
    categorySlug: string;
    stars: number;
}

export interface ToolsState {
    tools: ITool[];
    loading: boolean;
    error: null | string;
}