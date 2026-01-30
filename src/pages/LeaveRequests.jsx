import { useState, useEffect } from 'react'
import { format, differenceInDays } from 'date-fns'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiPlus, HiClock, HiCheckCircle, HiXCircle, HiX, HiCalendar, HiBan } from 'react-icons/hi'

const LeaveRequests = () => {
    const [loading, setLoading] = useState(true)
    const [requests, setRequests] = useState([])
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, cancelled: 0 })
    const [showModal, setShowModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        leaveType: 'Sick',
        startDate: '',
        endDate: '',
        reason: '',
        isEmergency: false
    })

    const leaveTypes = ['Sick', 'Casual', 'Academic', 'Personal', 'Emergency', 'Other']

    useEffect(() => {
        fetchLeaveRequests()
    }, [])

    const fetchLeaveRequests = async () => {
        try {
            setLoading(true)
            const response = await api.get('/leave-requests')
            const data = response.data.data || []
            setRequests(data)

            // Calculate stats
            const pending = data.filter(r => r.status === 'Pending').length
            const approved = data.filter(r => r.status === 'Approved').length
            const rejected = data.filter(r => r.status === 'Rejected').length
            const cancelled = data.filter(r => r.status === 'Cancelled').length
            setStats({ pending, approved, rejected, cancelled })
        } catch (error) {
            console.error('Failed to fetch leave requests:', error)
            toast.error('Failed to load leave requests')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.startDate || !formData.endDate) {
            toast.error('Please select start and end dates')
            return
        }

        if (!formData.reason.trim()) {
            toast.error('Please enter a reason for leave')
            return
        }

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            toast.error('End date must be after start date')
            return
        }

        try {
            setSubmitting(true)
            await api.post('/leave-requests', formData)
            toast.success('Leave request submitted successfully!')
            setShowModal(false)
            setFormData({
                leaveType: 'Sick',
                startDate: '',
                endDate: '',
                reason: '',
                isEmergency: false
            })
            fetchLeaveRequests()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit leave request')
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this leave request?')) return

        try {
            await api.put(`/leave-requests/${id}/cancel`)
            toast.success('Leave request cancelled')
            fetchLeaveRequests()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel request')
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
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .page-subtitle { color: #7aa3c0; }
        .btn-primary { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(77,168,218,0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 14px; padding: 18px; display: flex; align-items: center; justify-content: space-between; }
        .stat-left { display: flex; align-items: center; gap: 12px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.yellow { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .stat-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .stat-icon.red { background: rgba(248,113,113,0.15); color: #f87171; }
        .stat-icon.gray { background: rgba(107,114,128,0.15); color: #6b7280; }
        .stat-label { font-size: 0.9rem; color: #7aa3c0; }
        .stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; }
        
        .card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 16px; overflow: hidden; }
        .card-header { background: linear-gradient(90deg, #1e5a7e, #2d7aa8); padding: 16px 24px; font-weight: 600; color: #fff; }
        .card-body { padding: 20px; }
        
        .leave-item { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px; background: rgba(13,31,53,0.6); border-radius: 12px; margin-bottom: 12px; }
        .leave-item:last-child { margin-bottom: 0; }
        .leave-left { display: flex; gap: 14px; flex: 1; }
        .leave-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .leave-icon.pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .leave-icon.approved { background: rgba(74,222,128,0.15); color: #4ade80; }
        .leave-icon.rejected { background: rgba(248,113,113,0.15); color: #f87171; }
        .leave-icon.cancelled { background: rgba(107,114,128,0.15); color: #6b7280; }
        .leave-type { font-weight: 600; color: #fff; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-left: 10px; }
        .badge-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .badge-approved { background: rgba(74,222,128,0.15); color: #4ade80; }
        .badge-rejected { background: rgba(248,113,113,0.15); color: #f87171; }
        .badge-cancelled { background: rgba(107,114,128,0.15); color: #6b7280; }
        .leave-dates { font-size: 0.9rem; color: #7aa3c0; margin-top: 4px; }
        .leave-reason { font-size: 0.85rem; color: #6b8ca8; margin-top: 4px; }
        .leave-comment { font-size: 0.85rem; color: #4da8da; font-style: italic; margin-top: 6px; }
        .cancel-btn { padding: 8px; background: transparent; border: 1px solid rgba(248,113,113,0.3); border-radius: 8px; color: #f87171; cursor: pointer; }
        .cancel-btn:hover { background: rgba(248,113,113,0.1); }
        
        .empty-state { text-align: center; padding: 40px; color: #7aa3c0; }
        .empty-state h3 { color: #fff; margin-bottom: 8px; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 20px; width: 100%; max-width: 480px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(77,168,218,0.1); }
        .modal-title { font-size: 1.2rem; font-weight: 600; color: #fff; }
        .modal-close { padding: 8px; background: transparent; border: none; color: #7aa3c0; cursor: pointer; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 0.85rem; color: #7aa3c0; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea { width: 100%; padding: 14px 16px; background: rgba(13,31,53,0.8); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #fff; font-size: 0.95rem; font-family: inherit; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #4da8da; }
        .form-textarea { min-height: 80px; resize: vertical; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-checkbox { display: flex; align-items: center; gap: 10px; color: #7aa3c0; font-size: 0.9rem; cursor: pointer; }
        .form-checkbox input { width: 18px; height: 18px; cursor: pointer; }
        .modal-footer { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(77,168,218,0.1); }
        .btn-secondary { flex: 1; padding: 14px; background: transparent; border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #7aa3c0; cursor: pointer; font-weight: 600; font-family: inherit; }
        .btn-secondary:hover { border-color: #4da8da; color: #fff; }
        .btn-submit { flex: 1; padding: 14px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); border: none; border-radius: 10px; color: #fff; cursor: pointer; font-weight: 600; font-family: inherit; }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        
        @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        
        @media (max-width: 640px) {
            .page { padding: 16px; }
            .page-header { flex-direction: column; align-items: stretch; gap: 12px; }
            .stats-row { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .stat-card { padding: 14px; flex-direction: column; align-items: flex-start; gap: 6px; }
            .stat-left { width: 100%; }
            .stat-value { font-size: 1.4rem; align-self: flex-end; margin-top: -30px; }
            
            .leave-item { padding: 14px; }
            .leave-left { gap: 10px; }
            .leave-icon { width: 40px; height: 40px; }
            .badge { margin-left: 6px; padding: 3px 8px; font-size: 0.65rem; }
            .leave-dates { font-size: 0.8rem; }
            .leave-reason { font-size: 0.8rem; }
            
            .form-row { grid-template-columns: 1fr; }
            .modal { margin: 10px; max-height: calc(100vh - 40px); overflow-y: auto; }
        }
      `}</style>

            <div className="page-container">
                <div className="page-header">
                    <div><h1 className="page-title">Leave Requests</h1><p className="page-subtitle">Manage your leave applications</p></div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}><HiPlus size={20} /> New Request</button>
                </div>

                <div className="stats-row">
                    <div className="stat-card"><div className="stat-left"><div className="stat-icon yellow"><HiClock size={20} /></div><span className="stat-label">Pending</span></div><span className="stat-value">{stats.pending}</span></div>
                    <div className="stat-card"><div className="stat-left"><div className="stat-icon green"><HiCheckCircle size={20} /></div><span className="stat-label">Approved</span></div><span className="stat-value">{stats.approved}</span></div>
                    <div className="stat-card"><div className="stat-left"><div className="stat-icon red"><HiXCircle size={20} /></div><span className="stat-label">Rejected</span></div><span className="stat-value">{stats.rejected}</span></div>
                    <div className="stat-card"><div className="stat-left"><div className="stat-icon gray"><HiBan size={20} /></div><span className="stat-label">Cancelled</span></div><span className="stat-value">{stats.cancelled}</span></div>
                </div>

                <div className="card">
                    <div className="card-header">Your Leave Requests</div>
                    <div className="card-body">
                        {requests.length > 0 ? (
                            requests.map(r => {
                                const days = differenceInDays(new Date(r.endDate), new Date(r.startDate)) + 1
                                const iconClass = r.status === 'Approved' ? 'approved' : r.status === 'Rejected' ? 'rejected' : r.status === 'Cancelled' ? 'cancelled' : 'pending'
                                const badgeClass = `badge-${r.status.toLowerCase()}`
                                return (
                                    <div key={r._id} className="leave-item">
                                        <div className="leave-left">
                                            <div className={`leave-icon ${iconClass}`}>
                                                {r.status === 'Approved' && <HiCheckCircle size={22} />}
                                                {r.status === 'Pending' && <HiClock size={22} />}
                                                {r.status === 'Rejected' && <HiXCircle size={22} />}
                                                {r.status === 'Cancelled' && <HiBan size={22} />}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span className="leave-type">{r.leaveType} Leave</span>
                                                    <span className={`badge ${badgeClass}`}>{r.status}</span>
                                                    {r.isEmergency && <span className="badge badge-rejected" style={{ marginLeft: 6 }}>Emergency</span>}
                                                </div>
                                                <div className="leave-dates">
                                                    {format(new Date(r.startDate), 'MMM d')} - {format(new Date(r.endDate), 'MMM d, yyyy')} • {days} day{days > 1 ? 's' : ''}
                                                </div>
                                                <div className="leave-reason">{r.reason}</div>
                                                {r.reviewComments && <div className="leave-comment">"{r.reviewComments}"</div>}
                                            </div>
                                        </div>
                                        {r.status === 'Pending' && (
                                            <button className="cancel-btn" onClick={() => handleCancel(r._id)} title="Cancel Request">
                                                <HiX size={16} />
                                            </button>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="empty-state">
                                <h3>No leave requests</h3>
                                <p>Click "New Request" to submit a leave application</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">New Leave Request</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiX size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Leave Type *</label>
                                    <select className="form-select" value={formData.leaveType} onChange={e => setFormData({ ...formData, leaveType: e.target.value })}>
                                        {leaveTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Start Date *</label>
                                        <input type="date" className="form-input" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date *</label>
                                        <input type="date" className="form-input" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} min={formData.startDate || new Date().toISOString().split('T')[0]} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Reason *</label>
                                    <textarea className="form-textarea" placeholder="Enter reason for leave..." value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}></textarea>
                                </div>
                                <label className="form-checkbox">
                                    <input type="checkbox" checked={formData.isEmergency} onChange={e => setFormData({ ...formData, isEmergency: e.target.checked })} />
                                    This is an emergency leave
                                </label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeaveRequests
