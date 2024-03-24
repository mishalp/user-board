import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./services/user";
import authSlice from "./features/authSlice";

export const store = configureStore({
    reducer: {
        // auth: authSlice.reducer,
        [userApi.reducerPath]: userApi.reducer,
        auth: authSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        userApi.middleware,
    )
})