import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { format } from 'date-fns'
import {
    HiBell,
    HiSearch,
    HiSun,
    HiMoon
} from 'react-icons/hi'

const Header = () => {
    const location = useLocation()
    const { user } = useAuthStore()
    const [showNotifications, setShowNotifications] = useState(false)

    // Get page title from route
    const getPageTitle = () => {
        const path = location.pathname.split('/')[1]
        const titles = {
            dashboard: 'Dashboard',
            'clinical-cases': 'Clinical Cases',
            attendance: 'Attendance',
            'leave-requests': 'Leave Requests',
            statistics: 'Statistics',
            profile: 'Profile',
        }
        return titles[path] || 'Dashboard'
    }

    return (
        <header className="sticky top-0 z-40 h-16 glass-card rounded-none border-l-0 border-r-0 border-t-0 flex items-center justify-between px-6">
            {/* Page Title & Breadcrumb */}
            <div>
                <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
                <p className="text-sm text-[var(--color-navy-400)]">
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-navy-400)]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[var(--color-accent-cyan)] focus:ring-2 focus:ring-[var(--color-accent-cyan)]/20 transition-all"
                    />
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all relative"
                    >
                        <HiBell className="w-5 h-5 text-[var(--color-navy-300)]" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-accent-red)] rounded-full" />
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 glass-card p-4 animate-fadeIn">
                            <h3 className="font-semibold mb-3">Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="w-2 h-2 mt-2 bg-[var(--color-accent-cyan)] rounded-full" />
                                    <div>
                                        <p className="text-sm">Your leave request has been approved</p>
                                        <p className="text-xs text-[var(--color-navy-400)] mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="w-2 h-2 mt-2 bg-[var(--color-accent-green)] rounded-full" />
                                    <div>
                                        <p className="text-sm">Clinical case #1234 has been reviewed</p>
                                        <p className="text-xs text-[var(--color-navy-400)] mt-1">Yesterday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Quick Info */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-[var(--color-navy-400)]">
                            {user?.batch} • Sem {user?.semester}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-cyan)] to-[var(--color-accent-teal)] flex items-center justify-center">
                        <span className="text-[var(--color-navy-950)] font-semibold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
