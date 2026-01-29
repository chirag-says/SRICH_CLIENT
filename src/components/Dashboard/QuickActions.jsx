import { Link } from 'react-router-dom'
import {
    HiPlusCircle,
    HiClock,
    HiCalendar,
    HiChartBar
} from 'react-icons/hi'

const QuickActions = () => {
    const actions = [
        {
            label: 'New Case',
            icon: HiPlusCircle,
            path: '/clinical-cases/new',
            color: 'cyan',
            description: 'Record a clinical session'
        },
        {
            label: 'Check In',
            icon: HiClock,
            path: '/attendance',
            color: 'green',
            description: 'Mark attendance'
        },
        {
            label: 'Request Leave',
            icon: HiCalendar,
            path: '/leave-requests',
            color: 'purple',
            description: 'Submit leave application'
        },
        {
            label: 'View Stats',
            icon: HiChartBar,
            path: '/statistics',
            color: 'orange',
            description: 'Weekly analytics'
        }
    ]

    const colorClasses = {
        cyan: 'hover:bg-[var(--color-accent-cyan)]/10 hover:border-[var(--color-accent-cyan)]/50',
        green: 'hover:bg-[var(--color-accent-green)]/10 hover:border-[var(--color-accent-green)]/50',
        purple: 'hover:bg-[var(--color-accent-purple)]/10 hover:border-[var(--color-accent-purple)]/50',
        orange: 'hover:bg-[var(--color-accent-orange)]/10 hover:border-[var(--color-accent-orange)]/50'
    }

    const iconColors = {
        cyan: 'text-[var(--color-accent-cyan)]',
        green: 'text-[var(--color-accent-green)]',
        purple: 'text-[var(--color-accent-purple)]',
        orange: 'text-[var(--color-accent-orange)]'
    }

    return (
        <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
                {actions.map((action) => (
                    <Link
                        key={action.path}
                        to={action.path}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-white/10 transition-all duration-300 ${colorClasses[action.color]}`}
                    >
                        <div className={`p-2 rounded-lg bg-white/5 ${iconColors[action.color]}`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{action.label}</p>
                            <p className="text-xs text-[var(--color-navy-400)]">{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default QuickActions
