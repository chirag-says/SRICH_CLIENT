import { HiClock, HiCalendar, HiCheckCircle } from 'react-icons/hi'

const AttendanceWidget = ({ stats = {} }) => {
    const { daysThisMonth = 18, hoursThisMonth = 126 } = stats

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Attendance This Month</h3>
                <HiCalendar className="w-5 h-5 text-[var(--color-navy-400)]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/20">
                    <div className="flex items-center gap-2 mb-2">
                        <HiCheckCircle className="w-4 h-4 text-[var(--color-accent-green)]" />
                        <span className="text-xs text-[var(--color-navy-400)]">Days Present</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-accent-green)]">{daysThisMonth}</p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-accent-cyan)]/10 border border-[var(--color-accent-cyan)]/20">
                    <div className="flex items-center gap-2 mb-2">
                        <HiClock className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                        <span className="text-xs text-[var(--color-navy-400)]">Hours Logged</span>
                    </div>
                    <p className="text-2xl font-bold text-[var(--color-accent-cyan)]">{hoursThisMonth}h</p>
                </div>
            </div>

            {/* Average hours indicator */}
            <div className="mt-4 p-3 rounded-lg bg-white/5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-navy-400)]">Avg. hours/day</span>
                    <span className="font-semibold">
                        {daysThisMonth > 0 ? (hoursThisMonth / daysThisMonth).toFixed(1) : 0}h
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AttendanceWidget
