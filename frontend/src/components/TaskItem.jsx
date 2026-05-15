import React, { useState } from 'react'
import axios from 'axios'
import { Trash2, Edit, CheckCircle, Circle, Calendar, Flag } from 'lucide-react'

const API_BASE = 'https://taskflow-l80a.onrender.com/api/tasks'

const TaskItem = ({ task, onRefresh, onEdit, showCompleteCheckbox }) => {

    const [loading, setLoading] = useState(false)

    const priorityStyles = {
        high:   { badge: 'bg-red-100 text-red-600' },
        medium: { badge: 'bg-yellow-100 text-yellow-600' },
        low:    { badge: 'bg-green-100 text-green-600' },
    }

    const priority = task.priority?.toLowerCase() || 'low'
    const style = priorityStyles[priority] || priorityStyles.low

    const getToken = () => localStorage.getItem('token')

    const handleDelete = async () => {
        if (!window.confirm('Delete this task?')) return
        try {
            setLoading(true)
            await axios.delete(`${API_BASE}/${task._id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            })
            onRefresh()
        } catch (err) {
            console.error('Delete error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleComplete = async () => {
        try {
            setLoading(true)
            await axios.put(`${API_BASE}/${task._id}`, {
                ...task,
                completed: !task.completed
            }, {
                headers: { Authorization: `Bearer ${getToken()}` }
            })
            onRefresh()
        } catch (err) {
            console.error('Toggle error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'No due date'
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        })
    }

    return (
        // ✅ FIX: p-3 on mobile, p-4 on larger; overflow-hidden prevents any child overflow
        <div className={`bg-white rounded-xl border shadow-sm p-3 sm:p-4 flex items-start gap-2 sm:gap-3 transition-all duration-200 hover:shadow-md overflow-hidden ${
            task.completed ? 'opacity-60 border-gray-100' : 'border-purple-100'
        }`}>

            {/* Checkbox */}
            {showCompleteCheckbox && (
                <button onClick={handleToggleComplete} disabled={loading}
                    className='mt-0.5 shrink-0 text-purple-500 hover:text-purple-700 transition-colors'>
                    {task.completed
                        ? <CheckCircle className='w-5 h-5 text-green-500' />
                        : <Circle className='w-5 h-5' />
                    }
                </button>
            )}

            {/* Content */}
            <div className='flex-1 min-w-0'>

                {/* Title row */}
                <div className='flex items-start justify-between gap-1.5'>
                    {/* ✅ FIX: min-w-0 + break-words so long titles wrap instead of overflow */}
                    <h3 className={`font-semibold text-gray-800 text-sm sm:text-base break-words     min-w-0 flex-1 ${
                        task.completed ? 'line-through text-gray-400' : ''
                    }`}>
                        {task.title}
                    </h3>

                    {/* ✅ FIX: action buttons always visible, shrink-0 keeps them from squishing */}
                    <div className='flex items-center gap-0.5 shrink-0 ml-1'>
                        <button onClick={() => onEdit(task)} disabled={loading}
                            className='p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors'>
                            <Edit className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                        </button>
                        <button onClick={handleDelete} disabled={loading}
                            className='p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors'>
                            <Trash2 className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                        </button>
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <p className='text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 break-words'>
                        {task.description}
                    </p>
                )}

                {/* ✅ FIX: badges wrap cleanly on mobile */}
                <div className='flex items-center gap-2 mt-2 flex-wrap'>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${style.badge}`}>
                        <Flag className='w-3 h-3' />
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                    <span className='inline-flex items-center gap-1 text-xs text-gray-400 shrink-0'>
                        <Calendar className='w-3 h-3' />
                        {formatDate(task.dueDate)}
                    </span>
                    {task.completed && (
                        <span className='inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-600 shrink-0'>
                            <CheckCircle className='w-3 h-3' />
                            Completed
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskItem