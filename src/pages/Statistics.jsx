import { format, startOfWeek, endOfWeek } from 'date-fns'
import { HiDocumentText, HiUserGroup, HiCheckCircle, HiClock, HiChartBar, HiDownload, HiChevronRight } from 'react-icons/hi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

const Statistics = () => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    const stats = { totalCases: 24, uniquePatients: 18, approved: 20, pending: 4, avgDuration: '45m' }
    const ageData = [
        { name: '0-2y', value: 3, color: '#4da8da' }, { name: '2-5y', value: 5, color: '#4ade80' },
        { name: '5-16y', value: 4, color: '#8b5cf6' }, { name: '16-40y', value: 8, color: '#fbbf24' },
        { name: '40-60y', value: 3, color: '#fb923c' }, { name: '>60y', value: 1, color: '#f87171' }
    ]
    const testData = [{ name: 'PTA', count: 18 }, { name: 'OAE', count: 12 }, { name: 'ABR', count: 8 }, { name: 'Immittance', count: 15 }, { name: 'Speech', count: 10 }, { name: 'BERA', count: 5 }]
    const dailyData = [{ day: 'Mon', cases: 4 }, { day: 'Tue', cases: 6 }, { day: 'Wed', cases: 3 }, { day: 'Thu', cases: 5 }, { day: 'Fri', cases: 4 }, { day: 'Sat', cases: 2 }]

    return (
        <div className="page">
            <style>{`
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
        
        @media (max-width: 1100px) { .charts-grid { grid-template-columns: 1fr; } .stats-row { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 600px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

            <div className="page-container">
                <div className="page-header">
                    <div><h1 className="page-title">Statistics</h1><p className="page-subtitle">Weekly performance analytics</p></div>
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
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart><Pie data={ageData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                                    {ageData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie><Tooltip contentStyle={{ background: '#1b2838', border: 'none', borderRadius: 8, color: '#fff' }} /></PieChart>
                            </ResponsiveContainer>
                            <div className="legend">{ageData.map((a, i) => <div key={i} className="legend-item"><div className="legend-dot" style={{ background: a.color }}></div>{a.name}: {a.value}</div>)}</div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><HiChartBar size={16} /> Tests Distribution</div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={testData} layout="vertical"><XAxis type="number" stroke="#7aa3c0" /><YAxis type="category" dataKey="name" stroke="#7aa3c0" width={80} /><Tooltip contentStyle={{ background: '#1b2838', border: 'none', borderRadius: 8, color: '#fff' }} /><Bar dataKey="count" fill="#4da8da" radius={[0, 6, 6, 0]} /></BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><HiChartBar size={16} /> Daily Case Trend</div>
                        <div className="card-body">
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={dailyData}><XAxis dataKey="day" stroke="#7aa3c0" /><YAxis stroke="#7aa3c0" /><Tooltip contentStyle={{ background: '#1b2838', border: 'none', borderRadius: 8, color: '#fff' }} /><Area type="monotone" dataKey="cases" stroke="#4ade80" fill="rgba(74,222,128,0.2)" strokeWidth={2} /></AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header"><HiDocumentText size={16} /> Test Type Details</div>
                        <div className="card-body">
                            <div className="test-list">
                                {testData.map((t, i) => (
                                    <div key={i} className="test-item">
                                        <div className="test-left"><div className="test-icon"><HiDocumentText size={16} /></div><span className="test-name">{t.name}</span></div>
                                        <span className="test-count">{t.count} tests</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics
