import React, { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CheckCircle, Filter, Calendar, Trash2 } from 'lucide-react'
import TaskItem from '../components/TaskItem.jsx'
import {
    WRAPPER, HEADER,
    TABS_WRAPPER, TAB_BASE, TAB_ACTIVE, TAB_INACTIVE,
    SELECT_CLASSES, EMPTY_STATE
} from '../assets/dummy.jsx'

const CompletePage = () => {

    const { tasks, refreshTasks } = useOutletContext()
    const [filter, setFilter] = useState('all')

    const FILTER_OPTIONS = ['all', 'high', 'medium', 'low']

    const completedTasks = useMemo(() => {
        const onlyCompleted = tasks.filter(t =>
            t.completed === true ||
            t.completed === 1 ||
            (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        )
        if (filter === 'all') return onlyCompleted
        return onlyCompleted.filter(t => t.priority?.toLowerCase() === filter)
    }, [tasks, filter])

    const stats = useMemo(() => ({
        total:  tasks.filter(t =>
            t.completed === true || t.completed === 1 ||
            (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        ).length,
        high:   completedTasks.filter(t => t.priority?.toLowerCase() === 'high').length,
        medium: completedTasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
        low:    completedTasks.filter(t => t.priority?.toLowerCase() === 'low').length,
    }), [tasks, completedTasks])

    const completionRate = useMemo(() => {
        return tasks.length > 0
            ? Math.round((stats.total / tasks.length) * 100)
            : 0
    }, [tasks, stats])

    return (
        <div className={WRAPPER}>

            {/* Header */}
            <div className={HEADER}>
                <div className='min-w-0'>
                    <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                        <CheckCircle className='text-green-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
                        <span className='truncate'>Completed Tasks</span>
                    </h1>
                    <p className='text-sm text-gray-500 mt-1 ml-7'>
                        {stats.total} task{stats.total !== 1 ? 's' : ''} completed
                    </p>
                </div>
            </div>

            {/* Stat Pills */}
            <div className='flex flex-wrap gap-3 mb-6'>
                <div className='px-4 py-2 rounded-xl bg-green-50 border border-green-100'>
                    <span className='text-sm font-semibold text-green-700'>{stats.total}</span>
                    <span className='text-xs text-green-500 ml-1'>Total Completed</span>
                </div>
                <div className='px-4 py-2 rounded-xl bg-red-50 border border-red-100'>
                    <span className='text-sm font-semibold text-red-600'>{stats.high}</span>
                    <span className='text-xs text-red-400 ml-1'>High</span>
                </div>
                <div className='px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-100'>
                    <span className='text-sm font-semibold text-yellow-600'>{stats.medium}</span>
                    <span className='text-xs text-yellow-400 ml-1'>Medium</span>
                </div>
                <div className='px-4 py-2 rounded-xl bg-purple-50 border border-purple-100'>
                    <span className='text-sm font-semibold text-purple-600'>{stats.low}</span>
                    <span className='text-xs text-purple-400 ml-1'>Low</span>
                </div>
            </div>

            {/* Completion Rate Bar */}
            <div className='bg-white rounded-xl border border-green-100 shadow-sm p-4 mb-6'>
                <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium text-gray-700'>Overall Completion Rate</span>
                    <span className='text-sm font-bold text-green-600'>{completionRate}%</span>
                </div>
                <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                        className='h-full bg-linear-to-r from-green-400 to-green-600 rounded-full transition-all duration-500'
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
                <p className='text-xs text-gray-400 mt-2'>
                    {stats.total} of {tasks.length} tasks completed
                </p>
            </div>

            {/* Filter */}
            <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
                <div className='flex items-center gap-2'>
                    <Filter className='w-5 h-5 text-green-500' />
                    <h2 className='text-base md:text-lg font-semibold text-gray-800'>
                        {filter === 'all' ? 'All Completed' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
                    </h2>
                </div>

                {/* Mobile select */}
                <select value={filter} onChange={e => setFilter(e.target.value)}
                    className={SELECT_CLASSES}>
                    {FILTER_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                    ))}
                </select>

                {/* Desktop tabs */}
                <div className={TABS_WRAPPER}>
                    {FILTER_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setFilter(opt)}
                            className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            <div className='space-y-4'>
                {completedTasks.length === 0 ? (
                    <div className={EMPTY_STATE.wrapper}>
                        <div className={EMPTY_STATE.iconWrapper}>
                            <Calendar className='w-8 h-8 text-green-500' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                            No completed tasks
                        </h3>
                        <p className='text-sm text-gray-500 mb-4'>
                            {filter === 'all'
                                ? 'Complete a task to see it here'
                                : `No completed ${filter} priority tasks`}
                        </p>
                    </div>
                ) : (
                    completedTasks.map(task => (
                        <TaskItem
                            key={task._id || task.id}
                            task={task}
                            onRefresh={refreshTasks}
                            showCompleteCheckbox={true}
                            onEdit={() => {}}
                        />
                    ))
                )}
            </div>

        </div>
    )
}

export default CompletePage