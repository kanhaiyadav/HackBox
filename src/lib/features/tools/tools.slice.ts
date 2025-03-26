import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITool, ToolsState } from "@/types";



const initialState:ToolsState = {
    tools: [],
    loading: true,
    error: null,
};

const toolsSlice = createSlice({
    name: "toolsSlice",
    initialState,
    reducers: {
        setTools(state, action: PayloadAction<ITool[]>) {
            state.tools = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        }
    },
});

export const { setTools, setLoading } = toolsSlice.actions;
export default toolsSlice.reducer;