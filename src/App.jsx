// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// Cek user sudah login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to = "/login" />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path='/dashboard' element={
          <Dashboard />
        }/>
        {/* Redirect ke login kalau akses root */}
        <Route path='/' element={<Navigate to="/login" />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App