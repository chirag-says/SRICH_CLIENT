import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
    HiHome,
    HiClipboardList,
    HiClock,
    HiCalendar,
    HiChartBar,
    HiUser,
    HiLogout,
    HiAcademicCap,
    HiX
} from 'react-icons/hi'

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuthStore()

    const navItems = [
        { path: '/dashboard', icon: HiHome, label: 'Dashboard' },
        { path: '/clinical-cases', icon: HiClipboardList, label: 'Clinical Cases' },
        { path: '/attendance', icon: HiClock, label: 'Attendance' },
        { path: '/leave-requests', icon: HiCalendar, label: 'Leave Requests' },
        { path: '/statistics', icon: HiChartBar, label: 'Statistics' },
        { path: '/profile', icon: HiUser, label: 'Profile' },
    ]

    return (
        <aside
            className={`
                fixed left-0 top-0 h-screen w-64 glass-card rounded-none border-r border-l-0 border-t-0 border-b-0 
                flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}
        >
            {/* Logo Section */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[var(--color-accent-cyan)] to-[var(--color-accent-teal)] flex items-center justify-center flex-shrink-0">
                        <HiAcademicCap className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-navy-950)]" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold gradient-text">SRISH</h1>
                        <p className="text-xs text-[var(--color-navy-400)]">Clinical Logbook</p>
                    </div>
                </div>
                {/* Close button - mobile only */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close sidebar"
                >
                    <HiX className="w-5 h-5 text-[var(--color-navy-300)]" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-3 sm:p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-pink)] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-[var(--color-navy-400)] truncate">
                            {user?.role || 'Student'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-white/5 text-[var(--color-accent-red)] hover:bg-[var(--color-accent-red)]/10 transition-all duration-300"
                >
                    <HiLogout className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
