// import React, { useEffect, useState } from 'react'
// import PendingPage from './pages/PendingPage'
// import CompletePage from './pages/CompletePage'
// import Profile from './components/Profile.jsx'
// import { Route, Routes, useNavigate, Navigate, Outlet } from 'react-router-dom'
// import Layout from './components/Layout'
// import Dashboard from './pages/Dashboard'
// import Login from './components/Login'
// import SignUp from './components/SignUp'

// const App = () => {

//   const navigate = useNavigate()
//   const [currentUser, setCurrentUser] = useState(() => {
//     const stored = localStorage.getItem('currentUser')
//     return stored ? JSON.parse(stored) : null
//   })

//   useEffect(() => {
//     if (currentUser) {
//       localStorage.setItem('currentUser', JSON.stringify(currentUser))
//     } else {
//       localStorage.removeItem('currentUser')
//     }
//   }, [currentUser])

//   const handleAuthSubmit = data => {
//     const user = {
//       email: data.email,
//       name: data.name || 'User',
//       avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
//     }

//     if (data.token) {
//       localStorage.setItem('token', data.token)
//     }

//     setCurrentUser(user)
//     navigate('/', { replace: true })
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('currentUser')
//     setCurrentUser(null)
//     navigate('/login', { replace: true })
//   }

//   const ProtectedLayout = () => {
//     return (
//       <Layout user={currentUser} onLogout={handleLogout}>
//         <Outlet />
//       </Layout>
//     )
//   }

//   return (
//     <Routes>

//       {/* AUTH ROUTES */}
//       <Route path='/login' element={
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
//           <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
//         </div>
//       } />

//       <Route path='/signup' element={
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
//           <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
//         </div>
//       } />

//       {/* PROTECTED ROUTES */}
//       <Route element={currentUser ? <ProtectedLayout /> : <Navigate to='/login' replace />}>
//         <Route path='/' element={<Navigate to='/dashboard' replace />} />
//         <Route path='/dashboard' element={<Dashboard />} />
//         <Route path='/pending' element={<PendingPage />} />
//         <Route path='/completed' element={<CompletePage />} />
//         <Route path='/profile' element={
//           <Profile
//             user={currentUser}
//             setCurrentUser={setCurrentUser}
//             onLogout={handleLogout}
//           />}
//         />
//       </Route>

//       {/* CATCH ALL */}
//       <Route path='*' element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />

//     </Routes>
//   )
// }

// export default App

import React, { useEffect, useState } from 'react'
import PendingPage from './pages/PendingPage'
import CompletePage from './pages/CompletePage'
import Profile from './components/Profile.jsx'
import { Route, Routes, useNavigate, Navigate, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import SignUp from './components/SignUp'

// ✅ Move ProtectedLayout OUTSIDE App so it never remounts
const ProtectedLayout = ({ user, onLogout }) => (
  <Layout user={user} onLogout={onLogout}>
    <Outlet />
  </Layout>
)

const App = () => {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('currentUser')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // ✅ Also check token exists — if no token, clear user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setCurrentUser(null)
      localStorage.removeItem('currentUser')
      return
    }
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
  }, [currentUser])

  const handleAuthSubmit = (data) => {
    // ✅ Handle different response shapes
    const token = data.token || data.data?.token
    const name = data.name || data.user?.name || 'User'
    const email = data.email || data.user?.email || ''

    if (token) {
      localStorage.setItem('token', token)
    } else {
      console.warn("No token received!", data)
      return // ✅ don't login if no token
    }

    const user = {
      email,
      name,
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
      {/* AUTH ROUTES */}
      <Route path='/login' element={
        currentUser
          ? <Navigate to='/dashboard' replace /> // ✅ redirect if already logged in
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

      {/* PROTECTED ROUTES */}
      <Route element={
        currentUser
          ? <ProtectedLayout user={currentUser} onLogout={handleLogout} />
          : <Navigate to='/login' replace />
      }>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/pending' element={<PendingPage />} />
        <Route path='/completed' element={<CompletePage />} />
        <Route path='/profile' element={
          <Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />
        } />
      </Route>

      {/* CATCH ALL */}
      <Route path='*' element={<Navigate to={currentUser ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App