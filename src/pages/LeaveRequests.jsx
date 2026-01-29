import { useState } from 'react'
import { format, differenceInDays } from 'date-fns'
import { HiPlus, HiClock, HiCheckCircle, HiXCircle, HiX, HiCalendar, HiBan } from 'react-icons/hi'

const LeaveRequests = () => {
    const [showModal, setShowModal] = useState(false)
    const stats = { pending: 5, approved: 24, rejected: 4, cancelled: 2 }
    const requests = [
        { _id: '1', type: 'Sick Leave', start: new Date(Date.now() + 86400000 * 5).toISOString(), end: new Date(Date.now() + 86400000 * 7).toISOString(), reason: 'Medical appointment', status: 'Approved', comment: 'Get well soon!' },
        { _id: '2', type: 'Personal Leave', start: new Date(Date.now() + 86400000 * 15).toISOString(), end: new Date(Date.now() + 86400000 * 16).toISOString(), reason: 'Family function', status: 'Pending' },
        { _id: '3', type: 'Academic', start: new Date(Date.now() - 86400000 * 10).toISOString(), end: new Date(Date.now() - 86400000 * 8).toISOString(), reason: 'Conference attendance', status: 'Rejected', comment: 'Insufficient notice' }
    ]

    return (
        <div className="page">
            <style>{`
        .page { padding: 24px; background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%); min-height: calc(100vh - 70px); }
        .page-container { max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .page-subtitle { color: #7aa3c0; }
        .btn-primary { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(77,168,218,0.3); }
        
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
        .leave-type { font-weight: 600; color: #fff; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-left: 10px; }
        .badge-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .badge-approved { background: rgba(74,222,128,0.15); color: #4ade80; }
        .badge-rejected { background: rgba(248,113,113,0.15); color: #f87171; }
        .leave-dates { font-size: 0.9rem; color: #7aa3c0; margin-top: 4px; }
        .leave-reason { font-size: 0.85rem; color: #6b8ca8; margin-top: 4px; }
        .leave-comment { font-size: 0.85rem; color: #4da8da; font-style: italic; margin-top: 6px; }
        .cancel-btn { padding: 8px; background: transparent; border: 1px solid rgba(248,113,113,0.3); border-radius: 8px; color: #f87171; cursor: pointer; }
        .cancel-btn:hover { background: rgba(248,113,113,0.1); }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 20px; width: 100%; max-width: 480px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(77,168,218,0.1); }
        .modal-title { font-size: 1.2rem; font-weight: 600; color: #fff; }
        .modal-close { padding: 8px; background: transparent; border: none; color: #7aa3c0; cursor: pointer; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 18px; }
        .form-label { display: block; font-size: 0.85rem; color: #7aa3c0; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea { width: 100%; padding: 14px 16px; background: rgba(13,31,53,0.8); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #fff; font-size: 0.95rem; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #4da8da; }
        .form-textarea { min-height: 80px; resize: vertical; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .modal-footer { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(77,168,218,0.1); }
        .btn-secondary { flex: 1; padding: 14px; background: transparent; border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #7aa3c0; cursor: pointer; font-weight: 600; }
        .btn-submit { flex: 1; padding: 14px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); border: none; border-radius: 10px; color: #fff; cursor: pointer; font-weight: 600; }
        
        @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
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
                        {requests.map(r => {
                            const days = differenceInDays(new Date(r.end), new Date(r.start)) + 1
                            const iconClass = r.status === 'Approved' ? 'approved' : r.status === 'Rejected' ? 'rejected' : 'pending'
                            const badgeClass = `badge-${r.status.toLowerCase()}`
                            return (
                                <div key={r._id} className="leave-item">
                                    <div className="leave-left">
                                        <div className={`leave-icon ${iconClass}`}>
                                            {r.status === 'Approved' && <HiCheckCircle size={22} />}
                                            {r.status === 'Pending' && <HiClock size={22} />}
                                            {r.status === 'Rejected' && <HiXCircle size={22} />}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}><span className="leave-type">{r.type}</span><span className={`badge ${badgeClass}`}>{r.status}</span></div>
                                            <div className="leave-dates">{format(new Date(r.start), 'MMM d')} - {format(new Date(r.end), 'MMM d, yyyy')} • {days} day{days > 1 ? 's' : ''}</div>
                                            <div className="leave-reason">{r.reason}</div>
                                            {r.comment && <div className="leave-comment">"{r.comment}"</div>}
                                        </div>
                                    </div>
                                    {r.status === 'Pending' && <button className="cancel-btn"><HiX size={16} /></button>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3 className="modal-title">New Leave Request</h3><button className="modal-close" onClick={() => setShowModal(false)}><HiX size={20} /></button></div>
                        <div className="modal-body">
                            <div className="form-group"><label className="form-label">Leave Type</label><select className="form-select"><option>Sick Leave</option><option>Personal Leave</option><option>Academic</option><option>Emergency</option></select></div>
                            <div className="form-row"><div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" /></div><div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" /></div></div>
                            <div className="form-group"><label className="form-label">Reason</label><textarea className="form-textarea" placeholder="Enter reason for leave..."></textarea></div>
                        </div>
                        <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn-submit">Submit Request</button></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeaveRequests
