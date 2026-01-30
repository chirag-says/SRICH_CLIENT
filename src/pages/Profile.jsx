import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiUser, HiMail, HiPhone, HiAcademicCap, HiClock, HiPencil, HiLockClosed, HiCheckCircle, HiX } from 'react-icons/hi'

const Profile = () => {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ allottedDays: 180, allottedHours: 0, hoursCompleted: 0, attendance: 0 })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [editData, setEditData] = useState({ name: '', phone: '' })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)

      // Fetch attendance to calculate hours
      const attendanceRes = await api.get('/attendance')
      const attendance = attendanceRes.data.data || []
      const hoursCompleted = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0)

      setStats({
        allottedDays: user?.totalAllottedDays || 180,
        allottedHours: user?.totalAllottedHours || 1200,
        hoursCompleted: Math.round(hoursCompleted),
        attendance: attendance.length
      })

      setEditData({
        name: user?.name || '',
        phone: user?.phone || ''
      })
    } catch (error) {
      console.error('Failed to fetch profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = stats.allottedHours > 0 ? (stats.hoursCompleted / stats.allottedHours) * 100 : 0

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setSubmitting(true)
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password changed successfully!')
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setSubmitting(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (!editData.name.trim()) {
      toast.error('Name is required')
      return
    }

    try {
      setSubmitting(true)
      const response = await api.put('/users/profile', editData)
      updateUser(response.data.data)
      toast.success('Profile updated successfully!')
      setShowEditModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
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
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 20px; width: 100%; max-width: 420px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(77,168,218,0.1); }
        .modal-title { font-size: 1.1rem; font-weight: 600; color: #fff; }
        .modal-close { background: none; border: none; color: #7aa3c0; cursor: pointer; padding: 4px; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 0.85rem; color: #7aa3c0; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 14px 16px; background: rgba(13,31,53,0.8); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #fff; font-size: 0.95rem; }
        .form-input:focus { outline: none; border-color: #4da8da; }
        .modal-footer { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(77,168,218,0.1); }
        .btn-secondary { flex: 1; padding: 14px; background: transparent; border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #7aa3c0; cursor: pointer; font-weight: 600; font-family: inherit; }
        .btn-primary { flex: 1; padding: 14px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); border: none; border-radius: 10px; color: #fff; cursor: pointer; font-weight: 600; font-family: inherit; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        
        @media (max-width: 768px) { 
          .grid { grid-template-columns: 1fr; } 
        }
        
        @media (max-width: 640px) {
          .page { padding: 16px; }
          .page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .edit-btn { width: 100%; justify-content: center; }
          .card-body { padding: 16px; }
          .modal { margin: 10px; max-height: calc(100vh - 40px); overflow-y: auto; }
          .form-group input { width: 100%; }
          
          /* Profile specific responsive adjustments */
          .circle-wrapper { width: 120px; height: 120px; }
          .circle-wrapper svg { width: 120px; height: 120px; }
          .detail-item { gap: 12px; }
          .detail-icon { width: 40px; height: 40px; }
          .detail-icon svg { width: 18px; height: 18px; } /* Icon resize */
        }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <div><h1 className="page-title">Profile</h1><p className="page-subtitle">Manage your account settings</p></div>
          <button className="edit-btn" onClick={() => setShowEditModal(true)}><HiPencil size={18} /> Edit Profile</button>
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-body">
              <div className="profile-section">
                <div className="avatar">{user?.name?.charAt(0).toUpperCase() || 'S'}</div>
                <h2 className="profile-name">{user?.name || 'Student'}</h2>
                <p className="profile-role">{user?.role || 'Student'}</p>
                <p className="profile-batch">{user?.batch || 'N/A'} • Semester {user?.semester || 'N/A'}</p>
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
              <div className="detail-item"><div className="detail-icon blue"><HiUser size={22} /></div><div><p className="detail-label">Full Name</p><p className="detail-value">{user?.name || 'N/A'}</p></div></div>
              <div className="detail-item"><div className="detail-icon purple"><HiMail size={22} /></div><div><p className="detail-label">Email Address</p><p className="detail-value">{user?.email || 'N/A'}</p></div></div>
              <div className="detail-item"><div className="detail-icon green"><HiPhone size={22} /></div><div><p className="detail-label">Phone Number</p><p className="detail-value">{user?.phone || 'Not provided'}</p></div></div>
              <div className="detail-item"><div className="detail-icon orange"><HiAcademicCap size={22} /></div><div><p className="detail-label">Registration Number</p><p className="detail-value">{user?.registrationNumber || 'N/A'}</p></div></div>
              <div className="detail-item"><div className="detail-icon teal"><HiClock size={22} /></div><div><p className="detail-label">Total Allotted Hours</p><p className="detail-value">{user?.totalAllottedHours || 0} hours</p></div></div>

              <div className="security-section">
                <h4 className="security-title">Security</h4>
                <button className="security-btn" onClick={() => setShowPasswordModal(true)}>
                  <div className="security-icon"><HiLockClosed size={22} /></div>
                  <div className="security-text"><p className="security-text-title">Change Password</p><p className="security-text-desc">Update your account password</p></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}><HiX size={20} /></button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Update Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><HiX size={20} /></button>
            </div>
            <form onSubmit={handleProfileUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" value={editData.phone} onChange={e => setEditData({ ...editData, phone: e.target.value })} placeholder="Enter phone number" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
