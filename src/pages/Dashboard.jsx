import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import { HiDocumentText, HiCheckCircle, HiClock, HiChartBar, HiCalendar, HiLink, HiBell, HiChevronRight } from 'react-icons/hi'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalCases: 0, approved: 0, pending: 0, rejected: 0 })
  const [attendanceStats, setAttendanceStats] = useState({ daysPresent: 0, hoursLogged: 0, todayStatus: null })
  const [leaveStats, setLeaveStats] = useState({ total: 0, approved: 0, pending: 0 })
  const [recentCases, setRecentCases] = useState([])
  const [recentAttendance, setRecentAttendance] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch clinical cases stats
      const casesRes = await api.get('/clinical-cases')
      const cases = casesRes.data.data || []
      const approved = cases.filter(c => c.supervisorApproval?.status === 'Approved').length
      const pending = cases.filter(c => c.supervisorApproval?.status === 'Pending').length
      const rejected = cases.filter(c => c.supervisorApproval?.status === 'Rejected').length
      setStats({ totalCases: cases.length, approved, pending, rejected })
      setRecentCases(cases.slice(0, 3))

      // Fetch attendance stats
      try {
        const attendanceRes = await api.get('/attendance')
        const attendance = attendanceRes.data.data || []
        const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0)
        const today = new Date().toDateString()
        const todayRecord = attendance.find(a => new Date(a.date).toDateString() === today)
        setAttendanceStats({
          daysPresent: attendance.length,
          hoursLogged: Math.round(totalHours),
          todayStatus: todayRecord
        })
        setRecentAttendance(attendance.slice(0, 3))
      } catch (e) {
        console.log('Attendance fetch failed:', e)
      }

      // Fetch leave requests stats
      try {
        const leavesRes = await api.get('/leave-requests')
        const leaves = leavesRes.data.data || []
        const leaveApproved = leaves.filter(l => l.status === 'Approved').length
        const leavePending = leaves.filter(l => l.status === 'Pending').length
        setLeaveStats({ total: leaves.length, approved: leaveApproved, pending: leavePending })
      } catch (e) {
        console.log('Leave requests fetch failed:', e)
      }

    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const progress = user?.totalAllottedHours > 0
    ? Math.round((user?.completedHours / user?.totalAllottedHours) * 100)
    : 0

  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f35 100%)'
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(77,168,218,0.2)',
          borderTopColor: '#4da8da',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    )
  }

  return (
    <div className="dash">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .dash { padding: 20px; background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%); min-height: calc(100vh - 70px); }
        .dash-grid { display: grid; grid-template-columns: 280px 1fr 280px; gap: 20px; max-width: 1400px; margin: 0 auto; }
        
        .card { background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%); border: 1px solid rgba(77,168,218,0.15); border-radius: 16px; overflow: hidden; }
        .card-header { background: linear-gradient(90deg, #1e5a7e 0%, #2d7aa8 100%); padding: 12px 18px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.5px; display: flex; align-items: center; gap: 10px; color: #fff; }
        .card-body { padding: 18px; }
        
        .profile-info { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .profile-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #4da8da, #2196F3); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 700; color: #0a1628; border: 3px solid rgba(77,168,218,0.5); flex-shrink: 0; }
        .profile-name { font-size: 1.1rem; font-weight: 600; color: #fff; line-height: 1.3; }
        .profile-batch { font-size: 0.8rem; color: #7aa3c0; line-height: 1.3; }
        .profile-sem { font-size: 0.8rem; color: #7aa3c0; line-height: 1.3; }
        
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .stat-box { background: rgba(13,31,53,0.8); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; padding: 14px 10px; text-align: center; min-width: 0; }
        .stat-value { font-size: 1.5rem; font-weight: 700; color: #4da8da; line-height: 1.2; }
        .stat-label { font-size: 0.7rem; color: #7aa3c0; text-transform: uppercase; letter-spacing: 0.3px; margin-top: 6px; line-height: 1.3; }
        
        .progress-section { margin-top: 10px; }
        .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 0.8rem; }
        .progress-label { color: #7aa3c0; }
        .progress-value { color: #4da8da; font-weight: 600; }
        .progress-bar { height: 8px; background: rgba(77,168,218,0.2); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4da8da, #00d4ff); border-radius: 4px; }
        
        .quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
        .quick-stat { background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%); border: 1px solid rgba(77,168,218,0.15); border-radius: 12px; padding: 14px; display: flex; align-items: center; gap: 12px; }
        .quick-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .quick-stat-icon.blue { background: rgba(77,168,218,0.15); color: #4da8da; }
        .quick-stat-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .quick-stat-icon.yellow { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .quick-stat-icon.orange { background: rgba(251,146,60,0.15); color: #fb923c; }
        .quick-stat-info { display: flex; flex-direction: column; }
        .quick-stat-value { font-size: 1.3rem; font-weight: 700; color: #fff; line-height: 1.2; }
        .quick-stat-label { font-size: 0.7rem; color: #7aa3c0; white-space: nowrap; }
        
        .link-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: rgba(13,31,53,0.6); border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .link-item:hover { background: rgba(77,168,218,0.1); }
        .link-item:last-child { margin-bottom: 0; }
        .link-left { display: flex; align-items: center; gap: 10px; }
        .link-icon { width: 32px; height: 32px; background: rgba(77,168,218,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #4da8da; flex-shrink: 0; }
        .link-text { font-size: 0.85rem; color: #fff; font-weight: 500; }
        .link-arrow { color: #7aa3c0; flex-shrink: 0; }
        
        .key-stats { padding: 18px; }
        .key-stats-title { font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 14px; }
        .attendance-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .attendance-left { }
        .attendance-label { font-size: 0.8rem; color: #7aa3c0; margin-bottom: 2px; }
        .attendance-value { font-size: 1.6rem; font-weight: 700; color: #4da8da; line-height: 1.2; }
        .attendance-link { font-size: 0.75rem; color: #4da8da; cursor: pointer; margin-top: 2px; }
        .circle-progress { width: 60px; height: 60px; position: relative; flex-shrink: 0; }
        .circle-progress svg { transform: rotate(-90deg); }
        .circle-bg { fill: none; stroke: rgba(77,168,218,0.2); stroke-width: 5; }
        .circle-fill { fill: none; stroke: #4da8da; stroke-width: 5; stroke-linecap: round; }
        .circle-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #fff; }
        
        .leave-section { padding: 14px 0; border-top: 1px solid rgba(77,168,218,0.1); border-bottom: 1px solid rgba(77,168,218,0.1); margin: 14px 0; }
        .leave-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .leave-title { font-size: 0.85rem; color: #7aa3c0; }
        .leave-total { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .leave-stats { display: flex; gap: 14px; }
        .leave-stat { display: flex; align-items: center; gap: 5px; font-size: 0.8rem; }
        .leave-stat.approved { color: #4ade80; }
        .leave-stat.pending { color: #fbbf24; }
        
        .notif-row { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; }
        .notif-left { display: flex; align-items: center; gap: 8px; color: #7aa3c0; font-size: 0.85rem; }
        .notif-badge { background: #4da8da; color: #0a1628; font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
        
        .activity-item { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(13,31,53,0.6); border-radius: 10px; margin-bottom: 8px; }
        .activity-item:last-child { margin-bottom: 0; }
        .activity-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
        .activity-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .activity-icon.doc { background: rgba(77,168,218,0.15); color: #4da8da; }
        .activity-icon.check { background: rgba(74,222,128,0.15); color: #4ade80; }
        .activity-info { min-width: 0; flex: 1; }
        .activity-title { font-size: 0.8rem; color: #fff; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .activity-time { font-size: 0.7rem; color: #7aa3c0; margin-top: 1px; }
        .activity-badge { padding: 3px 8px; border-radius: 5px; font-size: 0.65rem; font-weight: 600; flex-shrink: 0; margin-left: 8px; }
        .badge-approved { background: rgba(74,222,128,0.15); color: #4ade80; }
        .badge-verified { background: rgba(77,168,218,0.15); color: #4da8da; }
        .badge-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
        
        .empty-state { text-align: center; padding: 20px; color: #7aa3c0; font-size: 0.85rem; }
        
        @media (max-width: 1200px) { 
          .dash-grid { grid-template-columns: 1fr; } 
          .quick-stats { grid-template-columns: repeat(2, 1fr); } 
        }
        
        @media (max-width: 640px) {
          .dash { padding: 12px; }
          .card-header { padding: 10px 16px; font-size: 0.75rem; }
          .card-body { padding: 14px; }
          .profile-info { gap: 12px; margin-bottom: 14px; }
          .profile-avatar { width: 50px; height: 50px; font-size: 1.2rem; }
          .profile-name { font-size: 1rem; }
          .stats-grid { gap: 8px; }
          .stat-box { padding: 12px 8px; }
          .stat-value { font-size: 1.3rem; }
          .stat-label { font-size: 0.65rem; }
          .quick-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
          .quick-stat { padding: 10px; gap: 10px; }
          .quick-stat-icon { width: 36px; height: 36px; }
          .quick-stat-value { font-size: 1.1rem; }
          .link-item { padding: 10px 12px; }
          .link-icon { width: 28px; height: 28px; }
          .link-text { font-size: 0.8rem; }
        }
      `}</style>

      <div className="dash-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">STUDENT PROFILE</div>
            <div className="card-body">
              <div className="profile-info">
                <div className="profile-avatar">{user?.name?.charAt(0) || 'S'}</div>
                <div>
                  <div className="profile-name">{user?.name || 'Student'}</div>
                  <div className="profile-batch">{user?.batch || 'N/A'}</div>
                  <div className="profile-sem">Semester {user?.semester || 'N/A'}</div>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-box"><div className="stat-value">{user?.totalAllottedDays || 180}</div><div className="stat-label">Allotted Days</div></div>
                <div className="stat-box"><div className="stat-value">{user?.totalAllottedHours || 0}</div><div className="stat-label">Allotted Hours</div></div>
                <div className="stat-box"><div className="stat-value">{Math.round(user?.completedHours || 0)}</div><div className="stat-label">Hours Done</div></div>
                <div className="stat-box"><div className="stat-value">{progress}%</div><div className="stat-label">Progress</div></div>
              </div>
              <div className="progress-section">
                <div className="progress-header"><span className="progress-label">Internship Progress</span><span className="progress-value">{progress}%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiLink size={16} /> QUICK LINKS</div>
            <div className="card-body">
              <Link to="/clinical-cases" className="link-item">
                <div className="link-left"><div className="link-icon"><HiDocumentText size={16} /></div><span className="link-text">Clinical Cases</span></div>
                <HiChevronRight className="link-arrow" />
              </Link>
              <Link to="/attendance" className="link-item">
                <div className="link-left"><div className="link-icon"><HiCalendar size={16} /></div><span className="link-text">Attendance</span></div>
                <HiChevronRight className="link-arrow" />
              </Link>
              <Link to="/leave-requests" className="link-item">
                <div className="link-left"><div className="link-icon"><HiClock size={16} /></div><span className="link-text">Leave Requests</span></div>
                <HiChevronRight className="link-arrow" />
              </Link>
              <Link to="/statistics" className="link-item">
                <div className="link-left"><div className="link-icon"><HiChartBar size={16} /></div><span className="link-text">Statistics</span></div>
                <HiChevronRight className="link-arrow" />
              </Link>
            </div>
          </div>
        </div>

        {/* Center Column */}
        <div>
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="quick-stat-icon blue"><HiDocumentText size={20} /></div>
              <div className="quick-stat-info"><span className="quick-stat-value">{stats.totalCases}</span><span className="quick-stat-label">Total Cases</span></div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon green"><HiCheckCircle size={20} /></div>
              <div className="quick-stat-info"><span className="quick-stat-value">{stats.approved}</span><span className="quick-stat-label">Approved</span></div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon yellow"><HiClock size={20} /></div>
              <div className="quick-stat-info"><span className="quick-stat-value">{stats.pending}</span><span className="quick-stat-label">Pending</span></div>
            </div>
            <div className="quick-stat">
              <div className="quick-stat-icon orange"><HiChartBar size={20} /></div>
              <div className="quick-stat-info"><span className="quick-stat-value">{attendanceStats.hoursLogged}h</span><span className="quick-stat-label">Hours Logged</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiDocumentText size={16} /> RECENT CLINICAL CASES</div>
            <div className="card-body">
              {recentCases.length > 0 ? (
                recentCases.map((c, i) => (
                  <div key={c._id || i} className="activity-item">
                    <div className="activity-left">
                      <div className="activity-icon doc"><HiDocumentText size={16} /></div>
                      <div className="activity-info">
                        <div className="activity-title">{c.caseNumber || 'Case'} - Patient {c.patientInfo?.initials || 'N/A'}</div>
                        <div className="activity-time">{c.testsPerformed?.length || 0} tests • {new Date(c.sessionDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <span className={`activity-badge ${c.supervisorApproval?.status === 'Approved' ? 'badge-approved' : c.supervisorApproval?.status === 'Pending' ? 'badge-pending' : 'badge-verified'}`}>
                      {c.supervisorApproval?.status || 'Pending'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state">No clinical cases yet. <Link to="/clinical-cases" style={{ color: '#4da8da' }}>Add your first case</Link></div>
              )}
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header"><HiCalendar size={16} /> RECENT ATTENDANCE</div>
            <div className="card-body">
              {recentAttendance.length > 0 ? (
                recentAttendance.map((a, i) => (
                  <div key={a._id || i} className="activity-item">
                    <div className="activity-left">
                      <div className="activity-icon check"><HiCalendar size={16} /></div>
                      <div className="activity-info">
                        <div className="activity-title">{new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        <div className="activity-time">
                          {a.timeIn ? new Date(a.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'} -
                          {a.timeOut ? new Date(a.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In progress'}
                        </div>
                      </div>
                    </div>
                    <span className={`activity-badge ${a.timeOut ? 'badge-approved' : 'badge-pending'}`}>
                      {a.totalHours ? `${a.totalHours.toFixed(1)}h` : 'Active'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty-state">No attendance records yet. <Link to="/attendance" style={{ color: '#4da8da' }}>Check in now</Link></div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="key-stats">
              <div className="key-stats-title">Attendance Summary</div>
              <div className="attendance-row">
                <div className="attendance-left">
                  <div className="attendance-label">Days Present</div>
                  <div className="attendance-value">{attendanceStats.daysPresent}</div>
                  <Link to="/attendance" className="attendance-link">View Details →</Link>
                </div>
                <div className="circle-progress">
                  <svg viewBox="0 0 40 40" width="60" height="60">
                    <circle className="circle-bg" cx="20" cy="20" r="17" />
                    <circle className="circle-fill" cx="20" cy="20" r="17" strokeDasharray={`${(progress / 100) * 106.8} 106.8`} />
                  </svg>
                  <div className="circle-text">{progress}%</div>
                </div>
              </div>

              <div className="leave-section">
                <div className="leave-header"><span className="leave-title">Leave Requests</span><span className="leave-total">{leaveStats.total}</span></div>
                <div className="leave-stats">
                  <span className="leave-stat approved"><HiCheckCircle size={14} /> {leaveStats.approved} Approved</span>
                  <span className="leave-stat pending"><HiClock size={14} /> {leaveStats.pending} Pending</span>
                </div>
              </div>

              <div className="notif-row">
                <div className="notif-left"><HiBell size={16} /> Notifications</div>
                <span className="notif-badge">{stats.pending}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiBell size={16} /> TODAY'S STATUS</div>
            <div className="card-body">
              {attendanceStats.todayStatus ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: '0.9rem', color: '#4ade80', marginBottom: 8 }}>✓ Checked In</div>
                  <div style={{ fontSize: '0.85rem', color: '#7aa3c0' }}>
                    {new Date(attendanceStats.todayStatus.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {attendanceStats.todayStatus.timeOut && ` - ${new Date(attendanceStats.todayStatus.timeOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </div>
                  {attendanceStats.todayStatus.location && (
                    <div style={{ fontSize: '0.8rem', color: '#7aa3c0', marginTop: 4 }}>{attendanceStats.todayStatus.location}</div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: 8 }}>Not checked in today</div>
                  <Link to="/attendance" style={{ fontSize: '0.85rem', color: '#4da8da' }}>Check in now →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
