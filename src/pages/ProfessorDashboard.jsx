import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
    HiUsers, HiDocumentText, HiClipboardCheck, HiClock,
    HiCheckCircle, HiXCircle, HiChartBar, HiEye,
    HiCalendar, HiAcademicCap, HiTrendingUp, HiArrowRight
} from 'react-icons/hi'

const ProfessorDashboard = () => {
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response = await api.get('/professor/dashboard')
            setDashboardData(response.data.data)
        } catch (error) {
            toast.error('Failed to load dashboard data')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="prof-loading">
                <style>{`
          .prof-loading {
            min-height: calc(100vh - 70px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%);
          }
          .spinner-large {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(77,168,218,0.2);
            border-top-color: #4da8da;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
                <div className="spinner-large"></div>
            </div>
        )
    }

    const stats = dashboardData?.clinicalCases || {}
    const students = dashboardData?.students || {}
    const leaves = dashboardData?.leaveRequests || {}
    const progress = dashboardData?.averageProgress || {}

    return (
        <div className="prof-dash">
            <style>{`
        .prof-dash {
          padding: 24px;
          min-height: calc(100vh - 70px);
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .dash-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dash-title-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 8px 24px rgba(77, 168, 218, 0.3);
        }

        .dash-welcome {
          color: #7aa3c0;
          font-size: 0.95rem;
          margin-top: 4px;
        }

        .dash-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(77, 168, 218, 0.15);
          border-color: rgba(77,168,218,0.3);
        }

        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue { background: rgba(77,168,218,0.15); color: #4da8da; }
        .stat-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .stat-icon.yellow { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .stat-icon.red { background: rgba(239,68,68,0.15); color: #ef4444; }
        .stat-icon.purple { background: rgba(168,85,247,0.15); color: #a855f7; }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #7aa3c0;
          margin-top: 8px;
        }

        .stat-change {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 20px;
          font-weight: 600;
        }

        .stat-change.up {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .card {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 16px;
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(90deg, #1e5a7e 0%, #2d7aa8 100%);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
        }

        .card-action {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
        }

        .card-action:hover {
          color: #fff;
        }

        .card-body {
          padding: 20px;
        }

        .pending-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pending-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(13,31,53,0.6);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .pending-item:hover {
          background: rgba(77,168,218,0.1);
        }

        .pending-info {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }

        .pending-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #0a1628;
          flex-shrink: 0;
        }

        .pending-details {
          flex: 1;
        }

        .pending-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }

        .pending-meta {
          font-size: 0.8rem;
          color: #7aa3c0;
        }

        .pending-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(251,191,36,0.15);
          color: #fbbf24;
        }

        .pending-actions {
          display: flex;
          gap: 8px;
          margin-left: 12px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.approve {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
        }

        .action-btn.approve:hover {
          background: #4ade80;
          color: #0a1628;
        }

        .action-btn.reject {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .action-btn.reject:hover {
          background: #ef4444;
          color: #fff;
        }

        .action-btn.view {
          background: rgba(77,168,218,0.15);
          color: #4da8da;
          text-decoration: none;
        }

        .action-btn.view:hover {
          background: #4da8da;
          color: #0a1628;
        }

        .top-students {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .student-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: rgba(13,31,53,0.6);
          border-radius: 12px;
          transition: all 0.2s;
          text-decoration: none;
        }

        .student-row:hover {
          background: rgba(77,168,218,0.1);
        }

        .student-rank {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a1628;
          flex-shrink: 0;
        }

        .student-rank.gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
        .student-rank.silver { background: linear-gradient(135deg, #94a3b8, #64748b); }
        .student-rank.bronze { background: linear-gradient(135deg, #d97706, #b45309); }

        .student-info {
          flex: 1;
        }

        .student-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }

        .student-batch {
          font-size: 0.75rem;
          color: #7aa3c0;
        }

        .student-progress {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .progress-bar-mini {
          width: 60px;
          height: 6px;
          background: rgba(77,168,218,0.2);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill-mini {
          height: 100%;
          background: linear-gradient(90deg, #4da8da, #00d4ff);
          border-radius: 3px;
        }

        .progress-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4da8da;
          min-width: 40px;
          text-align: right;
        }

        .batch-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .batch-card {
          padding: 16px;
          background: rgba(13,31,53,0.6);
          border-radius: 12px;
          text-align: center;
          transition: all 0.2s;
        }

        .batch-card:hover {
          background: rgba(77,168,218,0.1);
        }

        .batch-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4da8da;
          margin-bottom: 4px;
        }

        .batch-label {
          font-size: 0.75rem;
          color: #7aa3c0;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #7aa3c0;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(77,168,218,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #4da8da;
        }

        .nav-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .nav-link-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(77, 168, 218, 0.4);
        }

        @media (max-width: 1200px) {
          .dash-grid { grid-template-columns: repeat(2, 1fr); }
          .main-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .dash-grid { grid-template-columns: 1fr; }
          .dash-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

            {/* Header */}
            <div className="dash-header">
                <div>
                    <h1 className="dash-title">
                        <div className="dash-title-icon">
                            <HiAcademicCap size={24} />
                        </div>
                        Professor Panel
                    </h1>
                    <p className="dash-welcome">Welcome back, {user?.name}! Here's your overview.</p>
                </div>
                <Link to="/professor/students" className="nav-link-btn">
                    View All Students <HiArrowRight size={18} />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="dash-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon blue">
                            <HiUsers size={22} />
                        </div>
                        <span className="stat-change up">Active</span>
                    </div>
                    <div className="stat-value">{students.total || 0}</div>
                    <div className="stat-label">Total Students</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon green">
                            <HiDocumentText size={22} />
                        </div>
                        <span className="stat-change up">+{stats.today || 0} today</span>
                    </div>
                    <div className="stat-value">{stats.total || 0}</div>
                    <div className="stat-label">Clinical Cases</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon yellow">
                            <HiClock size={22} />
                        </div>
                    </div>
                    <div className="stat-value">{stats.pending || 0}</div>
                    <div className="stat-label">Pending Reviews</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon purple">
                            <HiTrendingUp size={22} />
                        </div>
                    </div>
                    <div className="stat-value">{progress.percentage || 0}%</div>
                    <div className="stat-label">Avg. Progress</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-grid">
                {/* Pending Cases */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">
                            <HiClipboardCheck size={18} />
                            PENDING CLINICAL CASES
                        </span>
                        <Link to="/professor/pending" className="card-action">
                            View All <HiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="card-body">
                        {dashboardData?.recentPendingCases?.length > 0 ? (
                            <div className="pending-list">
                                {dashboardData.recentPendingCases.map((caseItem, index) => (
                                    <div key={caseItem._id || index} className="pending-item">
                                        <div className="pending-info">
                                            <div className="pending-avatar">
                                                {caseItem.student?.name?.charAt(0) || 'S'}
                                            </div>
                                            <div className="pending-details">
                                                <div className="pending-name">{caseItem.student?.name || 'Unknown'}</div>
                                                <div className="pending-meta">
                                                    Patient: {caseItem.patientInfo?.initials || 'N/A'} •
                                                    {caseItem.patientInfo?.ageGroup || 'N/A'} •
                                                    {caseItem.testsPerformed?.length || 0} tests
                                                </div>
                                            </div>
                                        </div>
                                        <span className="pending-badge">Pending</span>
                                        <div className="pending-actions">
                                            <Link to={`/professor/case/${caseItem._id}`} className="action-btn view">
                                                <HiEye size={16} />
                                            </Link>
                                            <button className="action-btn approve" title="Approve">
                                                <HiCheckCircle size={16} />
                                            </button>
                                            <button className="action-btn reject" title="Reject">
                                                <HiXCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <HiCheckCircle size={28} />
                                </div>
                                <p>No pending cases to review</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Top Students */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">
                                <HiChartBar size={18} />
                                TOP PERFORMERS
                            </span>
                        </div>
                        <div className="card-body">
                            {dashboardData?.topStudents?.length > 0 ? (
                                <div className="top-students">
                                    {dashboardData.topStudents.map((student, index) => {
                                        const percentage = student.totalAllottedHours > 0
                                            ? Math.round((student.completedHours / student.totalAllottedHours) * 100)
                                            : 0
                                        return (
                                            <Link
                                                to={`/professor/students/${student._id}`}
                                                key={student._id}
                                                className="student-row"
                                            >
                                                <div className={`student-rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                                                    {index + 1}
                                                </div>
                                                <div className="student-info">
                                                    <div className="student-name">{student.name}</div>
                                                    <div className="student-batch">{student.batch} • Sem {student.semester}</div>
                                                </div>
                                                <div className="student-progress">
                                                    <div className="progress-bar-mini">
                                                        <div className="progress-fill-mini" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                    <span className="progress-text">{percentage}%</span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>No students found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Students by Batch */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">
                                <HiCalendar size={18} />
                                STUDENTS BY BATCH
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="batch-grid">
                                {students.byBatch?.slice(0, 4).map((batch, index) => (
                                    <div key={index} className="batch-card">
                                        <div className="batch-value">{batch.count}</div>
                                        <div className="batch-label">{batch._id || 'Unknown'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Leave Requests Summary */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">
                                <HiClock size={18} />
                                LEAVE REQUESTS
                            </span>
                            <Link to="/professor/pending?type=leaves" className="card-action">
                                View All <HiArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="batch-grid">
                                <div className="batch-card">
                                    <div className="batch-value" style={{ color: '#fbbf24' }}>{leaves.pending || 0}</div>
                                    <div className="batch-label">Pending</div>
                                </div>
                                <div className="batch-card">
                                    <div className="batch-value" style={{ color: '#4ade80' }}>{leaves.approved || 0}</div>
                                    <div className="batch-label">Approved</div>
                                </div>
                                <div className="batch-card">
                                    <div className="batch-value" style={{ color: '#ef4444' }}>{leaves.rejected || 0}</div>
                                    <div className="batch-label">Rejected</div>
                                </div>
                                <div className="batch-card">
                                    <div className="batch-value">{leaves.total || 0}</div>
                                    <div className="batch-label">Total</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfessorDashboard
