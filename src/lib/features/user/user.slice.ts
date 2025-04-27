import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        signIn(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        signOut(state) {
            state.user = null;
        },
    },
});

export const { signIn, signOut  } = userSlice.actions;
export default userSlice.reducer;