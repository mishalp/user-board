import { useGetUsersQuery, useLogoutMutation } from "@/app/services/user"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function UserList() {
    const { data, isLoading, error } = useGetUsersQuery()
    const [logout, { isLoading: logging }] = useLogoutMutation()

    if (isLoading) return <p>loading</p>
    if (error) return <p>Something went wrong</p>

    const getLogout = async () => {
        try {
            await logout()
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="w-full bg-slate-600 flex items-center justify-between p-4">
                <h1 className="font-semibold text-white text-2xl">User list</h1>
                <Button disabled={logging} onClick={getLogout}>
                    Log Out
                </Button>
            </div>
            <div className="container mt-20 flex items-center justify-center">
                <div className="flex flex-col gap-2">
                    {data.users.map((item, i) => (
                        <div key={i} className="p-4 rounded-md shadow-md flex flex-col">
                            <p className="font-semibold">{item.name}</p>
                            <p>{item.email}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
