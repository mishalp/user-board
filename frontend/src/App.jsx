import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import UserList from './pages/UserList'
import Protected from './components/protected'
import UnProtected from './components/unProtected'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<UnProtected><Signup /></UnProtected>} />
        <Route path='/login' element={<UnProtected><Login /></UnProtected>} />
        <Route path='/' element={<Protected><UserList /></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
