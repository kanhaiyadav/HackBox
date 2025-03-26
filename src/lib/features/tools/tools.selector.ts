import { createSelector } from "@reduxjs/toolkit";
import { ITool, ToolsState } from "@/types";


export const selectToolsState = (state: { toolsSlice: ToolsState }) => state.toolsSlice;
export const selectAllTools = createSelector(
    [selectToolsState],
    (state: ToolsState) => state.tools
)
// export const selectAllTools = (state: { toolsSlice: ToolsState }) => state.toolsSlice.tools;
export const selectToolsByCategory = (category: string) => createSelector(
    [selectAllTools],
    (tools: ITool[]) => tools.filter((tool) => tool.category === category)
)

export const selectToolLoading = createSelector(
    [selectToolsState],
    (state: ToolsState) => state.loading
)

