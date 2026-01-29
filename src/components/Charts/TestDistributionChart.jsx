import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const TestDistributionChart = ({ data = [] }) => {
    // Use mock data if no data provided
    const chartData = data.length > 0 ? data.map(d => ({
        name: d._id,
        count: d.count
    })) : [
        { name: 'PTA', count: 25 },
        { name: 'OAE', count: 15 },
        { name: 'Immittance', count: 20 },
        { name: 'ABR', count: 8 },
        { name: 'Speech', count: 12 },
        { name: 'BERA', count: 5 }
    ]

    // Gradient colors for bars
    const colors = [
        '#00d4ff', // cyan
        '#14b8a6', // teal
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#f97316', // orange
        '#22c55e', // green
    ]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card p-3 text-sm">
                    <p className="font-semibold">{label}</p>
                    <p className="text-[var(--color-accent-cyan)] mt-1">
                        {payload[0]?.value} tests
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#829ab1', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#829ab1', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar
                        dataKey="count"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TestDistributionChart
