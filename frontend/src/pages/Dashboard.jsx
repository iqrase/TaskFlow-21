import React, { useState, useMemo, useCallback } from 'react'
import { HomeIcon, Plus, Filter, Calendar } from 'lucide-react'
import {
    WRAPPER, ADD_BUTTON, ICON_WRAPPER, STAT_CARD, STATS,
    STATS_GRID, VALUE_CLASS, LABEL_CLASS, FILTER_WRAPPER, FILTER_LABELS,
    FILTER_OPTION, SELECT_CLASSES, TABS_WRAPPER, TAB_BASE, TAB_ACTIVE,
    TAB_INACTIVE, EMPTY_STATE
} from '../assets/dummy.jsx'
import { useOutletContext } from 'react-router-dom'
import axios from 'axios'
import TaskItem from '../components/TaskItem.jsx'
import TaskModal from '../components/TaskModal.jsx'

const API_BASE = 'http://localhost:4001/api/tasks'

const Dashboard = () => {

    const { tasks, refreshTasks } = useOutletContext()
    const [showModal, setShowModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const [filter, setFilter] = useState("all")

    const stats = useMemo(() => ({
        total: tasks.length,
        lowPriority:    tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
        mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
        highPriority:   tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
        completed: tasks.filter(t =>
            t.completed === true || t.completed === 1 ||
            (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        ).length,
    }), [tasks])

    const filteredTasks = useMemo(() => tasks.filter(task => {
        const dueDate = new Date(task.dueDate)
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)
        switch (filter) {
            case "today":  return dueDate.toDateString() === today.toDateString()
            case "week":   return dueDate >= today && dueDate <= nextWeek
            case "high":
            case "medium":
            case "low":    return task.priority?.toLowerCase() === filter
            default:       return true
        }
    }), [tasks, filter])

    const handleTaskSave = useCallback(async (taskData) => {
        try {
            if (taskData.id) await axios.put(`${API_BASE}/${taskData.id}`, taskData)
            refreshTasks()
            setShowModal(false)
            setSelectedTask(null)
        } catch (error) {
            console.error("Error saving tasks:", error)
        }
    }, [refreshTasks])

    return (
        <div className='w-full min-w-0'>
            <div className={WRAPPER}>

                {/* HEADER */}
                <div className='flex items-center justify-between gap-2 mb-4 sm:mb-5 lg:mb-6'>
                    <div className='min-w-0 flex-1'>
                        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                            <HomeIcon className='text-purple-500 w-5 h-5 sm:w-6 sm:h-6 shrink-0' />
                            <span className='truncate'>Task Overview</span>
                        </h1>
                        <p className='text-xs sm:text-sm text-gray-500 mt-1 ml-7 truncate'>
                            Manage your tasks efficiently
                        </p>
                    </div>
                    <button
                        onClick={() => { setSelectedTask(null); setShowModal(true) }}
                        className={ADD_BUTTON}>
                        <Plus size={14} />
                        <span>Add Task</span>
                    </button>
                </div>

                {/* STATS GRID */}
                <div className={STATS_GRID}>
                    {STATS.map(({ key, label, icon: Icon, iconColor, borderColor = 'border-purple-100', valueKey, textColor, gradient }) => (
                        <div key={key} className={`${STAT_CARD} ${borderColor}`}>
                            <div className='flex items-center gap-1.5 sm:gap-2'>
                                <div className={`${ICON_WRAPPER} ${iconColor}`}>
                                    <Icon className='w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5' />
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <p className={`${VALUE_CLASS} ${gradient
                                        ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent'
                                        : textColor}`}>
                                        {stats[valueKey]}
                                    </p>
                                    <p className={LABEL_CLASS}>{label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CONTENT */}
                <div className='space-y-4 mt-4 sm:mt-5 lg:mt-6'>

                    {/* FILTER ROW */}
                    <div className={FILTER_WRAPPER}>
                        <div className='flex items-center gap-2 min-w-0'>
                            <Filter className='w-4 h-4 sm:w-5 sm:h-5 text-purple-500 shrink-0' />
                            <h2 className='text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate'>
                                {FILTER_LABELS[filter]}
                            </h2>
                        </div>

                        {/* Mobile/tablet: dropdown */}
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={SELECT_CLASSES}>
                            {FILTER_OPTION.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Desktop: tab buttons */}
                        <div className={TABS_WRAPPER}>
                            {FILTER_OPTION.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setFilter(opt)}
                                    className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TASK LIST */}
                    <div className='space-y-3'>
                        {filteredTasks.length === 0 ? (
                            <div className={EMPTY_STATE.wrapper}>
                                <div className={EMPTY_STATE.iconWrapper}>
                                    <Calendar className='w-8 h-8 text-purple-500' />
                                </div>
                                <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-2'>No tasks found</h3>
                                <p className='text-xs sm:text-sm text-gray-500 mb-4'>
                                    {filter === "all" ? "Create your first task to get started" : "No tasks match this filter"}
                                </p>
                                <button
                                    onClick={() => { setSelectedTask(null); setShowModal(true) }}
                                    className={EMPTY_STATE.btn}>
                                    Add New Task
                                </button>
                            </div>
                        ) : (
                            filteredTasks.map(task => (
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

                    {/* ADD TASK — mobile/tablet */}
                    <button
                        onClick={() => { setSelectedTask(null); setShowModal(true) }}
                        className='lg:hidden w-full flex items-center justify-center p-3 border border-dashed border-purple-200 rounded-xl hover:border-purple-400 bg-purple-50/50 transition-colors'>
                        <Plus className='w-4 h-4 text-purple-500 mr-2' />
                        <span className='text-sm text-gray-600 font-medium'>Add New Task</span>
                    </button>

                    {/* ADD TASK — desktop */}
                    <div
                        onClick={() => { setSelectedTask(null); setShowModal(true) }}
                        className='hidden lg:flex items-center justify-center p-4 border border-dashed border-purple-200 rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors'>
                        <Plus className='w-5 h-5 text-purple-500 mr-2' />
                        <span className='text-gray-600 font-medium'>Add New Task</span>
                    </div>
                </div>
            </div>

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

export default Dashboard