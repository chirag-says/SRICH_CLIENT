import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { format } from 'date-fns'
import {
    HiBell,
    HiSearch,
    HiMenu
} from 'react-icons/hi'

const Header = ({ onMenuClick }) => {
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
        <header className="sticky top-0 z-40 h-14 sm:h-16 glass-card rounded-none border-l-0 border-r-0 border-t-0 flex items-center justify-between px-3 sm:px-6">
            {/* Left Side - Menu Button & Page Title */}
            <div className="flex items-center gap-3">
                {/* Hamburger Menu - Mobile Only */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-1 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    aria-label="Open menu"
                >
                    <HiMenu className="w-5 h-5 text-[var(--color-navy-300)]" />
                </button>

                <div>
                    <h2 className="text-base sm:text-xl font-semibold">{getPageTitle()}</h2>
                    <p className="text-xs sm:text-sm text-[var(--color-navy-400)] hidden sm:block">
                        {format(new Date(), 'EEEE, MMMM d, yyyy')}
                    </p>
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search - Hidden on small mobile */}
                <div className="relative hidden sm:block">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-navy-400)]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-40 md:w-64 pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[var(--color-accent-cyan)] focus:ring-2 focus:ring-[var(--color-accent-cyan)]/20 transition-all"
                    />
                </div>

                {/* Search Icon - Mobile Only */}
                <button className="sm:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <HiSearch className="w-5 h-5 text-[var(--color-navy-300)]" />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all relative"
                        aria-label="Notifications"
                    >
                        <HiBell className="w-5 h-5 text-[var(--color-navy-300)]" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-accent-red)] rounded-full" />
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 glass-card p-3 sm:p-4 animate-fadeIn">
                            <h3 className="font-semibold mb-3 text-sm sm:text-base">Notifications</h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-start gap-3 p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="w-2 h-2 mt-2 bg-[var(--color-accent-cyan)] rounded-full flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm">Your leave request has been approved</p>
                                        <p className="text-xs text-[var(--color-navy-400)] mt-1">2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="w-2 h-2 mt-2 bg-[var(--color-accent-green)] rounded-full flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm">Clinical case #1234 has been reviewed</p>
                                        <p className="text-xs text-[var(--color-navy-400)] mt-1">Yesterday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Quick Info - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-3 pl-3 sm:pl-4 border-l border-white/10">
                    <div className="text-right">
                        <p className="text-sm font-medium truncate max-w-[120px]">{user?.name}</p>
                        <p className="text-xs text-[var(--color-navy-400)]">
                            {user?.batch} • Sem {user?.semester}
                        </p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-cyan)] to-[var(--color-accent-teal)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[var(--color-navy-950)] font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                </div>

                {/* User Avatar - Mobile Only */}
                <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-cyan)] to-[var(--color-accent-teal)] flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--color-navy-950)] font-semibold text-xs">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header
