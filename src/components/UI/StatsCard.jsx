const StatsCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendUp = null,
    color = 'cyan'
}) => {
    const colors = {
        cyan: {
            bg: 'from-[var(--color-accent-cyan)]/20 to-[var(--color-accent-cyan)]/5',
            icon: 'bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)]',
            text: 'text-[var(--color-accent-cyan)]'
        },
        teal: {
            bg: 'from-[var(--color-accent-teal)]/20 to-[var(--color-accent-teal)]/5',
            icon: 'bg-[var(--color-accent-teal)]/20 text-[var(--color-accent-teal)]',
            text: 'text-[var(--color-accent-teal)]'
        },
        purple: {
            bg: 'from-[var(--color-accent-purple)]/20 to-[var(--color-accent-purple)]/5',
            icon: 'bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)]',
            text: 'text-[var(--color-accent-purple)]'
        },
        yellow: {
            bg: 'from-[var(--color-accent-yellow)]/20 to-[var(--color-accent-yellow)]/5',
            icon: 'bg-[var(--color-accent-yellow)]/20 text-[var(--color-accent-yellow)]',
            text: 'text-[var(--color-accent-yellow)]'
        },
        green: {
            bg: 'from-[var(--color-accent-green)]/20 to-[var(--color-accent-green)]/5',
            icon: 'bg-[var(--color-accent-green)]/20 text-[var(--color-accent-green)]',
            text: 'text-[var(--color-accent-green)]'
        },
        red: {
            bg: 'from-[var(--color-accent-red)]/20 to-[var(--color-accent-red)]/5',
            icon: 'bg-[var(--color-accent-red)]/20 text-[var(--color-accent-red)]',
            text: 'text-[var(--color-accent-red)]'
        }
    }

    const colorScheme = colors[color] || colors.cyan

    return (
        <div className={`glass-card glass-card-hover p-5 bg-gradient-to-br ${colorScheme.bg}`}>
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colorScheme.icon}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trendUp !== null && (
                    <span className={`text-xs font-medium ${trendUp ? 'text-[var(--color-accent-green)]' : 'text-[var(--color-accent-red)]'}`}>
                        {trendUp ? '↑' : '↓'}
                    </span>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-3xl font-bold">{value}</h3>
                <p className="text-sm text-[var(--color-navy-400)] mt-1">{title}</p>
            </div>

            {trend && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <p className={`text-xs ${colorScheme.text}`}>{trend}</p>
                </div>
            )}
        </div>
    )
}

export default StatsCard
