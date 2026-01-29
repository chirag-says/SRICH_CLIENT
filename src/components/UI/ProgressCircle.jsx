const ProgressCircle = ({
    value = 0,
    size = 100,
    strokeWidth = 8,
    label = '',
    sublabel = ''
}) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference

    return (
        <div className="circular-progress" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-accent-cyan)" />
                        <stop offset="100%" stopColor="var(--color-accent-teal)" />
                    </linearGradient>
                </defs>

                {/* Background Circle */}
                <circle
                    className="circular-progress-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress Circle */}
                <circle
                    className="circular-progress-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold gradient-text">{value}%</span>
                {label && <span className="text-xs text-[var(--color-navy-400)] mt-1">{label}</span>}
                {sublabel && <span className="text-xs text-[var(--color-navy-300)] font-medium">{sublabel}</span>}
            </div>
        </div>
    )
}

export default ProgressCircle
