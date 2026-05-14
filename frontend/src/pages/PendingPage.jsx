import React, { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Clock, Filter, Calendar } from 'lucide-react'
import TaskItem from '../components/TaskItem.jsx'
import TaskModal from '../components/TaskModal.jsx'
import {
    WRAPPER, HEADER, ADD_BUTTON,
    TABS_WRAPPER, TAB_BASE, TAB_ACTIVE, TAB_INACTIVE,
    SELECT_CLASSES, EMPTY_STATE
} from '../assets/dummy.jsx'
import { Plus } from 'lucide-react'

const PendingPage = () => {

    const { tasks, refreshTasks } = useOutletContext()
    const [showModal, setShowModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [filter, setFilter] = useState('all')

    const FILTER_OPTIONS = ['all', 'high', 'medium', 'low']

    const pendingTasks = useMemo(() => {
        const onlyPending = tasks.filter(t =>
            t.completed !== true &&
            t.completed !== 1 &&
            !(typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        )
        if (filter === 'all') return onlyPending
        return onlyPending.filter(t => t.priority?.toLowerCase() === filter)
    }, [tasks, filter])

    const stats = useMemo(() => ({
        total:  tasks.filter(t => t.completed !== true).length,
        high:   pendingTasks.filter(t => t.priority?.toLowerCase() === 'high').length,
        medium: pendingTasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
        low:    pendingTasks.filter(t => t.priority?.toLowerCase() === 'low').length,
    }), [tasks, pendingTasks])

    return (
        <div className={WRAPPER}>

            {/* Header */}
            <div className={HEADER}>
                <div className='min-w-0'>
                    <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                        <Clock className='text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
                        <span className='truncate'>Pending Tasks</span>
                    </h1>
                    <p className='text-sm text-gray-500 mt-1 ml-7'>
                        {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} remaining
                    </p>
                </div>
                <button onClick={() => { setSelectedTask(null); setShowModal(true) }}
                    className={ADD_BUTTON}>
                    <Plus size={18} />
                    Add New Task
                </button>
            </div>

            {/* Stat Pills */}
            <div className='flex flex-wrap gap-3 mb-6'>
                <div className='px-4 py-2 rounded-xl bg-purple-50 border border-purple-100'>
                    <span className='text-sm font-semibold text-purple-700'>{stats.total}</span>
                    <span className='text-xs text-purple-500 ml-1'>Total Pending</span>
                </div>
                <div className='px-4 py-2 rounded-xl bg-red-50 border border-red-100'>
                    <span className='text-sm font-semibold text-red-600'>{stats.high}</span>
                    <span className='text-xs text-red-400 ml-1'>High</span>
                </div>
                <div className='px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-100'>
                    <span className='text-sm font-semibold text-yellow-600'>{stats.medium}</span>
                    <span className='text-xs text-yellow-400 ml-1'>Medium</span>
                </div>
                <div className='px-4 py-2 rounded-xl bg-green-50 border border-green-100'>
                    <span className='text-sm font-semibold text-green-600'>{stats.low}</span>
                    <span className='text-xs text-green-400 ml-1'>Low</span>
                </div>
            </div>

            {/* Filter */}
            <div className='flex flex-wrap items-center justify-between gap-3 mb-6'>
                <div className='flex items-center gap-2'>
                    <Filter className='w-5 h-5 text-purple-500' />
                    <h2 className='text-base md:text-lg font-semibold text-gray-800'>
                        {filter === 'all' ? 'All Pending' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
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
                {pendingTasks.length === 0 ? (
                    <div className={EMPTY_STATE.wrapper}>
                        <div className={EMPTY_STATE.iconWrapper}>
                            <Calendar className='w-8 h-8 text-purple-500' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                            No pending tasks
                        </h3>
                        <p className='text-sm text-gray-500 mb-4'>
                            {filter === 'all'
                                ? 'You are all caught up! Add a new task to get started'
                                : `No pending ${filter} priority tasks`}
                        </p>
                        <button onClick={() => { setSelectedTask(null); setShowModal(true) }}
                            className={EMPTY_STATE.btn}>
                            Add New Task
                        </button>
                    </div>
                ) : (
                    pendingTasks.map(task => (
                        <TaskItem
                            key={task._id || task.id}
                            task={task}
                            onRefresh={refreshTasks}
                            showCompleteCheckbox={true}
                            onEdit={() => { setSelectedTask(task); setShowModal(true) }}
                        />
                    ))
                )}
            </div>

            {/* Task Modal */}
            {showModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={() => { setShowModal(false); setSelectedTask(null) }}
                    onSave={refreshTasks}
                />
            )}

        </div>
    )
}

export default PendingPage