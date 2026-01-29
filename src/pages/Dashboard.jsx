import { useAuthStore } from '../store/authStore'
import { HiDocumentText, HiCheckCircle, HiClock, HiChartBar, HiCalendar, HiLink, HiBell, HiChevronRight } from 'react-icons/hi'

const Dashboard = () => {
  const { user } = useAuthStore()

  const stats = { totalCases: 24, approved: 20, pending: 4, avgDuration: '45m' }
  const profile = { allottedDays: 180, allottedHours: 1200, hoursDone: 980, progress: 81.7 }
  const schedule = [
    { time: '8:00 AM', event: 'ANATOMY LECTURE' },
    { time: '10:30 AM', event: 'CLINICAL ROUNDS' },
    { time: '2:00 PM', event: 'PHARMACOLOGY LAB' }
  ]
  const announcements = ['3RD SEMESTER RESULTS ARE OUT NOW', '25 YEARS COMPLETED - SILVER JUBILEE', 'HAPPY TEACHERS DAY']
  const quickLinks = ['3RD SEM RESULTS', 'ANATOMY MODULE 3']
  const recentActivity = [
    { title: 'PTA Test - Patient JD', time: '2 hours ago', status: 'Approved' },
    { title: 'Check-in recorded', time: 'Today 9:00 AM', status: 'Verified' },
    { title: 'ABR Test - Patient MK', time: 'Yesterday', status: 'Pending' }
  ]

  return (
    <div className="dash">
      <style>{`
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
        
        .schedule-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .schedule-list { display: flex; flex-direction: column; gap: 6px; }
        .schedule-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(77,168,218,0.1); }
        .schedule-item:last-child { border-bottom: none; }
        .schedule-time { font-size: 0.8rem; color: #4da8da; font-weight: 500; min-width: 65px; }
        .schedule-event { font-size: 0.85rem; color: #fff; font-weight: 500; }
        
        .announcements { display: flex; flex-direction: column; gap: 8px; }
        .announce-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.8rem; color: #a8c5db; line-height: 1.4; }
        .announce-dot { width: 6px; height: 6px; background: #4da8da; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        
        .link-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: rgba(13,31,53,0.6); border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; }
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
        
        @media (max-width: 1200px) { .dash-grid { grid-template-columns: 1fr; } .quick-stats { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="dash-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">STUDENT PROFILE</div>
            <div className="card-body">
              <div className="profile-info">
                <div className="profile-avatar">{user?.name?.charAt(0) || 'C'}</div>
                <div>
                  <div className="profile-name">{user?.name?.split(' ')[0] || 'Chirag'}</div>
                  <div className="profile-batch">{user?.batch || '2022-2026'}</div>
                  <div className="profile-sem">Semester {user?.semester || 3}</div>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-box"><div className="stat-value">{profile.allottedDays}</div><div className="stat-label">Allotted Days</div></div>
                <div className="stat-box"><div className="stat-value">{profile.allottedHours}</div><div className="stat-label">Allotted Hours</div></div>
                <div className="stat-box"><div className="stat-value">{profile.hoursDone}</div><div className="stat-label">Hours Done</div></div>
                <div className="stat-box"><div className="stat-value">{profile.progress}%</div><div className="stat-label">Progress</div></div>
              </div>
              <div className="progress-section">
                <div className="progress-header"><span className="progress-label">Internship Progress</span><span className="progress-value">82%</span></div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '82%' }}></div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiChartBar size={14} /> STATISTICS</div>
            <div className="card-body">
              {quickLinks.map((link, i) => (
                <div key={i} className="link-item">
                  <div className="link-left"><div className="link-icon"><HiDocumentText size={14} /></div><span className="link-text">{link}</span></div>
                  <HiChevronRight className="link-arrow" size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="quick-stats">
            <div className="quick-stat"><div className="quick-stat-icon blue"><HiDocumentText size={18} /></div><div className="quick-stat-info"><div className="quick-stat-value">{stats.totalCases}</div><div className="quick-stat-label">Total Cases</div></div></div>
            <div className="quick-stat"><div className="quick-stat-icon green"><HiCheckCircle size={18} /></div><div className="quick-stat-info"><div className="quick-stat-value">{stats.approved}</div><div className="quick-stat-label">Approved</div></div></div>
            <div className="quick-stat"><div className="quick-stat-icon yellow"><HiClock size={18} /></div><div className="quick-stat-info"><div className="quick-stat-value">{stats.pending}</div><div className="quick-stat-label">Pending</div></div></div>
            <div className="quick-stat"><div className="quick-stat-icon orange"><HiChartBar size={18} /></div><div className="quick-stat-info"><div className="quick-stat-value">{stats.avgDuration}</div><div className="quick-stat-label">Avg Duration</div></div></div>
          </div>

          <div className="card">
            <div className="card-header"><HiCalendar size={14} /> DAILY SCHEDULE</div>
            <div className="card-body">
              <div className="schedule-grid">
                <div className="schedule-list">
                  {schedule.map((s, i) => <div key={i} className="schedule-item"><span className="schedule-time">{s.time}</span><span className="schedule-event">{s.event}</span></div>)}
                </div>
                <div className="announcements">
                  {announcements.map((a, i) => <div key={i} className="announce-item"><div className="announce-dot"></div><span>{a}</span></div>)}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiLink size={14} /> QUICK LINKS</div>
            <div className="card-body">
              {quickLinks.map((link, i) => (
                <div key={i} className="link-item">
                  <div className="link-left"><div className="link-icon"><HiDocumentText size={14} /></div><span className="link-text">{link}</span></div>
                  <HiChevronRight className="link-arrow" size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="key-stats">
              <div className="key-stats-title">Key Statistics</div>
              <div className="attendance-row">
                <div className="attendance-left">
                  <div className="attendance-label">Attendance</div>
                  <div className="attendance-value">92%</div>
                  <div className="attendance-link">⊕ Details</div>
                </div>
                <div className="circle-progress">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle className="circle-bg" cx="30" cy="30" r="25" />
                    <circle className="circle-fill" cx="30" cy="30" r="25" strokeDasharray={`${2 * Math.PI * 25 * 0.92} ${2 * Math.PI * 25}`} />
                  </svg>
                  <div className="circle-text">92%</div>
                </div>
              </div>
              <div className="leave-section">
                <div className="leave-header"><span className="leave-title">Leave Requests</span><span className="leave-total">35</span></div>
                <div className="leave-stats">
                  <div className="leave-stat approved"><HiCheckCircle size={14} /> <span>24</span> <span style={{ opacity: 0.8 }}>Approved</span></div>
                  <div className="leave-stat pending"><HiClock size={14} /> <span>5</span> <span style={{ opacity: 0.8 }}>Pending</span></div>
                </div>
              </div>
              <div className="notif-row">
                <div className="notif-left"><HiBell size={16} /> 1 New Notification</div>
                <span className="notif-badge">1</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><HiDocumentText size={14} /> RECENT ACTIVITY</div>
            <div className="card-body">
              {recentActivity.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-left">
                    <div className={`activity-icon ${a.status === 'Verified' ? 'check' : 'doc'}`}>
                      {a.status === 'Verified' ? <HiCheckCircle size={14} /> : <HiDocumentText size={14} />}
                    </div>
                    <div className="activity-info">
                      <div className="activity-title">{a.title}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </div>
                  <span className={`activity-badge badge-${a.status.toLowerCase()}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
