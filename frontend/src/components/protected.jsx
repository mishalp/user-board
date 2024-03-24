import { useUserVerifyQuery } from '@/app/services/user'
import { Navigate, } from 'react-router-dom'

export default function Protected({ children }) {

    const { isLoading, isError } = useUserVerifyQuery()

    if (isLoading) {
        return <p>Loading</p>
    } else {
        if (!isError) return children
        return <Navigate to='/login' />
    }
}
