import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiDocumentText, HiUserGroup, HiCheckCircle, HiClock, HiChartBar, HiDownload } from 'react-icons/hi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const Statistics = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ totalCases: 0, uniquePatients: 0, approved: 0, pending: 0, avgDuration: '0m' })
    const [ageData, setAgeData] = useState([])
    const [testData, setTestData] = useState([])
    const [dailyData, setDailyData] = useState([])

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

    const ageColors = {
        '<2y': '#4da8da',
        '2.1-5y': '#4ade80',
        '5.1-16y': '#8b5cf6',
        '16.1-40y': '#fbbf24',
        '40.1-60y': '#fb923c',
        '>60y': '#f87171'
    }

    useEffect(() => {
        fetchStatistics()
    }, [])

    const fetchStatistics = async () => {
        try {
            setLoading(true)

            // Fetch clinical cases
            const casesRes = await api.get('/clinical-cases')
            const cases = casesRes.data.data || []

            // Calculate basic stats
            const approved = cases.filter(c => c.supervisorApproval?.status === 'Approved').length
            const pending = cases.filter(c => c.supervisorApproval?.status === 'Pending').length

            // Calculate unique patients (by initials)
            const uniquePatients = new Set(cases.map(c => c.patientInfo?.initials)).size

            // Calculate avg duration
            const durations = cases.filter(c => c.sessionDuration).map(c => c.sessionDuration)
            const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0

            setStats({
                totalCases: cases.length,
                uniquePatients,
                approved,
                pending,
                avgDuration: avgDuration > 0 ? `${avgDuration}m` : 'N/A'
            })

            // Age group distribution
            const ageGroups = {}
            cases.forEach(c => {
                const age = c.patientInfo?.ageGroup || 'Unknown'
                ageGroups[age] = (ageGroups[age] || 0) + 1
            })
            const ageChartData = Object.entries(ageGroups)
                .filter(([name]) => name !== 'Unknown')
                .map(([name, value]) => ({
                    name,
                    value,
                    color: ageColors[name] || '#4da8da'
                }))
            setAgeData(ageChartData)

            // Test type distribution
            const testCounts = {}
            cases.forEach(c => {
                (c.testsPerformed || []).forEach(t => {
                    const testType = t.testType
                    testCounts[testType] = (testCounts[testType] || 0) + 1
                })
            })
            const testChartData = Object.entries(testCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
            setTestData(testChartData)

            // Daily case trend (last 7 days)
            const dailyCounts = {}
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            const todayIndex = new Date().getDay()

            // Initialize last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date()
                date.setDate(date.getDate() - i)
                const dayName = days[date.getDay()]
                dailyCounts[dayName] = 0
            }

            // Count cases per day
            cases.forEach(c => {
                const caseDate = new Date(c.sessionDate || c.createdAt)
                const daysDiff = Math.floor((new Date() - caseDate) / (1000 * 60 * 60 * 24))
                if (daysDiff >= 0 && daysDiff < 7) {
                    const dayName = days[caseDate.getDay()]
                    dailyCounts[dayName] = (dailyCounts[dayName] || 0) + 1
                }
            })

            const dailyChartData = Object.entries(dailyCounts).map(([day, cases]) => ({ day, cases }))
            setDailyData(dailyChartData)

        } catch (error) {
            console.error('Failed to fetch statistics:', error)
            toast.error('Failed to load statistics')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a1628 0%, #0d1f35 100%)' }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(77,168,218,0.2)', borderTopColor: '#4da8da', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            </div>
        )
    }

    return (
        <div className="page">
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .page { padding: 24px; background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%); min-height: calc(100vh - 70px); }
        .page-container { max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .page-subtitle { color: #7aa3c0; }
        .header-right { display: flex; gap: 12px; align-items: center; }
        .date-badge { padding: 10px 18px; background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #7aa3c0; display: flex; align-items: center; gap: 8px; }
        .export-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
        
        .stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 14px; padding: 18px; text-align: center; }
        .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .stat-icon.blue { background: rgba(77,168,218,0.15); color: #4da8da; }
        .stat-icon.purple { background: rgba(139,92,246,0.15); color: #8b5cf6; }
        .stat-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .stat-icon.yellow { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .stat-icon.orange { background: rgba(251,146,60,0.15); color: #fb923c; }
        .stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; }
        .stat-label { font-size: 0.8rem; color: #7aa3c0; margin-top: 4px; }
        
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 16px; overflow: hidden; }
        .card-header { background: linear-gradient(90deg, #1e5a7e, #2d7aa8); padding: 14px 20px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 10px; }
        .card-body { padding: 20px; }
        
        .legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 16px; justify-content: center; }
        .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #7aa3c0; }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
        
        .test-list { display: flex; flex-direction: column; gap: 10px; }
        .test-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: rgba(13,31,53,0.6); border-radius: 10px; }
        .test-item:hover { background: rgba(77,168,218,0.1); }
        .test-left { display: flex; align-items: center; gap: 12px; }
        .test-icon { width: 36px; height: 36px; background: rgba(77,168,218,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #4da8da; }
        .test-name { font-weight: 500; color: #fff; }
        .test-count { font-weight: 600; color: #4da8da; }
        
        .empty-chart { text-align: center; padding: 40px; color: #7aa3c0; }
        
        @media (max-width: 1100px) { .charts-grid { grid-template-columns: 1fr; } .stats-row { grid-template-columns: repeat(3, 1fr); } }
        
        @media (max-width: 640px) {
            .page { padding: 16px; }
            .page-header { flex-direction: column; align-items: stretch; gap: 12px; }
            .header-right { flex-direction: column; align-items: stretch; gap: 10px; }
            .date-badge, .export-btn { justify-content: center; width: 100%; }
            
            .stats-row { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
            /* Make the last odd item span full width */
            .stat-card:last-child:nth-child(odd) { grid-column: 1 / -1; }
            
            .stat-card { padding: 14px; }
            .stat-icon { width: 40px; height: 40px; margin-bottom: 8px; }
            .stat-value { font-size: 1.4rem; }
            
            .charts-grid { gap: 16px; }
            .card-body { padding: 16px; }
        }
      `}</style>

            <div className="page-container">
                <div className="page-header">
                    <div><h1 className="page-title">Statistics</h1><p className="page-subtitle">Your performance analytics</p></div>
                    <div className="header-right">
                        <div className="date-badge"><HiChartBar size={16} /> {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</div>
                        <button className="export-btn"><HiDownload size={18} /> Export</button>
                    </div>
                </div>

                <div className="stats-row">
                    <div className="stat-card"><div className="stat-icon blue"><HiDocumentText size={22} /></div><div className="stat-value">{stats.totalCases}</div><div className="stat-label">Total Cases</div></div>
                    <div className="stat-card"><div className="stat-icon purple"><HiUserGroup size={22} /></div><div className="stat-value">{stats.uniquePatients}</div><div className="stat-label">Unique Patients</div></div>
                    <div className="stat-card"><div className="stat-icon green"><HiCheckCircle size={22} /></div><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div>
                    <div className="stat-card"><div className="stat-icon yellow"><HiClock size={22} /></div><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending</div></div>
                    <div className="stat-card"><div className="stat-icon orange"><HiChartBar size={22} /></div><div className="stat-value">{stats.avgDuration}</div><div className="stat-label">Avg Duration</div></div>
                </div>

                <div className="charts-grid">
                    <div className="card">
                        <div className="card-header"><HiChartBar size={16} /> Cases by Age Group</div>
                        <div className="card-body">
                            {ageData.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart><Pie data={ageData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                                            {ageData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                        </Pie><Tooltip contentStyle={{ background: '#1b2838', border: 'none', borderRadius: 8, color: '#fff' }} /></PieChart>
                                    </ResponsiveContainer>
                                    <div className="legend">{ageData.map((a, i) => <div key={i} className="legend-item"><div className="legend-dot" style={{ background: a.color }}></div>{a.name}: {a.value}</div>)}</div>
                                </>
                            ) : (
                                <div className="empty-chart">No age group data available</div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><HiChartBar size={16} /> Tests Distribution</div>
                        <div className="card-body">
                            {testData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={240}>
                                    <BarChart data={testData} layout="vertical"><XAxis type="number" stroke="#7aa3c0" /><YAxis type="category" dataKey="name" stroke="#7aa3c0" width={80} /><Tooltip contentStyle={{ background: '#1b2838', border: 'none', borderRadius: 8, color: '#fff' }} /><Bar dataKey="count" fill="#4da8da" radius={[0, 6, 6, 0]} /></BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-chart">No test data available</div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><HiChartBar size={16} /> Daily Case Trend</div>
                        <div className="card-body">
                            {dailyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={dailyData}><XAxis dataKey="day" stroke="#7aa3c0" /><YAxis stroke="#7aa3c0" /><Tooltip contentStyle={{ background: '#1b2838', border: 'none', borderRadius: 8, color: '#fff' }} /><Area type="monotone" dataKey="cases" stroke="#4ade80" fill="rgba(74,222,128,0.2)" strokeWidth={2} /></AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="empty-chart">No daily data available</div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><HiDocumentText size={16} /> Test Type Details</div>
                        <div className="card-body">
                            {testData.length > 0 ? (
                                <div className="test-list">
                                    {testData.map((t, i) => (
                                        <div key={i} className="test-item">
                                            <div className="test-left"><div className="test-icon"><HiDocumentText size={16} /></div><span className="test-name">{t.name}</span></div>
                                            <span className="test-count">{t.count} tests</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-chart">No test data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics
