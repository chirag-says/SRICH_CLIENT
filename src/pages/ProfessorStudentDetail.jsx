import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
    HiChevronLeft, HiUser, HiMail, HiPhone, HiCalendar,
    HiDocumentText, HiCheckCircle, HiClock, HiXCircle,
    HiAcademicCap, HiChartBar, HiClipboardCheck
} from 'react-icons/hi'

const ProfessorStudentDetail = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [studentData, setStudentData] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        fetchStudentDetails()
    }, [id])

    const fetchStudentDetails = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/professor/students/${id}`)
            setStudentData(response.data.data)
        } catch (error) {
            toast.error('Failed to load student details')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleReviewCase = async (caseId, status) => {
        try {
            await api.put(`/professor/cases/${caseId}/review`, {
                status,
                remarks: ''
            })
            toast.success(`Case ${status.toLowerCase()} successfully`)
            fetchStudentDetails()
        } catch (error) {
            toast.error('Failed to review case')
            console.error(error)
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <style>{`
          .loading-container {
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

    if (!studentData) {
        return (
            <div className="error-container">
                <style>{`
          .error-container {
            min-height: calc(100vh - 70px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%);
            color: #7aa3c0;
          }
        `}</style>
                <p>Student not found</p>
                <Link to="/professor/students" style={{ color: '#4da8da', marginTop: 16 }}>
                    ← Back to Students
                </Link>
            </div>
        )
    }

    const { student, clinicalCases, attendance, leaveRequests, testDistribution } = studentData
    const progress = student.totalAllottedHours > 0
        ? Math.round((student.completedHours / student.totalAllottedHours) * 100)
        : 0

    return (
        <div className="student-detail">
            <style>{`
        .student-detail {
          padding: 24px;
          background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%);
          min-height: calc(100vh - 70px);
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 28px;
        }

        .back-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(77,168,218,0.15);
          border: none;
          color: #4da8da;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          flex-shrink: 0;
        }

        .back-btn:hover {
          background: #4da8da;
          color: #0a1628;
        }

        .profile-section {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .profile-avatar-lg {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.2rem;
          font-weight: 700;
          color: #0a1628;
          flex-shrink: 0;
          border: 4px solid rgba(77,168,218,0.3);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .profile-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #7aa3c0;
        }

        .meta-item svg {
          color: #4da8da;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-box {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
        }

        .stat-value-lg {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        .stat-value-lg.blue { color: #4da8da; }
        .stat-value-lg.green { color: #4ade80; }
        .stat-value-lg.yellow { color: #fbbf24; }
        .stat-value-lg.red { color: #ef4444; }

        .stat-label-lg {
          font-size: 0.8rem;
          color: #7aa3c0;
          margin-top: 6px;
        }

        .progress-card {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .progress-title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .progress-percent {
          font-size: 1.5rem;
          font-weight: 700;
          color: #4da8da;
        }

        .progress-bar-lg {
          height: 12px;
          background: rgba(77,168,218,0.2);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill-lg {
          height: 100%;
          background: linear-gradient(90deg, #4da8da, #00d4ff);
          border-radius: 6px;
        }

        .progress-details {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #7aa3c0;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 12px 24px;
          background: rgba(77,168,218,0.1);
          border: 1px solid rgba(77,168,218,0.2);
          border-radius: 10px;
          color: #7aa3c0;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab:hover {
          background: rgba(77,168,218,0.2);
          color: #fff;
        }

        .tab.active {
          background: #4da8da;
          color: #0a1628;
          border-color: #4da8da;
        }

        .content-grid {
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
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .card-body {
          padding: 20px;
        }

        .case-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .case-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(13,31,53,0.6);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .case-item:hover {
          background: rgba(77,168,218,0.1);
        }

        .case-info {
          flex: 1;
        }

        .case-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .case-meta {
          font-size: 0.8rem;
          color: #7aa3c0;
        }

        .case-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-approved {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
        }

        .badge-pending {
          background: rgba(251,191,36,0.15);
          color: #fbbf24;
        }

        .badge-rejected {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .case-actions {
          display: flex;
          gap: 8px;
          margin-left: 12px;
        }

        .action-btn-sm {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn-sm.approve {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
        }

        .action-btn-sm.approve:hover {
          background: #4ade80;
          color: #0a1628;
        }

        .action-btn-sm.reject {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .action-btn-sm.reject:hover {
          background: #ef4444;
          color: #fff;
        }

        .test-chart {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .test-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .test-name {
          font-size: 0.85rem;
          color: #fff;
          min-width: 100px;
          flex-shrink: 0;
        }

        .test-bar-bg {
          flex: 1;
          height: 10px;
          background: rgba(77,168,218,0.2);
          border-radius: 5px;
          overflow: hidden;
        }

        .test-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4da8da, #00d4ff);
          border-radius: 5px;
        }

        .test-count {
          font-size: 0.85rem;
          color: #4da8da;
          font-weight: 600;
          min-width: 30px;
          text-align: right;
        }

        .attendance-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          margin-bottom: 16px;
        }

        .attendance-day {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .attendance-day.present {
          background: rgba(74,222,128,0.2);
          color: #4ade80;
        }

        .attendance-day.absent {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .attendance-day.empty {
          background: rgba(77,168,218,0.05);
          color: #7aa3c0;
        }

        .attendance-summary {
          display: flex;
          gap: 20px;
          padding-top: 12px;
          border-top: 1px solid rgba(77,168,218,0.1);
        }

        .attendance-stat {
          text-align: center;
        }

        .attend-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #4da8da;
          line-height: 1.2;
        }

        .attend-label {
          font-size: 0.75rem;
          color: #7aa3c0;
          margin-top: 4px;
        }

        .empty-state-sm {
          text-align: center;
          padding: 30px;
          color: #7aa3c0;
        }

        @media (max-width: 1024px) {
          .stats-row { grid-template-columns: repeat(3, 1fr); }
          .content-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .detail-header { flex-direction: column; align-items: stretch; }
          .profile-section { flex-direction: column; text-align: center; }
          .profile-meta { justify-content: center; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

            {/* Header */}
            <div className="detail-header">
                <Link to="/professor/students" className="back-btn">
                    <HiChevronLeft size={24} />
                </Link>

                <div className="profile-section">
                    <div className="profile-avatar-lg">
                        {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{student.name}</h1>
                        <div className="profile-meta">
                            <span className="meta-item">
                                <HiMail size={16} />
                                {student.email}
                            </span>
                            {student.phone && (
                                <span className="meta-item">
                                    <HiPhone size={16} />
                                    {student.phone}
                                </span>
                            )}
                            <span className="meta-item">
                                <HiAcademicCap size={16} />
                                {student.batch} • Semester {student.semester}
                            </span>
                            {student.registrationNumber && (
                                <span className="meta-item">
                                    <HiUser size={16} />
                                    {student.registrationNumber}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-box">
                    <div className="stat-value-lg blue">{clinicalCases.stats?.total || 0}</div>
                    <div className="stat-label-lg">Total Cases</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value-lg green">{clinicalCases.stats?.approved || 0}</div>
                    <div className="stat-label-lg">Approved</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value-lg yellow">{clinicalCases.stats?.pending || 0}</div>
                    <div className="stat-label-lg">Pending</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value-lg red">{clinicalCases.stats?.rejected || 0}</div>
                    <div className="stat-label-lg">Rejected</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value-lg">{leaveRequests.stats?.total || 0}</div>
                    <div className="stat-label-lg">Leave Requests</div>
                </div>
            </div>

            {/* Progress Card */}
            <div className="progress-card">
                <div className="progress-top">
                    <span className="progress-title">Internship Hours Progress</span>
                    <span className="progress-percent">{progress}%</span>
                </div>
                <div className="progress-bar-lg">
                    <div className="progress-fill-lg" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-details">
                    <span>{student.completedHours} hours completed</span>
                    <span>{student.totalAllottedHours - student.completedHours} hours remaining</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${activeTab === 'cases' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cases')}
                >
                    Clinical Cases
                </button>
                <button
                    className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('attendance')}
                >
                    Attendance
                </button>
                <button
                    className={`tab ${activeTab === 'leaves' ? 'active' : ''}`}
                    onClick={() => setActiveTab('leaves')}
                >
                    Leave Requests
                </button>
            </div>

            {/* Content */}
            <div className="content-grid">
                {/* Left Column */}
                <div>
                    {activeTab === 'overview' && (
                        <div className="card">
                            <div className="card-header">
                                <HiClipboardCheck size={18} />
                                RECENT CLINICAL CASES
                            </div>
                            <div className="card-body">
                                {clinicalCases.recent?.length > 0 ? (
                                    <div className="case-list">
                                        {clinicalCases.recent.slice(0, 5).map(caseItem => (
                                            <div key={caseItem._id} className="case-item">
                                                <div className="case-info">
                                                    <div className="case-title">
                                                        Patient: {caseItem.patientInfo?.initials || 'N/A'} • {caseItem.patientInfo?.ageGroup}
                                                    </div>
                                                    <div className="case-meta">
                                                        {caseItem.testsPerformed?.length || 0} tests •
                                                        {new Date(caseItem.sessionDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <span className={`case-badge badge-${caseItem.supervisorApproval?.status?.toLowerCase()}`}>
                                                    {caseItem.supervisorApproval?.status || 'Pending'}
                                                </span>
                                                {caseItem.supervisorApproval?.status === 'Pending' && (
                                                    <div className="case-actions">
                                                        <button
                                                            className="action-btn-sm approve"
                                                            onClick={() => handleReviewCase(caseItem._id, 'Approved')}
                                                        >
                                                            <HiCheckCircle size={14} />
                                                        </button>
                                                        <button
                                                            className="action-btn-sm reject"
                                                            onClick={() => handleReviewCase(caseItem._id, 'Rejected')}
                                                        >
                                                            <HiXCircle size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state-sm">No clinical cases found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'cases' && (
                        <div className="card">
                            <div className="card-header">
                                <HiDocumentText size={18} />
                                ALL CLINICAL CASES
                            </div>
                            <div className="card-body">
                                {clinicalCases.recent?.length > 0 ? (
                                    <div className="case-list">
                                        {clinicalCases.recent.map(caseItem => (
                                            <div key={caseItem._id} className="case-item">
                                                <div className="case-info">
                                                    <div className="case-title">
                                                        Patient: {caseItem.patientInfo?.initials || 'N/A'} • {caseItem.patientInfo?.ageGroup}
                                                    </div>
                                                    <div className="case-meta">
                                                        {caseItem.testsPerformed?.map(t => t.testType).join(', ')} •
                                                        {new Date(caseItem.sessionDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <span className={`case-badge badge-${caseItem.supervisorApproval?.status?.toLowerCase()}`}>
                                                    {caseItem.supervisorApproval?.status || 'Pending'}
                                                </span>
                                                {caseItem.supervisorApproval?.status === 'Pending' && (
                                                    <div className="case-actions">
                                                        <button
                                                            className="action-btn-sm approve"
                                                            onClick={() => handleReviewCase(caseItem._id, 'Approved')}
                                                        >
                                                            <HiCheckCircle size={14} />
                                                        </button>
                                                        <button
                                                            className="action-btn-sm reject"
                                                            onClick={() => handleReviewCase(caseItem._id, 'Rejected')}
                                                        >
                                                            <HiXCircle size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state-sm">No clinical cases found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div className="card">
                            <div className="card-header">
                                <HiCalendar size={18} />
                                ATTENDANCE RECORDS
                            </div>
                            <div className="card-body">
                                {attendance.recent?.length > 0 ? (
                                    <div className="case-list">
                                        {attendance.recent.map((record, idx) => (
                                            <div key={idx} className="case-item">
                                                <div className="case-info">
                                                    <div className="case-title">
                                                        {new Date(record.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="case-meta">
                                                        Check-in: {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : 'N/A'} •
                                                        Check-out: {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : 'N/A'} •
                                                        {record.totalHours ? `${record.totalHours.toFixed(1)} hours` : 'In progress'}
                                                    </div>
                                                </div>
                                                <span className={`case-badge ${record.checkOut ? 'badge-approved' : 'badge-pending'}`}>
                                                    {record.checkOut ? 'Complete' : 'Active'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state-sm">No attendance records found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'leaves' && (
                        <div className="card">
                            <div className="card-header">
                                <HiClock size={18} />
                                LEAVE REQUESTS
                            </div>
                            <div className="card-body">
                                {leaveRequests.recent?.length > 0 ? (
                                    <div className="case-list">
                                        {leaveRequests.recent.map(leave => (
                                            <div key={leave._id} className="case-item">
                                                <div className="case-info">
                                                    <div className="case-title">
                                                        {leave.leaveType} Leave
                                                    </div>
                                                    <div className="case-meta">
                                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} •
                                                        {leave.reason}
                                                    </div>
                                                </div>
                                                <span className={`case-badge badge-${leave.status?.toLowerCase()}`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state-sm">No leave requests found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div>
                    {/* Test Distribution */}
                    <div className="card" style={{ marginBottom: 20 }}>
                        <div className="card-header">
                            <HiChartBar size={18} />
                            TEST DISTRIBUTION
                        </div>
                        <div className="card-body">
                            {testDistribution?.length > 0 ? (
                                <div className="test-chart">
                                    {testDistribution.slice(0, 6).map((test, idx) => {
                                        const maxCount = Math.max(...testDistribution.map(t => t.count))
                                        const percentage = maxCount > 0 ? (test.count / maxCount) * 100 : 0
                                        return (
                                            <div key={idx} className="test-item">
                                                <span className="test-name">{test._id || 'Unknown'}</span>
                                                <div className="test-bar-bg">
                                                    <div className="test-bar-fill" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                                <span className="test-count">{test.count}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="empty-state-sm">No test data available</div>
                            )}
                        </div>
                    </div>

                    {/* Monthly Attendance Summary */}
                    <div className="card">
                        <div className="card-header">
                            <HiCalendar size={18} />
                            THIS MONTH
                        </div>
                        <div className="card-body">
                            <div className="attendance-summary">
                                <div className="attendance-stat">
                                    <div className="attend-value">{attendance.summary?.totalDays || 0}</div>
                                    <div className="attend-label">Days Attended</div>
                                </div>
                                <div className="attendance-stat">
                                    <div className="attend-value">{Math.round(attendance.summary?.totalHours || 0)}</div>
                                    <div className="attend-label">Total Hours</div>
                                </div>
                                <div className="attendance-stat">
                                    <div className="attend-value">
                                        {attendance.summary?.totalDays > 0
                                            ? (attendance.summary.totalHours / attendance.summary.totalDays).toFixed(1)
                                            : 0}
                                    </div>
                                    <div className="attend-label">Avg Hours/Day</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfessorStudentDetail
