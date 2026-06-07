import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Settings, ChevronDown, LogOut, Menu, Bell } from 'lucide-react'
import axios from 'axios'

const API_BASE = 'https://taskflow-l80a.onrender.com'

const Navbar = ({ user = {}, onLogout, onMenuClick }) => {
    const menuref = useRef(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const navigate = useNavigate()

    const unreadCount = notifications.filter(n => !n.read).length

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return  
            const { data } = await axios.get(`${API_BASE}/api/tasks/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) setNotifications(data.notifications)
        } catch (err) {
          console.error('Failed to fetch notifications', err)
        }
    }

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token')
            await axios.put(`${API_BASE}/api/tasks/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
        } catch (err) {
            console.error('Failed to mark as read', err)
        }
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleMenuToggle = () => setMenuOpen((prev) => !prev)

    const handleLogout = () => {
        setMenuOpen(false)
        onLogout()
    }

    return (
        <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>
            <div className='flex items-center justify-between px-3 py-2.5 md:px-6 max-w-7xl mx-auto'>

                {/* LEFT - HAMBURGER + LOGO */}
                <div className='flex items-center gap-2'>
                    <button
                        onClick={onMenuClick}
                        className='lg:hidden p-1.5 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200'>
                        <Menu className='w-5 h-5' />
                    </button>

                    <div className='flex items-center gap-1.5 cursor-pointer group'
                        onClick={() => navigate('/')}>
                        <div className='relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300'>
                            <Zap className='w-4 h-4 sm:w-6 sm:h-6 text-white' />
                            <div className='absolute -bottom-1 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-ping' />
                        </div>
                        <span className='text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent tracking-wide'>
                            TaskFlow
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className='flex items-center gap-2 sm:gap-4'>

                    {/* NOTIFICATION BELL */}
                    <div className='relative'>
                        <button
                            onClick={() => setShowNotifications(prev => !prev)}
                            className='relative p-1.5 sm:p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full'>
                            <Bell className='w-4 h-4 sm:w-5 sm:h-5' />
                            {unreadCount > 0 && (
                                <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* NOTIFICATION DROPDOWN */}
                        {showNotifications && (
                            <div className='absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden'>
                                <div className='p-3 border-b border-purple-100'>
                                    <h3 className='font-semibold text-gray-800'>Notifications</h3>
                                </div>
                                <div className='max-h-64 overflow-y-auto'>
                                    {notifications.length === 0 ? (
                                        <p className='text-sm text-gray-500 p-4 text-center'>No notifications</p>
                                    ) : (
                                        notifications.map(n => (
                                            <div
                                                key={n._id}
                                                onClick={() => markAsRead(n._id)}
                                                className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-purple-50 ${!n.read ? 'bg-purple-50/50' : ''}`}>
                                                <p className='text-sm text-gray-700'>{n.message}</p>
                                                <p className='text-xs text-gray-400 mt-1'>
                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className='p-1.5 sm:p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full'
                        onClick={() => navigate('/profile')}>
                        <Settings className='w-4 h-4 sm:w-5 sm:h-5' />
                    </button>

                    {/* USER DROPDOWN */}
                    <div ref={menuref} className='relative'>
                        <button
                            onClick={handleMenuToggle}
                            className='flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-purple-50 transition-colors duration-300 border border-transparent hover:border-purple-200'>
                            <div className='relative'>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className='w-7 h-7 sm:w-9 sm:h-9 rounded-full shadow-sm' />
                                ) : (
                                    <div className='w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md text-sm'>
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse' />
                            </div>
                            <div className='text-left hidden md:block'>
                                <p className='text-sm font-medium text-gray-800'>{user.name}</p>
                                <p className='text-xs text-gray-500 font-normal'>{user.email}</p>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {menuOpen && (
                            <ul className='absolute top-12 right-0 w-48 sm:w-56 bg-white rounded-2xl shadow-xl border border-purple-100 z-50 overflow-hidden'>
                                <li className='p-2'>
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate('/profile') }}
                                        className='w-full px-3 py-2.5 text-left hover:bg-purple-50 text-sm text-gray-700 flex items-center gap-2 rounded-lg'>
                                        <Settings className='w-4 h-4 text-gray-700 shrink-0' />
                                        Profile Settings
                                    </button>
                                </li>
                                <li className='p-2'>
                                    <button
                                        onClick={handleLogout}
                                        className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600'>
                                        <LogOut className='w-4 h-4 shrink-0' />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar

