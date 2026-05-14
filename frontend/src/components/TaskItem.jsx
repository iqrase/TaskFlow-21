import React, { useState } from 'react'
import axios from 'axios'
import { Trash2, Edit, CheckCircle, Circle, Calendar, Flag } from 'lucide-react'

const API_BASE = 'http://localhost:4001/api/tasks'

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
        <div className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3 transition-all duration-200 hover:shadow-md ${
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
                <div className='flex items-start justify-between gap-2'>
                    <h3 className={`font-semibold text-gray-800 truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
                        {task.title}
                    </h3>
                    <div className='flex items-center gap-1 shrink-0'>
                        <button onClick={() => onEdit(task)} disabled={loading}
                            className='p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors'>
                            <Edit className='w-4 h-4' />
                        </button>
                        <button onClick={handleDelete} disabled={loading}
                            className='p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors'>
                            <Trash2 className='w-4 h-4' />
                        </button>
                    </div>
                </div>

                {task.description && (
                    <p className='text-sm text-gray-500 mt-1 line-clamp-2'>{task.description}</p>
                )}

                <div className='flex items-center gap-3 mt-2 flex-wrap'>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                        <Flag className='w-3 h-3' />
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>
                    <span className='inline-flex items-center gap-1 text-xs text-gray-400'>
                        <Calendar className='w-3 h-3' />
                        {formatDate(task.dueDate)}
                    </span>
                    {task.completed && (
                        <span className='inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-600'>
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