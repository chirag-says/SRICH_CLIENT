import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000, 8000]
const FREQUENCY_LABELS = ['125', '250', '500', '1K', '2K', '4K', '8K']

// Hearing loss classification levels
const HEARING_LEVELS = [
    { min: -10, max: 25, label: 'Normal', color: '#22c55e' },
    { min: 26, max: 40, label: 'Mild', color: '#eab308' },
    { min: 41, max: 55, label: 'Moderate', color: '#f97316' },
    { min: 56, max: 70, label: 'Mod. Severe', color: '#ef4444' },
    { min: 71, max: 90, label: 'Severe', color: '#dc2626' },
    { min: 91, max: 120, label: 'Profound', color: '#991b1b' }
]

const Audiogram = ({
    rightEarAC = {},
    rightEarBC = {},
    leftEarAC = {},
    leftEarBC = {},
    onDataChange,
    editable = false
}) => {
    const [selectedPoint, setSelectedPoint] = useState(null)

    // Transform data for Recharts
    const chartData = useMemo(() => {
        return FREQUENCIES.map((freq, index) => ({
            frequency: freq,
            label: FREQUENCY_LABELS[index],
            rightAC: rightEarAC[freq] ?? null,
            rightBC: rightEarBC[freq] ?? null,
            leftAC: leftEarAC[freq] ?? null,
            leftBC: leftEarBC[freq] ?? null
        }))
    }, [rightEarAC, rightEarBC, leftEarAC, leftEarBC])

    // Custom dot components for audiogram symbols
    const RightEarACDot = (props) => {
        const { cx, cy, payload } = props
        if (payload.rightAC === null || payload.rightAC === undefined) return null
        return (
            <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="none"
                stroke="#ef4444"
                strokeWidth={2}
                className="cursor-pointer"
            />
        )
    }

    const LeftEarACDot = (props) => {
        const { cx, cy, payload } = props
        if (payload.leftAC === null || payload.leftAC === undefined) return null
        return (
            <g transform={`translate(${cx - 8}, ${cy - 8})`}>
                <line x1="0" y1="0" x2="16" y2="16" stroke="#3b82f6" strokeWidth={2} />
                <line x1="16" y1="0" x2="0" y2="16" stroke="#3b82f6" strokeWidth={2} />
            </g>
        )
    }

    const RightEarBCDot = (props) => {
        const { cx, cy, payload } = props
        if (payload.rightBC === null || payload.rightBC === undefined) return null
        return (
            <g transform={`translate(${cx}, ${cy})`}>
                <line x1="-8" y1="0" x2="0" y2="-8" stroke="#ef4444" strokeWidth={2} />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#ef4444" strokeWidth={2} />
                <line x1="-8" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth={2} />
            </g>
        )
    }

    const LeftEarBCDot = (props) => {
        const { cx, cy, payload } = props
        if (payload.leftBC === null || payload.leftBC === undefined) return null
        return (
            <g transform={`translate(${cx}, ${cy})`}>
                <line x1="8" y1="0" x2="0" y2="-8" stroke="#3b82f6" strokeWidth={2} />
                <line x1="0" y1="-8" x2="0" y2="8" stroke="#3b82f6" strokeWidth={2} />
                <line x1="8" y1="0" x2="0" y2="8" stroke="#3b82f6" strokeWidth={2} />
            </g>
        )
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="glass-card p-3 text-sm">
                    <p className="font-semibold mb-2">{data.frequency} Hz</p>
                    {data.rightAC !== null && (
                        <p className="text-red-400">Right AC: {data.rightAC} dB</p>
                    )}
                    {data.rightBC !== null && (
                        <p className="text-red-300">Right BC: {data.rightBC} dB</p>
                    )}
                    {data.leftAC !== null && (
                        <p className="text-blue-400">Left AC: {data.leftAC} dB</p>
                    )}
                    {data.leftBC !== null && (
                        <p className="text-blue-300">Left BC: {data.leftBC} dB</p>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Audiogram</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-red-500" />
                        <span className="text-[var(--color-navy-300)]">Right AC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 text-blue-500 font-bold">×</div>
                        <span className="text-[var(--color-navy-300)]">Left AC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-red-400">&lt;</div>
                        <span className="text-[var(--color-navy-300)]">Right BC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-blue-400">&gt;</div>
                        <span className="text-[var(--color-navy-300)]">Left BC</span>
                    </div>
                </div>
            </div>

            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <defs>
                            {/* Background zones for hearing loss levels */}
                            <linearGradient id="normalZone" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

                        <XAxis
                            dataKey="label"
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                            tickLine={false}
                            tick={{ fill: '#829ab1', fontSize: 12 }}
                            label={{ value: 'Frequency (Hz)', position: 'bottom', fill: '#829ab1', offset: 0 }}
                        />

                        <YAxis
                            domain={[-10, 120]}
                            reversed={true}
                            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                            tickLine={false}
                            tick={{ fill: '#829ab1', fontSize: 12 }}
                            label={{ value: 'Hearing Level (dB HL)', angle: -90, position: 'insideLeft', fill: '#829ab1' }}
                            ticks={[-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {/* Reference lines for hearing level classifications */}
                        <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="5 5" strokeOpacity={0.5} />
                        <ReferenceLine y={40} stroke="#eab308" strokeDasharray="5 5" strokeOpacity={0.5} />
                        <ReferenceLine y={55} stroke="#f97316" strokeDasharray="5 5" strokeOpacity={0.5} />
                        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="5 5" strokeOpacity={0.5} />
                        <ReferenceLine y={90} stroke="#dc2626" strokeDasharray="5 5" strokeOpacity={0.5} />

                        {/* Right Ear Air Conduction */}
                        <Line
                            type="linear"
                            dataKey="rightAC"
                            stroke="#ef4444"
                            strokeWidth={2}
                            connectNulls
                            dot={<RightEarACDot />}
                            activeDot={{ r: 10, stroke: '#ef4444', strokeWidth: 2, fill: 'rgba(239, 68, 68, 0.2)' }}
                        />

                        {/* Right Ear Bone Conduction */}
                        <Line
                            type="linear"
                            dataKey="rightBC"
                            stroke="#ef4444"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            connectNulls
                            dot={<RightEarBCDot />}
                        />

                        {/* Left Ear Air Conduction */}
                        <Line
                            type="linear"
                            dataKey="leftAC"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            connectNulls
                            dot={<LeftEarACDot />}
                            activeDot={{ r: 10, stroke: '#3b82f6', strokeWidth: 2, fill: 'rgba(59, 130, 246, 0.2)' }}
                        />

                        {/* Left Ear Bone Conduction */}
                        <Line
                            type="linear"
                            dataKey="leftBC"
                            stroke="#3b82f6"
                            strokeWidth={1}
                            strokeDasharray="5 5"
                            connectNulls
                            dot={<LeftEarBCDot />}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Hearing Level Legend */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-[var(--color-navy-400)] mb-2">Hearing Level Classification:</p>
                <div className="flex flex-wrap gap-4">
                    {HEARING_LEVELS.map((level) => (
                        <div key={level.label} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-sm"
                                style={{ backgroundColor: level.color }}
                            />
                            <span className="text-xs text-[var(--color-navy-300)]">
                                {level.label} ({level.min}-{level.max} dB)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Audiogram
