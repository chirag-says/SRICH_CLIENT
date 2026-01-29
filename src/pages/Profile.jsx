import { useAuthStore } from '../store/authStore'
import { HiUser, HiMail, HiPhone, HiAcademicCap, HiClock, HiPencil, HiLockClosed, HiCheckCircle } from 'react-icons/hi'

const Profile = () => {
  const { user } = useAuthStore()
  const stats = { allottedDays: 180, allottedHours: 1200, hoursCompleted: 980, attendance: 92 }
  const progressPercent = (stats.hoursCompleted / stats.allottedHours) * 100

  return (
    <div className="page">
      <style>{`
        .page { padding: 24px; background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%); min-height: calc(100vh - 70px); }
        .page-container { max-width: 1000px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .page-subtitle { color: #7aa3c0; }
        .edit-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: transparent; border: 1px solid rgba(77,168,218,0.3); border-radius: 10px; color: #7aa3c0; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .edit-btn:hover { background: rgba(77,168,218,0.1); border-color: #4da8da; color: #4da8da; }
        
        .grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
        .card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 16px; overflow: hidden; }
        .card-body { padding: 24px; }
        
        .profile-section { text-align: center; }
        .avatar { width: 100px; height: 100px; margin: 0 auto 16px; border-radius: 50%; background: linear-gradient(135deg, #4da8da, #2196F3); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; color: #0a1628; border: 4px solid rgba(77,168,218,0.3); }
        .profile-name { font-size: 1.4rem; font-weight: 700; color: #fff; }
        .profile-role { color: #7aa3c0; margin: 4px 0; }
        .profile-batch { font-size: 0.9rem; color: #4da8da; }
        
        .circle-container { margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(77,168,218,0.1); }
        .circle-wrapper { width: 140px; height: 140px; margin: 0 auto; position: relative; }
        .circle-wrapper svg { transform: rotate(-90deg); }
        .circle-bg { fill: none; stroke: rgba(77,168,218,0.2); stroke-width: 10; }
        .circle-fill { fill: none; stroke: url(#grad); stroke-width: 10; stroke-linecap: round; }
        .circle-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .circle-value { font-size: 1.5rem; font-weight: 700; color: #fff; }
        .circle-label { font-size: 0.75rem; color: #7aa3c0; }
        .hours-text { text-align: center; margin-top: 12px; font-size: 0.9rem; color: #7aa3c0; }
        
        .details-title { font-size: 1.1rem; font-weight: 600; color: #fff; margin-bottom: 20px; }
        .detail-item { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .detail-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .detail-icon.blue { background: rgba(77,168,218,0.15); color: #4da8da; }
        .detail-icon.purple { background: rgba(139,92,246,0.15); color: #8b5cf6; }
        .detail-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .detail-icon.orange { background: rgba(251,146,60,0.15); color: #fb923c; }
        .detail-icon.teal { background: rgba(20,184,166,0.15); color: #14b8a6; }
        .detail-label { font-size: 0.85rem; color: #7aa3c0; margin-bottom: 2px; }
        .detail-value { font-weight: 600; color: #fff; }
        
        .security-section { margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(77,168,218,0.1); }
        .security-title { font-weight: 600; color: #fff; margin-bottom: 16px; }
        .security-btn { width: 100%; padding: 16px; background: rgba(13,31,53,0.6); border: 1px solid rgba(248,113,113,0.2); border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
        .security-btn:hover { background: rgba(248,113,113,0.05); border-color: rgba(248,113,113,0.4); }
        .security-icon { width: 48px; height: 48px; background: rgba(248,113,113,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #f87171; }
        .security-text { text-align: left; }
        .security-text-title { font-weight: 600; color: #fff; margin-bottom: 2px; }
        .security-text-desc { font-size: 0.85rem; color: #7aa3c0; }
        
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <div><h1 className="page-title">Profile</h1><p className="page-subtitle">Manage your account settings</p></div>
          <button className="edit-btn"><HiPencil size={18} /> Edit Profile</button>
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-body">
              <div className="profile-section">
                <div className="avatar">{user?.name?.charAt(0).toUpperCase() || 'C'}</div>
                <h2 className="profile-name">{user?.name || 'Chirag Sharma'}</h2>
                <p className="profile-role">{user?.role || 'Student'}</p>
                <p className="profile-batch">{user?.batch || '2022-2026'} • Semester {user?.semester || 4}</p>
              </div>
              <div className="circle-container">
                <div className="circle-wrapper">
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4ade80" /><stop offset="100%" stopColor="#4da8da" /></linearGradient></defs>
                    <circle className="circle-bg" cx="70" cy="70" r="60" />
                    <circle className="circle-fill" cx="70" cy="70" r="60" strokeDasharray={`${2 * Math.PI * 60 * (progressPercent / 100)} ${2 * Math.PI * 60}`} />
                  </svg>
                  <div className="circle-text"><div className="circle-value">{Math.round(progressPercent)}%</div><div className="circle-label">Complete</div></div>
                </div>
                <p className="hours-text">{stats.hoursCompleted}/{stats.allottedHours} hours</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="details-title">Account Details</h3>
              <div className="detail-item"><div className="detail-icon blue"><HiUser size={22} /></div><div><p className="detail-label">Full Name</p><p className="detail-value">{user?.name || 'Chirag Sharma'}</p></div></div>
              <div className="detail-item"><div className="detail-icon purple"><HiMail size={22} /></div><div><p className="detail-label">Email Address</p><p className="detail-value">{user?.email || 'chirag@srish.edu.in'}</p></div></div>
              <div className="detail-item"><div className="detail-icon green"><HiPhone size={22} /></div><div><p className="detail-label">Phone Number</p><p className="detail-value">{user?.phone || '+91 98765 43210'}</p></div></div>
              <div className="detail-item"><div className="detail-icon orange"><HiAcademicCap size={22} /></div><div><p className="detail-label">Registration Number</p><p className="detail-value">{user?.registrationNumber || 'SRISH2024001'}</p></div></div>
              <div className="detail-item"><div className="detail-icon teal"><HiClock size={22} /></div><div><p className="detail-label">Total Allotted Hours</p><p className="detail-value">{user?.totalAllottedHours || 1200} hours</p></div></div>

              <div className="security-section">
                <h4 className="security-title">Security</h4>
                <button className="security-btn">
                  <div className="security-icon"><HiLockClosed size={22} /></div>
                  <div className="security-text"><p className="security-text-title">Change Password</p><p className="security-text-desc">Update your account password</p></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
