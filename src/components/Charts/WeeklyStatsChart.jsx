import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const WeeklyStatsChart = () => {
    // Mock data - will be replaced with API data
    const data = [
        { day: 'Mon', cases: 4, hours: 6 },
        { day: 'Tue', cases: 3, hours: 7 },
        { day: 'Wed', cases: 5, hours: 8 },
        { day: 'Thu', cases: 2, hours: 5 },
        { day: 'Fri', cases: 6, hours: 8 },
        { day: 'Sat', cases: 4, hours: 6 },
        { day: 'Sun', cases: 0, hours: 0 },
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 text-sm">
                    <p className="font-semibold mb-2">{label}</p>
                    <p className="text-[var(--color-accent-cyan)]">
                        Cases: {payload[0]?.value}
                    </p>
                    <p className="text-[var(--color-accent-purple)]">
                        Hours: {payload[1]?.value}h
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#829ab1', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#829ab1', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="cases"
                        stroke="#00d4ff"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCases)"
                    />
                    <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorHours)"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-accent-cyan)]" />
                    <span className="text-sm text-[var(--color-navy-400)]">Cases</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-accent-purple)]" />
                    <span className="text-sm text-[var(--color-navy-400)]">Hours</span>
                </div>
            </div>
        </div>
    )
}

export default WeeklyStatsChart
