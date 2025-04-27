import { createSelector } from "@reduxjs/toolkit";
import { User } from "@/types";
import { ToolsState } from "@/types";


export const selectUserState = (state: { toolsSlice:ToolsState, userSlice: { user: User } }) => state.userSlice;

export const selectUserData = createSelector(
    [selectUserState],
    (state: { user:User }) => state.user
)
