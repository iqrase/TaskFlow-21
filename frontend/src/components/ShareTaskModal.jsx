import React, { useState } from 'react'
import axios from 'axios'
import { X, Share2 } from 'lucide-react'

const API_BASE = 'https://taskflow-l80a.onrender.com'

const ShareTaskModal = ({ task, onClose }) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const handleShare = async () => {
        if (!email) return
        setLoading(true)
        setMessage(null)
        try {
            const token = localStorage.getItem('token')
            const { data } = await axios.put(
                `${API_BASE}/api/tasks/${task._id}/share`,
                { email },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (data.success) {
                setMessage({ type: 'success', text: 'Task shared successfully!' })
                setEmail('')
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to share task' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-xl'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                        <Share2 className='w-5 h-5 text-purple-500' />
                        Share Task
                    </h2>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
                        <X className='w-5 h-5' />
                    </button>
                </div>

                <p className='text-sm text-gray-500 mb-4'>
                    Share <span className='font-medium text-gray-700'>"{task.title}"</span> with another user
                </p>

                <input
                    type='email'
                    placeholder='Enter user email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 mb-3'
                />

                {message && (
                    <p className={`text-sm mb-3 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message.text}
                    </p>
                )}

                <button
                    onClick={handleShare}
                    disabled={loading}
                    className='w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity'>
                    {loading ? 'Sharing...' : 'Share Task'}
                </button>
            </div>
        </div>
    )
}

export default ShareTaskModal