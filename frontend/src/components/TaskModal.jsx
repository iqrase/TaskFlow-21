import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { X, Plus, Save } from 'lucide-react'
import { BUTTON_CLASSES, INPUTWRAPPER } from '../assets/dummy.jsx'

const API_BASE = 'http://localhost:4001/api/tasks'

const TaskModal = ({ onClose, onSave, task }) => {

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        completed: false,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (task) {
            setFormData({
                title:       task.title || '',
                description: task.description || '',
                priority:    task.priority || 'medium',
                dueDate:     task.dueDate?.slice(0, 10) || '',
                completed:   task.completed || false,
            })
        }
    }, [task])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async () => {
        if (!formData.title.trim()) {
            setError('Title is required')
            return
        }
        try {
            setLoading(true)
            setError('')

            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }

            if (task?._id) {
                await axios.put(`${API_BASE}/${task._id}`, formData, { headers })
            } else {
                await axios.post(API_BASE, formData, { headers })
            }
            onSave()
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl shadow-xl w-full max-w-md'>

                {/* Header */}
                <div className='flex items-center justify-between p-5 border-b border-purple-100'>
                    <h2 className='text-lg font-bold text-gray-800'>
                        {task ? 'Edit Task' : 'Add New Task'}
                    </h2>
                    <button onClick={onClose}
                        className='p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors'>
                        <X className='w-5 h-5' />
                    </button>
                </div>

                {/* Body */}
                <div className='p-5 space-y-4'>

                    {error && (
                        <div className='text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>
                            {error}
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-1 block'>
                            Title <span className='text-red-500'>*</span>
                        </label>
                        <div className={INPUTWRAPPER}>
                            <input
                                type='text'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                placeholder='Enter task title...'
                                className='flex-1 text-sm outline-none text-gray-700 placeholder-gray-400'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-1 block'>
                            Description
                        </label>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            placeholder='Enter task description...'
                            rows={3}
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-700 placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-300'
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-1 block'>
                            Priority
                        </label>
                        <select
                            name='priority'
                            value={formData.priority}
                            onChange={handleChange}
                            className='w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none text-gray-700 focus:ring-2 focus:ring-purple-300'>
                            <option value='low'>Low</option>
                            <option value='medium'>Medium</option>
                            <option value='high'>High</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className='text-sm font-medium text-gray-700 mb-1 block'>
                            Due Date
                        </label>
                        <div className={INPUTWRAPPER}>
                            <input
                                type='date'
                                name='dueDate'
                                value={formData.dueDate}
                                onChange={handleChange}
                                className='flex-1 text-sm outline-none text-gray-700'
                            />
                        </div>
                    </div>

                    {/* Completed toggle edit mode only */}
                    {task && (
                        <div className='flex items-center gap-3'>
                            <input
                                type='checkbox'
                                id='completed'
                                name='completed'
                                checked={formData.completed}
                                onChange={handleChange}
                                className='w-4 h-4 accent-purple-600'
                            />
                            <label htmlFor='completed' className='text-sm font-medium text-gray-700'>
                                Mark as completed
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='flex items-center gap-3 p-5 border-t border-purple-100'>
                    <button onClick={onClose}
                        className='flex-1 py-2.5 rounded-lg border border-purple-200 text-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors'>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 ${BUTTON_CLASSES}`}>
                        {loading ? 'Saving...' : (
                            <>
                                {task ? <Save className='w-4 h-4' /> : <Plus className='w-4 h-4' />}
                                {task ? 'Save Changes' : 'Add Task'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TaskModal