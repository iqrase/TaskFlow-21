import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from 'recharts'
import { TrendingUp, CheckCircle, Clock, AlertTriangle, BarChart2 } from 'lucide-react'

const API_BASE = 'https://taskflow-l80a.onrender.com/api/tasks'

const COLORS = ['#a855f7', '#22c55e', '#ef4444', '#f59e0b']

const AnalyticsPage = () => {
    const [overview, setOverview] = useState(null)
    const [weekly, setWeekly] = useState([])
    const [monthly, setMonthly] = useState([])
    const [loading, setLoading] = useState(true)

    const getToken = () => localStorage.getItem('token')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${getToken()}` }
                const [overviewRes, trendsRes] = await Promise.all([
                    axios.get(`${API_BASE}/analytics/overview`, { headers }),
                    axios.get(`${API_BASE}/analytics/trends`, { headers })
                ])
                setOverview(overviewRes.data.overview)
                setWeekly(trendsRes.data.weekly)
                setMonthly(trendsRes.data.monthly)
            } catch (err) {
                console.error('Analytics error:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className='flex items-center justify-center h-64'>
            <div className='animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full' />
        </div>
    )

    const pieData = [
        { name: 'Completed', value: overview?.completed || 0 },
        { name: 'Pending', value: overview?.pending || 0 },
        { name: 'Overdue', value: overview?.overdue || 0 },
    ]

    const priorityData = [
        { name: 'High', value: overview?.high || 0 },
        { name: 'Medium', value: overview?.medium || 0 },
        { name: 'Low', value: overview?.low || 0 },
    ]

    return (
        <div className='w-full min-w-0 p-3 sm:p-4 lg:p-6'>

            {/* HEADER */}
            <div className='mb-6'>
                <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                    <BarChart2 className='text-purple-500 w-6 h-6' />
                    Analytics Dashboard
                </h1>
                <p className='text-sm text-gray-500 mt-1 ml-8'>Track your task performance</p>
            </div>

            {/* OVERVIEW CARDS */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6'>
                {[
                    { label: 'Total Tasks', value: overview?.total, icon: BarChart2, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { label: 'Completed', value: overview?.completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Pending', value: overview?.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                    { label: 'Overdue', value: overview?.overdue, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className='bg-white rounded-xl p-4 border border-purple-100 shadow-sm'>
                        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className='text-2xl font-bold text-gray-800'>{value || 0}</p>
                        <p className='text-xs text-gray-500'>{label}</p>
                    </div>
                ))}
            </div>

            {/* CHARTS ROW 1 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>

                {/* PIE CHART */}
                <div className='bg-white rounded-xl p-4 border border-purple-100 shadow-sm'>
                    <h3 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <TrendingUp className='w-4 h-4 text-purple-500' />
                        Task Status Breakdown
                    </h3>
                    <ResponsiveContainer width='100%' height={250}>
                        <PieChart>
                            <Pie data={pieData} cx='50%' cy='50%' outerRadius={80} dataKey='value' label>
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* PRIORITY PIE */}
                <div className='bg-white rounded-xl p-4 border border-purple-100 shadow-sm'>
                    <h3 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <TrendingUp className='w-4 h-4 text-purple-500' />
                        Priority Breakdown
                    </h3>
                    <ResponsiveContainer width='100%' height={250}>
                        <PieChart>
                            <Pie data={priorityData} cx='50%' cy='50%' outerRadius={80} dataKey='value' label>
                                {priorityData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CHARTS ROW 2 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>

                {/* WEEKLY BAR CHART */}
                <div className='bg-white rounded-xl p-4 border border-purple-100 shadow-sm'>
                    <h3 className='font-semibold text-gray-800 mb-4'>Weekly Trends</h3>
                    <ResponsiveContainer width='100%' height={250}>
                        <BarChart data={weekly}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='day' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey='completed' fill='#22c55e' name='Completed' />
                            <Bar dataKey='pending' fill='#a855f7' name='Pending' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* MONTHLY LINE CHART */}
                <div className='bg-white rounded-xl p-4 border border-purple-100 shadow-sm'>
                    <h3 className='font-semibold text-gray-800 mb-4'>Monthly Trends</h3>
                    <ResponsiveContainer width='100%' height={250}>
                        <LineChart data={monthly}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='month' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='completed' stroke='#22c55e' name='Completed' />
                            <Line type='monotone' dataKey='pending' stroke='#a855f7' name='Pending' />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsPage