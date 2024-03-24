import { useUserVerifyQuery } from '@/app/services/user'
import { Navigate, useNavigate } from 'react-router-dom'

export default function UnProtected({ children }) {

  const { isLoading, isError } = useUserVerifyQuery()

  if (isLoading) {
    return <p>Loading</p>
  } else {
    if (!isError) return <Navigate to='/' />
    return children
  }
}
