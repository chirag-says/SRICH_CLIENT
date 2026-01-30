import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiClock, HiLogout, HiCalendar, HiCheckCircle, HiLocationMarker, HiChartBar } from 'react-icons/hi'

const Attendance = () => {
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState([])
  const [todayRecord, setTodayRecord] = useState(null)
  const [stats, setStats] = useState({ daysPresent: 0, hoursLogged: 0, avgHours: 0, streak: 0 })
  const [selectedLocation, setSelectedLocation] = useState('Main Clinic')
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const locations = ['Main Clinic', 'OPD', 'Audiology Lab', 'Speech Lab', 'Ward', 'Camp']

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const response = await api.get('/attendance')
      const records = response.data.data || []
      setAttendance(records)

      // Find today's active record (if any)
      const today = new Date().toDateString()
      // Find a record for today that hasn't been checked out yet
      const activeRec = records.find(r => new Date(r.date).toDateString() === today && !r.timeOut)
      setTodayRecord(activeRec || null)

      // Calculate stats
      const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0)
      const avgHours = records.length > 0 ? totalHours / records.length : 0

      // Calculate streak (consecutive days)
      let streak = 0
      const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date))
      for (let i = 0; i < sortedRecords.length; i++) {
        const recordDate = new Date(sortedRecords[i].date)
        const expectedDate = new Date()
        expectedDate.setDate(expectedDate.getDate() - i)
        if (recordDate.toDateString() === expectedDate.toDateString()) {
          streak++
        } else {
          break
        }
      }

      setStats({
        daysPresent: records.length,
        hoursLogged: Math.round(totalHours),
        avgHours: Math.round(avgHours * 10) / 10,
        streak
      })
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
      toast.error('Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true)
      await api.post('/attendance/check-in', { location: selectedLocation })
      toast.success('Checked in successfully!')
      fetchAttendance()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check in')
    } finally {
      setCheckingIn(false)
    }
  }

  const handleCheckOut = async () => {
    try {
      setCheckingOut(true)
      await api.put('/attendance/check-out')
      toast.success('Checked out successfully!')
      fetchAttendance()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to check out')
    } finally {
      setCheckingOut(false)
    }
  }

  // Calculate monthly progress
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthRecords = attendance.filter(r => {
    const d = new Date(r.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })
  const workingDaysInMonth = 22 // Approximate
  const monthlyProgress = Math.min(100, Math.round((thisMonthRecords.length / workingDaysInMonth) * 100))

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
        .checkin-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(77,168,218,0.3); }
        .checkin-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .checkout-btn { background: linear-gradient(90deg, #dc2626, #ef4444); }
        
        .current-status { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; }
        .status-title { color: #4ade80; font-weight: 600; margin-bottom: 4px; }
        .status-time { color: #7aa3c0; font-size: 0.9rem; }
        .status-location { color: #7aa3c0; font-size: 0.85rem; margin-top: 4px; }
        
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
        
        .empty-state { text-align: center; padding: 40px; color: #7aa3c0; }
        
        @media (max-width: 900px) { 
          .stats-row, .grid { grid-template-columns: 1fr; } 
        }
        
        @media (max-width: 640px) {
          .page { padding: 16px; }
          .page-header { flex-direction: column; align-items: stretch; gap: 12px; }
          .date-badge { text-align: center; }
          .stats-row { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .stat-card { padding: 14px; gap: 10px; }
          .stat-icon { width: 40px; height: 40px; }
          .stat-value { font-size: 1.2rem; }
          .location-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .loc-btn { padding: 12px; font-size: 0.85rem; }
          
          .history-item { flex-direction: column; align-items: flex-start; gap: 10px; position: relative; }
          .history-right { text-align: left; display: flex; align-items: center; gap: 12px; width: 100%; }
          .badge { position: absolute; top: 16px; right: 16px; margin: 0; }
        }
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
              {todayRecord && todayRecord.timeIn ? (
                <>
                  <div className="current-status">
                    <div className="status-title">✓ Checked In</div>
                    <div className="status-time">
                      Check-in: {new Date(todayRecord.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {todayRecord.timeOut && ` • Check-out: ${new Date(todayRecord.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                    {todayRecord.location && <div className="status-location"><HiLocationMarker size={14} style={{ verticalAlign: 'middle' }} /> {todayRecord.location}</div>}
                    {todayRecord.totalHours && <div className="status-time" style={{ marginTop: 8 }}>Total: {todayRecord.totalHours.toFixed(1)} hours</div>}
                  </div>
                  {!todayRecord.timeOut && (
                    <button className="checkin-btn checkout-btn" onClick={handleCheckOut} disabled={checkingOut}>
                      <HiLogout size={20} /> {checkingOut ? 'Checking Out...' : 'Check Out'}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p style={{ color: '#7aa3c0', marginBottom: 16, fontSize: '0.9rem' }}>Select your location and check in</p>
                  <div className="location-grid">
                    {locations.map(loc => (
                      <button key={loc} className={`loc-btn ${selectedLocation === loc ? 'active' : ''}`} onClick={() => setSelectedLocation(loc)}>{loc}</button>
                    ))}
                  </div>
                  <button className="checkin-btn" onClick={handleCheckIn} disabled={checkingIn}>
                    <HiClock size={20} /> {checkingIn ? 'Checking In...' : 'Check In Now'}
                  </button>
                </>
              )}
              <div className="progress-section">
                <div className="progress-header"><span className="progress-label">Monthly Progress</span><span className="progress-value">{monthlyProgress}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${monthlyProgress}%` }}></div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiCalendar size={18} /> Recent Attendance</div>
            <div className="card-body">
              {attendance.length > 0 ? (
                attendance.slice(0, 5).map((record, i) => (
                  <div key={record._id || i} className="history-item">
                    <div className="history-left">
                      <div className="history-icon"><HiCalendar size={20} /></div>
                      <div>
                        <div className="history-date">{format(new Date(record.date), 'EEE, MMM d')}</div>
                        <div className="history-time">
                          {record.timeIn ? new Date(record.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} -
                          {record.timeOut ? new Date(record.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In progress'}
                        </div>
                      </div>
                    </div>
                    <div className="history-right">
                      <div className="history-hours">{record.totalHours ? `${record.totalHours.toFixed(1)}h` : '--'}</div>
                      <div className="history-loc">{record.location || 'N/A'}</div>
                    </div>
                    <span className={`badge ${record.timeOut ? 'badge-verified' : 'badge-pending'}`}>
                      {record.timeOut ? 'Complete' : 'Active'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No attendance records yet</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Check in to start tracking your hours</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance
