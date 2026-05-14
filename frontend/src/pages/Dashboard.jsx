import React, { useState, useMemo, useCallback } from 'react'
import { HomeIcon, Plus, Filter, Calendar, Clock, BarChart2 } from 'lucide-react'
import {
    HEADER, WRAPPER, ADD_BUTTON, ICON_WRAPPER, STAT_CARD, STATS,
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
        lowPriority: tasks.filter(t => t.priority?.toLowerCase() === 'low').length,
        mediumPriority: tasks.filter(t => t.priority?.toLowerCase() === 'medium').length,
        highPriority: tasks.filter(t => t.priority?.toLowerCase() === 'high').length,
        completed: tasks.filter(t =>
            t.completed === true || t.completed === 1 ||
            (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
        ).length,
    }), [tasks])

    const filteredTasks = useMemo(() => tasks.filter(task => {
        const dueDate = new Date(task.dueDate)
        const today = new Date()
        const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7)
        switch (filter) {
            case "today":
                return dueDate.toDateString() === today.toDateString()
            case "week":
                return dueDate >= today && dueDate <= nextWeek
            case "high":
            case "medium":
            case "low":
                return task.priority?.toLowerCase() === filter
            default:
                return true
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

    const completionRate = stats.total > 0
        ? Math.round((stats.completed / stats.total) * 100)
        : 0

    return (
        <div className="flex gap-6">

            {/* LEFT - MAIN CONTENT */}
            <div className={`${WRAPPER} flex-1 min-w-0`}>

                {/* Header */}
                <div className={HEADER}>
                    <div className='min-w-0'>
                        <h1 className='text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2'>
                            <HomeIcon className='text-purple-500 w-5 h-5 md:w-6 md:h-6 shrink-0' />
                            <span className='truncate'>Task Overview</span>
                        </h1>
                        <p className='text-sm text-gray-500 mt-1 ml-7 truncate'>Manage your tasks efficiently</p>
                    </div>
                    <button onClick={() => { setSelectedTask(null); setShowModal(true) }} className={ADD_BUTTON}>
                        <Plus size={18} />
                        Add New Task
                    </button>
                </div>

                {/* STATS */}
                <div className={STATS_GRID}>
                    {STATS.map(({
                        key, label, icon: Icon, iconColor, borderColor = "border-purple-100",
                        valueKey, textColor, gradient
                    }) => (
                        <div key={key} className={`${STAT_CARD} ${borderColor}`}>
                            <div className='flex items-center gap-2 md:gap-3'>
                                <div className={`${ICON_WRAPPER} ${iconColor}`}>
                                    <Icon className='w-4 h-4 md:w-5 md:h-5' />
                                </div>
                                <div className='min-w-0'>
                                    <p className={`${VALUE_CLASS} ${gradient
                                        ? "bg-linear-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent"
                                        : textColor}`}>{stats[valueKey]}</p>
                                    <p className={LABEL_CLASS}>{label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CONTENTS */}
                <div className='space-y-6 mt-6'>

                    {/* FILTER */}
                    <div className={FILTER_WRAPPER}>
                        <div className='flex items-center gap-2 min-w-0'>
                            <Filter className='w-5 h-5 text-purple-500 shrink-0' />
                            <h2 className='text-base md:text-lg font-semibold text-gray-800 truncate'>
                                {FILTER_LABELS[filter]}
                            </h2>
                        </div>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}
                            className={SELECT_CLASSES}>
                            {FILTER_OPTION.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                            ))}
                        </select>
                        <div className={TABS_WRAPPER}>
                            {FILTER_OPTION.map(opt => (
                                <button key={opt} onClick={() => setFilter(opt)}
                                    className={`${TAB_BASE} ${filter === opt ? TAB_ACTIVE : TAB_INACTIVE}`}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TASK LIST */}
                    <div className='space-y-4'>
                        {filteredTasks.length === 0 ? (
                            <div className={EMPTY_STATE.wrapper}>
                                <div className={EMPTY_STATE.iconWrapper}>
                                    <Calendar className='w-8 h-8 text-purple-500' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                                    No tasks found
                                </h3>
                                <p className='text-sm text-gray-500 mb-4'>
                                    {filter === "all" ? "Create your first task to get started" : "No tasks match this filter"}
                                </p>
                                <button onClick={() => { setSelectedTask(null); setShowModal(true) }} className={EMPTY_STATE.btn}>
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

                    {/* ADD TASK DESKTOP */}
                    <div
                        onClick={() => { setSelectedTask(null); setShowModal(true) }}
                        className='hidden md:flex items-center justify-center p-4 border border-dashed border-purple-200 rounded-xl hover:border-purple-400 bg-purple-50/50 cursor-pointer transition-colors'>
                        <Plus className='w-5 h-5 text-purple-500 mr-2' />
                        <span className='text-gray-600 font-medium'>Add New Task</span>
                    </div>
                </div>
            </div>

            {/* RIGHT - STATS PANEL */}
            <div className="hidden lg:flex flex-col gap-4 w-72 shrink-0 pt-6 pr-6">

                {/* Task Statistics */}
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <BarChart2 className="w-4 h-4 text-purple-500" />
                        Task Statistics
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-purple-100">
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Total Tasks</p>
                        </div>
                        <div className="p-3 rounded-xl border border-green-100">
                            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Completed</p>
                        </div>
                        <div className="p-3 rounded-xl border border-yellow-100">
                            <p className="text-2xl font-bold text-yellow-500">{stats.total - stats.completed}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Pending</p>
                        </div>
                        <div className="p-3 rounded-xl border border-purple-100">
                            <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
                            <p className="text-xs text-gray-500 mt-0.5">Completion Rate</p>
                        </div>
                    </div>
                </div>

                {/* Task Progress */}
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        Task Progress
                        <span className="ml-auto text-xs text-gray-400">
                            {stats.completed}/{stats.total}
                        </span>
                    </h2>
                    <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-fuchsia-500 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-right">{completionRate}%</p>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-purple-500" />
                        Recent Activity
                    </h2>
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Clock className="w-10 h-10 text-purple-200 mb-3" />
                            <p className="text-sm text-gray-500">No recent activity</p>
                            <p className="text-xs text-gray-400 mt-1">Tasks will appear here</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {tasks.slice(0, 5).map(task => (
                                <li key={task._id} className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                                        task.priority?.toLowerCase() === 'high' ? 'bg-red-400' :
                                        task.priority?.toLowerCase() === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                                    }`} />
                                    <p className="text-sm text-gray-600 truncate">{task.title}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* TASK MODAL */}
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
