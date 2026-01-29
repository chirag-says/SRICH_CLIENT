import { useState, useEffect, useMemo } from 'react'
import { HiCheck, HiX, HiPlus, HiTrash } from 'react-icons/hi'

// Test categories and types
const TEST_CATEGORIES = {
    'Pure Tone Tests': ['PTA', 'Speech'],
    'Objective Tests': ['OAE', 'ABR', 'BERA', 'ASSR', 'Immittance'],
    'Pediatric Tests': ['BOA', 'VRA', 'CondPlay', 'CPA'],
    'Rehabilitation': ['HA_Trial', 'HA_Fitting', 'CI_Mapping', 'Counseling'],
    'Other': ['Other']
}

const TEST_LABELS = {
    'PTA': 'Pure Tone Audiometry',
    'Speech': 'Speech Audiometry',
    'OAE': 'Otoacoustic Emissions',
    'ABR': 'Auditory Brainstem Response',
    'BERA': 'Brainstem Evoked Response',
    'ASSR': 'Auditory Steady-State Response',
    'Immittance': 'Immittance Audiometry',
    'BOA': 'Behavioral Observation',
    'VRA': 'Visual Reinforcement',
    'CondPlay': 'Conditioned Play',
    'CPA': 'Conditioned Play Audiometry',
    'HA_Trial': 'Hearing Aid Trial',
    'HA_Fitting': 'Hearing Aid Fitting',
    'CI_Mapping': 'Cochlear Implant Mapping',
    'Counseling': 'Patient Counseling',
    'Other': 'Other Tests'
}

const DigitalWorksheetForm = ({
    initialTests = [],
    onChange,
    onCalculateStats
}) => {
    const [selectedTests, setSelectedTests] = useState(initialTests)
    const [notes, setNotes] = useState({})

    // Handle test toggle
    const toggleTest = (testType) => {
        setSelectedTests(prev => {
            const existing = prev.find(t => t.testType === testType)
            if (existing) {
                return prev.filter(t => t.testType !== testType)
            } else {
                return [...prev, { testType, completed: true, duration: 15, notes: '' }]
            }
        })
    }

    // Update test property
    const updateTest = (testType, property, value) => {
        setSelectedTests(prev =>
            prev.map(t => t.testType === testType ? { ...t, [property]: value } : t)
        )
    }

    // Notify parent of changes
    useEffect(() => {
        onChange?.(selectedTests)
    }, [selectedTests, onChange])

    // Calculate statistics
    const stats = useMemo(() => {
        const totalTests = selectedTests.length
        const completedTests = selectedTests.filter(t => t.completed).length
        const totalDuration = selectedTests.reduce((acc, t) => acc + (t.duration || 0), 0)

        const byCategory = {}
        Object.entries(TEST_CATEGORIES).forEach(([category, tests]) => {
            byCategory[category] = selectedTests.filter(t => tests.includes(t.testType)).length
        })

        return { totalTests, completedTests, totalDuration, byCategory }
    }, [selectedTests])

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="glass-card p-4">
                <h4 className="font-semibold mb-3">Session Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-[var(--color-accent-cyan)]/10 border border-[var(--color-accent-cyan)]/20">
                        <p className="text-2xl font-bold text-[var(--color-accent-cyan)]">{stats.totalTests}</p>
                        <p className="text-xs text-[var(--color-navy-400)]">Tests Selected</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/20">
                        <p className="text-2xl font-bold text-[var(--color-accent-green)]">{stats.completedTests}</p>
                        <p className="text-xs text-[var(--color-navy-400)]">Completed</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--color-accent-purple)]/10 border border-[var(--color-accent-purple)]/20">
                        <p className="text-2xl font-bold text-[var(--color-accent-purple)]">{stats.totalDuration}m</p>
                        <p className="text-xs text-[var(--color-navy-400)]">Total Duration</p>
                    </div>
                </div>
            </div>

            {/* Test Selection Grid */}
            <div className="space-y-4">
                {Object.entries(TEST_CATEGORIES).map(([category, tests]) => (
                    <div key={category} className="glass-card p-4">
                        <h4 className="font-semibold mb-3 text-[var(--color-accent-cyan)]">{category}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {tests.map((testType) => {
                                const isSelected = selectedTests.some(t => t.testType === testType)
                                const test = selectedTests.find(t => t.testType === testType)

                                return (
                                    <div
                                        key={testType}
                                        className={`relative rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer ${isSelected
                                                ? 'border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                            }`}
                                        onClick={() => toggleTest(testType)}
                                    >
                                        {/* Checkbox indicator */}
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-[var(--color-accent-cyan)] text-[var(--color-navy-950)]'
                                                : 'bg-white/10'
                                            }`}>
                                            {isSelected && <HiCheck className="w-4 h-4" />}
                                        </div>

                                        <p className="font-medium text-sm pr-8">{TEST_LABELS[testType]}</p>
                                        <p className="text-xs text-[var(--color-navy-400)] mt-1">{testType}</p>

                                        {/* Duration input when selected */}
                                        {isSelected && (
                                            <div className="mt-3 pt-3 border-t border-white/10" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs text-[var(--color-navy-400)]">Duration:</label>
                                                    <input
                                                        type="number"
                                                        value={test?.duration || 15}
                                                        onChange={(e) => updateTest(testType, 'duration', parseInt(e.target.value) || 0)}
                                                        className="w-16 px-2 py-1 text-xs rounded-md bg-white/10 border border-white/10 focus:border-[var(--color-accent-cyan)] focus:outline-none"
                                                        min="0"
                                                        max="180"
                                                    />
                                                    <span className="text-xs text-[var(--color-navy-400)]">min</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Notes Section */}
            {selectedTests.length > 0 && (
                <div className="glass-card p-4">
                    <h4 className="font-semibold mb-3">Test Notes</h4>
                    <div className="space-y-3">
                        {selectedTests.map((test) => (
                            <div key={test.testType} className="p-3 rounded-lg bg-white/5">
                                <label className="text-sm font-medium text-[var(--color-accent-cyan)]">
                                    {TEST_LABELS[test.testType]}
                                </label>
                                <textarea
                                    value={test.notes || ''}
                                    onChange={(e) => updateTest(test.testType, 'notes', e.target.value)}
                                    placeholder="Add notes for this test..."
                                    className="w-full mt-2 px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 focus:border-[var(--color-accent-cyan)] focus:outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Category breakdown */}
            <div className="glass-card p-4">
                <h4 className="font-semibold mb-3">Category Breakdown</h4>
                <div className="space-y-2">
                    {Object.entries(stats.byCategory).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                            <span className="text-sm text-[var(--color-navy-300)]">{category}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-teal)] rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (count / Object.values(TEST_CATEGORIES).find(t => t.some(tt => TEST_CATEGORIES[category].includes(tt)))?.length || 1) * 100)}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default DigitalWorksheetForm
