import { configureStore } from "@reduxjs/toolkit";
import toolReducer from "./features/tools/tools.slice";
import userReducer from "./features/user/user.slice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            toolsSlice: toolReducer,
            userSlice: userReducer,
        },
    });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
