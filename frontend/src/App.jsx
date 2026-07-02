import React, { useEffect, useState } from 'react'
import PendingPage from './pages/PendingPage'
import CompletePage from './pages/CompletePage'
import Profile from './components/Profile.jsx'
import { Route, Routes, useNavigate, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AnalyticsPage from './pages/AnalyticsPage'

const ProtectedLayout = ({ user, onLogout }) => (
  <Layout user={user} onLogout={onLogout}>
    <Outlet />
  </Layout>
)

const App = () => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem('token')
      const stored = localStorage.getItem('currentUser')
      
      if (token && stored) return JSON.parse(stored)
      return null
    } catch {
      return null
    }
  })

  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
  }, [currentUser])

  const handleAuthSubmit = (data) => {
    const token = data.token || data.data?.token
    const name = data.name || data.user?.name || 'User'
    const email = data.email || data.user?.email || ''

    if (!token) {
      console.warn("No token received!", data)
      return
    }

    localStorage.setItem('token', token)

    const user = { email, name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    }

    setCurrentUser(user)
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    localStorage.removeItem('userId')
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route path='/login' element={
        currentUser
          ? <Navigate to='/dashboard' replace />
          : <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
            </div>
      } />

      <Route path='/signup' element={
        currentUser
          ? <Navigate to='/dashboard' replace />
          : <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
              <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
            </div>
      } />

      <Route element={
        currentUser
          ? <ProtectedLayout user={currentUser} onLogout={handleLogout} />
          : <Navigate to='/login' replace />
      }>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/pending' element={<PendingPage />} />
        <Route path='/completed' element={<CompletePage />} />
        <Route path='/analytics' element={<AnalyticsPage />} />
        <Route path='/profile' element={
          <Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
        } />
      </Route>

      <Route path='*' element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App