import { useState } from 'react'
import { format } from 'date-fns'
import { HiClock, HiLogout, HiCalendar, HiCheckCircle, HiLocationMarker, HiChartBar } from 'react-icons/hi'

const Attendance = () => {
  const [selectedLocation, setSelectedLocation] = useState('Main Clinic')
  const stats = { daysPresent: 18, hoursLogged: 126, avgHours: 7, streak: 5 }
  const locations = ['Main Clinic', 'OPD', 'Audiology Lab', 'Speech Lab', 'Ward', 'Camp']
  const history = [
    { date: new Date().toISOString(), timeIn: '09:00 AM', timeOut: '05:00 PM', hours: '8h 0m', location: 'Main Clinic', verified: true },
    { date: new Date(Date.now() - 86400000).toISOString(), timeIn: '08:30 AM', timeOut: '04:30 PM', hours: '8h 0m', location: 'Audiology Lab', verified: true },
    { date: new Date(Date.now() - 172800000).toISOString(), timeIn: '09:15 AM', timeOut: '05:30 PM', hours: '8h 15m', location: 'OPD', verified: false }
  ]

  return (
    <div className="page">
      <style>{`
        .page { padding: 24px; background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%); min-height: calc(100vh - 70px); }
        .page-container { max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .page-subtitle { color: #7aa3c0; }
        .date-badge { padding: 10px 18px; background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #fff; font-weight: 500; }
        
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 14px; padding: 18px; display: flex; align-items: center; gap: 14px; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.blue { background: rgba(77,168,218,0.15); color: #4da8da; }
        .stat-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .stat-icon.purple { background: rgba(139,92,246,0.15); color: #8b5cf6; }
        .stat-icon.orange { background: rgba(251,146,60,0.15); color: #fb923c; }
        .stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; }
        .stat-label { font-size: 0.8rem; color: #7aa3c0; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 16px; overflow: hidden; }
        .card-header { background: linear-gradient(90deg, #1e5a7e, #2d7aa8); padding: 14px 20px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 10px; }
        .card-body { padding: 20px; }
        
        .location-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .loc-btn { padding: 14px; background: rgba(13,31,53,0.6); border: 2px solid transparent; border-radius: 10px; color: #7aa3c0; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: center; }
        .loc-btn:hover { border-color: rgba(77,168,218,0.3); }
        .loc-btn.active { background: rgba(77,168,218,0.1); border-color: #4da8da; color: #4da8da; }
        
        .checkin-btn { width: 100%; padding: 16px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); color: #fff; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; }
        .checkin-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(77,168,218,0.3); }
        
        .progress-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(77,168,218,0.1); }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem; }
        .progress-label { color: #7aa3c0; }
        .progress-value { color: #4da8da; font-weight: 600; }
        .progress-bar { height: 10px; background: rgba(77,168,218,0.2); border-radius: 5px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4ade80, #00d4ff); border-radius: 5px; }
        
        .history-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(13,31,53,0.6); border-radius: 12px; margin-bottom: 12px; }
        .history-item:last-child { margin-bottom: 0; }
        .history-left { display: flex; align-items: center; gap: 14px; }
        .history-icon { width: 44px; height: 44px; background: rgba(77,168,218,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4da8da; }
        .history-date { font-weight: 600; color: #fff; }
        .history-time { font-size: 0.85rem; color: #7aa3c0; margin-top: 2px; }
        .history-right { text-align: right; }
        .history-hours { font-weight: 600; color: #fff; }
        .history-loc { font-size: 0.8rem; color: #7aa3c0; margin-top: 2px; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-left: 12px; }
        .badge-verified { background: rgba(74,222,128,0.15); color: #4ade80; }
        .badge-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
        
        @media (max-width: 900px) { .stats-row, .grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <div><h1 className="page-title">Attendance</h1><p className="page-subtitle">Track your clinical hours</p></div>
          <div className="date-badge">{format(new Date(), 'EEEE, MMMM d, yyyy')}</div>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-icon blue"><HiCalendar size={22} /></div><div><div className="stat-value">{stats.daysPresent}</div><div className="stat-label">Days Present</div></div></div>
          <div className="stat-card"><div className="stat-icon green"><HiClock size={22} /></div><div><div className="stat-value">{stats.hoursLogged}h</div><div className="stat-label">Hours Logged</div></div></div>
          <div className="stat-card"><div className="stat-icon purple"><HiChartBar size={22} /></div><div><div className="stat-value">{stats.avgHours}h</div><div className="stat-label">Avg Hours/Day</div></div></div>
          <div className="stat-card"><div className="stat-icon orange"><HiCheckCircle size={22} /></div><div><div className="stat-value">{stats.streak}</div><div className="stat-label">Day Streak</div></div></div>
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-header"><HiClock size={18} /> Today's Check-In</div>
            <div className="card-body">
              <p style={{ color: '#7aa3c0', marginBottom: 16, fontSize: '0.9rem' }}>Select your location and check in</p>
              <div className="location-grid">
                {locations.map(loc => <button key={loc} className={`loc-btn ${selectedLocation === loc ? 'active' : ''}`} onClick={() => setSelectedLocation(loc)}>{loc}</button>)}
              </div>
              <button className="checkin-btn"><HiClock size={20} /> Check In Now</button>
              <div className="progress-section">
                <div className="progress-header"><span className="progress-label">Monthly Progress</span><span className="progress-value">82%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '82%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiCalendar size={18} /> Recent Attendance</div>
            <div className="card-body">
              {history.map((h, i) => (
                <div key={i} className="history-item">
                  <div className="history-left">
                    <div className="history-icon"><HiCalendar size={20} /></div>
                    <div><div className="history-date">{format(new Date(h.date), 'EEE, MMM d')}</div><div className="history-time">{h.timeIn} - {h.timeOut}</div></div>
                  </div>
                  <div className="history-right"><div className="history-hours">{h.hours}</div><div className="history-loc">{h.location}</div></div>
                  <span className={`badge ${h.verified ? 'badge-verified' : 'badge-pending'}`}>{h.verified ? 'Verified' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance
