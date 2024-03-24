import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: localStorage.getItem('token') || null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            state.token = accessToken
        },
        logOut: (state, action) => {
            state.token = null
            localStorage.setItem('token', null)
        }
    }
})

export default authSlice

export const { setCredentials, logOut } = authSlice.actions