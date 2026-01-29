const ProgressBar = ({
    value = 0,
    height = 8,
    showLabel = false,
    color = 'cyan'
}) => {
    const gradients = {
        cyan: 'from-[var(--color-accent-cyan)] to-[var(--color-accent-teal)]',
        purple: 'from-[var(--color-accent-purple)] to-[var(--color-accent-pink)]',
        green: 'from-[var(--color-accent-green)] to-[var(--color-accent-teal)]',
        orange: 'from-[var(--color-accent-orange)] to-[var(--color-accent-yellow)]',
        red: 'from-[var(--color-accent-red)] to-[var(--color-accent-orange)]'
    }

    return (
        <div className="w-full">
            <div
                className="progress-bar relative overflow-hidden"
                style={{ height: `${height}px` }}
            >
                <div
                    className={`progress-bar-fill bg-gradient-to-r ${gradients[color] || gradients.cyan} relative`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Milestone markers */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-white/20" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-white/20" />
                <div className="absolute top-0 left-3/4 w-px h-full bg-white/20" />
            </div>

            {showLabel && (
                <div className="flex justify-end mt-1">
                    <span className="text-sm font-medium text-[var(--color-accent-cyan)]">
                        {value}%
                    </span>
                </div>
            )}
        </div>
    )
}

export default ProgressBar
