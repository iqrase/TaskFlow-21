import { CheckSquare, BarChart2, ListTodo, LayoutDashboard, CheckCircle, Flame } from 'lucide-react'

export const SIDEBAR_CLASSES = {
    desktop: 'fixed left-0 top-16 h-screen w-64 bg-white border-r border-purple-200 shadow-lg hidden lg:block z-40',
    mobileButton: 'fixed top-4 left-4 z-50 lg:hidden bg-white border border-purple-200 rounded-lg p-2 shadow-md',
    mobileDrawerBackdrop: 'absolute inset-0 bg-black/40 backdrop-blur-sm',
    mobileDrawer: 'absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-5 overflow-y-auto',
}

export const PRODUCTIVITY_CARD = {
    container: 'p-3 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 border border-purple-100',
    header: 'flex items-center justify-between mb-2',
    label: 'text-xs font-semibold text-purple-600 tracking-wide',
    badge: 'text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full',
    barBg: 'h-2 bg-purple-100 rounded-full overflow-hidden',
    barFg: 'h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full transition-all duration-500',
}

export const BUTTON_CLASSES = 'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60'

export const INPUTWRAPPER = 'flex items-center border border-gray-200 rounded-lg px-3 py-2'

export const LINK_CLASSES = {
    base: 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
    active: 'bg-purple-100 text-purple-700',
    inactive: 'text-gray-600 hover:bg-purple-50 hover:text-purple-600',
    icon: 'w-5 h-5 flex-shrink-0',
    text: 'truncate',
}

export const TIP_CARD = {
    container: 'p-4 rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100',
    iconWrapper: 'w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0',
    title: 'text-sm font-semibold text-purple-700',
    text: 'text-xs text-purple-500 mt-0.5',
}

export const menuItems = [
    { text: 'Dashboard',       path: '/dashboard',  icons: <LayoutDashboard className="w-5 h-5" /> },
    { text: 'Pending Tasks',   path: '/pending',    icons: <CheckSquare className="w-5 h-5" /> },
    { text: 'Completed Tasks', path: '/completed',  icons: <CheckCircle className="w-5 h-5" /> },
]

export const BACK_BUTTON = 'flex items-center text-purple-600 hover:text-purple-800 mb-6 font-medium'

export const HEADER = 'flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6'


export const WRAPPER = 'px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5 w-full'

// Add Task button
export const ADD_BUTTON = 'flex items-center gap-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-xs sm:text-sm whitespace-nowrap shrink-0'


export const STATS_GRID = 'grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full'


export const STAT_CARD = 'p-2 sm:p-3 lg:p-4 rounded-xl bg-white border shadow-sm min-w-0'

export const ICON_WRAPPER = 'w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shrink-0'
export const VALUE_CLASS = 'text-lg sm:text-xl lg:text-2xl font-bold leading-tight'
export const LABEL_CLASS = 'text-xs text-gray-500 mt-0.5 truncate'

// Filter
export const FILTER_WRAPPER = 'flex flex-wrap items-center justify-between gap-2 sm:gap-3'
export const FILTER_LABELS = {
    all: 'All Tasks',
    today: "Today's Tasks",
    week: 'This Week',
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
}
export const FILTER_OPTION = ['all', 'today', 'week', 'high', 'medium', 'low']


export const SELECT_CLASSES = 'text-xs sm:text-sm border border-purple-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 lg:hidden'


export const TABS_WRAPPER = 'hidden lg:flex items-center gap-1 flex-wrap'
export const TAB_BASE = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200'
export const TAB_ACTIVE = 'bg-purple-100 text-purple-700'
export const TAB_INACTIVE = 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'

export const EMPTY_STATE = {
    wrapper: 'flex flex-col items-center justify-center py-10 sm:py-16 text-center',
    iconWrapper: 'w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-3 sm:mb-4',
    btn: 'flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm',
}

export const STATS = [
    {
        key: 'total',
        label: 'Total Tasks',
        icon: ListTodo,
        iconColor: 'bg-purple-100 text-purple-600',
        borderColor: 'border-purple-100',
        valueKey: 'total',
        gradient: true,
    },
    {
        key: 'low',
        label: 'Low Priority',
        icon: CheckCircle,
        iconColor: 'bg-green-100 text-green-600',
        borderColor: 'border-green-100',
        valueKey: 'lowPriority',
        textColor: 'text-green-600',
    },
    {
        key: 'medium',
        label: 'Medium Priority',
        icon: BarChart2,
        iconColor: 'bg-yellow-100 text-yellow-500',
        borderColor: 'border-yellow-100',
        valueKey: 'mediumPriority',
        textColor: 'text-yellow-500',
    },
    {
        key: 'high',
        label: 'High Priority',
        icon: Flame,
        iconColor: 'bg-red-100 text-red-500',
        borderColor: 'border-red-100',
        valueKey: 'highPriority',
        textColor: 'text-red-500',
    },
]

export const menuItems = [
    { text: 'Dashboard',       path: '/dashboard',  icons: <LayoutDashboard className="w-5 h-5" /> },
    { text: 'Pending Tasks',   path: '/pending',    icons: <CheckSquare className="w-5 h-5" /> },
    { text: 'Completed Tasks', path: '/completed',  icons: <CheckCircle className="w-5 h-5" /> },
    { text: 'Analytics',       path: '/analytics',  icons: <BarChart2 className="w-5 h-5" /> },  // ✅ here
]