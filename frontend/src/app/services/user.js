import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut, setCredentials } from '../features/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 403) {
        const refreshResult = await baseQuery('/refresh-token', api, extraOptions)
        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }))
            result = await baseQuery(args, api, extraOptions)

        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired"
            }
            return refreshResult
        }
    }
    return result
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (info) => ({
                url: 'create-user',
                method: 'POST',
                body: info,
            })
        }),
        loginUser: builder.mutation({
            query: (info) => ({
                url: 'login-user',
                method: 'POST',
                body: info,
                credentials: 'include'
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'logout-user',
                method: 'POST',
                credentials: 'include'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        refresh: builder.query({
            query: () => ({
                url: 'refresh-token',
                credentials: 'include'
            })
        }),
        getUsers: builder.query({
            query: () => ({
                url: 'get-users',
                method: 'GET',
            })
        }),
        userVerify: builder.query({
            query: () => ({
                url: 'verify',
                method: 'GET',
            })
        }),
    })
})

export const {
    useCreateUserMutation,
    useLoginUserMutation,
    useLogoutMutation,
    useRefreshQuery,
    useGetUsersQuery,
    useUserVerifyQuery,
} = userApi