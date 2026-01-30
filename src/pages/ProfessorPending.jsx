import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
    HiChevronLeft, HiDocumentText, HiClock, HiCheckCircle,
    HiXCircle, HiEye, HiClipboardCheck, HiCalendar
} from 'react-icons/hi'

const ProfessorPending = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'cases')
    const [loading, setLoading] = useState(true)
    const [pendingData, setPendingData] = useState({ cases: null, leaves: null })
    const [selectedItems, setSelectedItems] = useState([])

    useEffect(() => {
        fetchPendingItems()
    }, [activeTab])

    const fetchPendingItems = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/professor/pending?type=${activeTab}`)
            setPendingData(prev => ({
                ...prev,
                [activeTab]: response.data.data[activeTab]
            }))
        } catch (error) {
            toast.error('Failed to load pending items')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSearchParams({ type: tab })
        setSelectedItems([])
    }

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const handleSelectAll = () => {
        const items = activeTab === 'cases' ? pendingData.cases?.items : pendingData.leaves?.items
        if (selectedItems.length === items?.length) {
            setSelectedItems([])
        } else {
            setSelectedItems(items?.map(item => item._id) || [])
        }
    }

    const handleReviewCase = async (caseId, status) => {
        try {
            await api.put(`/professor/cases/${caseId}/review`, { status, remarks: '' })
            toast.success(`Case ${status.toLowerCase()} successfully`)
            fetchPendingItems()
        } catch (error) {
            toast.error('Failed to review case')
            console.error(error)
        }
    }

    const handleBulkReview = async (status) => {
        if (selectedItems.length === 0) {
            toast.error('Please select items to review')
            return
        }

        try {
            if (activeTab === 'cases') {
                await api.put('/professor/cases/bulk-review', {
                    caseIds: selectedItems,
                    status,
                    remarks: ''
                })
            }
            toast.success(`${selectedItems.length} items ${status.toLowerCase()} successfully`)
            setSelectedItems([])
            fetchPendingItems()
        } catch (error) {
            toast.error('Failed to process bulk review')
            console.error(error)
        }
    }

    const handleReviewLeave = async (leaveId, status) => {
        try {
            await api.put(`/leave-requests/${leaveId}/review`, { status, remarks: '' })
            toast.success(`Leave request ${status.toLowerCase()} successfully`)
            fetchPendingItems()
        } catch (error) {
            toast.error('Failed to review leave request')
            console.error(error)
        }
    }

    const currentData = activeTab === 'cases' ? pendingData.cases : pendingData.leaves

    return (
        <div className="pending-page">
            <style>{`
        .pending-page {
          padding: 24px;
          background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%);
          min-height: calc(100vh - 70px);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
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
        }

        .back-btn:hover {
          background: #4da8da;
          color: #0a1628;
        }

        .page-title h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #fff;
        }

        .page-title p {
          font-size: 0.9rem;
          color: #7aa3c0;
          margin-top: 4px;
        }

        .bulk-actions {
          display: flex;
          gap: 12px;
        }

        .bulk-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .bulk-btn.approve {
          background: rgba(74,222,128,0.15);
          color: #4ade80;
        }

        .bulk-btn.approve:hover {
          background: #4ade80;
          color: #0a1628;
        }

        .bulk-btn.reject {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .bulk-btn.reject:hover {
          background: #ef4444;
          color: #fff;
        }

        .bulk-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tabs-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(77,168,218,0.15);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: rgba(77,168,218,0.1);
          border: 1px solid rgba(77,168,218,0.2);
          border-radius: 12px;
          color: #7aa3c0;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab:hover {
          background: rgba(77,168,218,0.2);
          color: #fff;
        }

        .tab.active {
          background: linear-gradient(135deg, #4da8da, #2196F3);
          color: #0a1628;
          border-color: transparent;
        }

        .tab-badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .tab.active .tab-badge {
          background: rgba(10, 22, 40, 0.3);
          color: #fff;
        }

        .tab:not(.active) .tab-badge {
          background: rgba(251,191,36,0.15);
          color: #fbbf24;
        }

        .select-all {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .checkbox-custom {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 2px solid rgba(77,168,218,0.4);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkbox-custom.checked {
          background: #4da8da;
          border-color: #4da8da;
          color: #0a1628;
        }

        .select-label {
          font-size: 0.9rem;
          color: #7aa3c0;
        }

        .select-count {
          margin-left: auto;
          font-size: 0.85rem;
          color: #4da8da;
          font-weight: 600;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 14px;
          transition: all 0.2s;
        }

        .item-card:hover {
          border-color: rgba(77,168,218,0.3);
          transform: translateX(4px);
        }

        .item-card.selected {
          border-color: #4da8da;
          box-shadow: 0 0 20px rgba(77, 168, 218, 0.15);
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }

        .item-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #0a1628;
          flex-shrink: 0;
        }

        .item-details {
          flex: 1;
          min-width: 0;
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .item-meta {
          font-size: 0.85rem;
          color: #7aa3c0;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .meta-tag {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .meta-tag svg {
          color: #4da8da;
          flex-shrink: 0;
        }

        .item-type {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(251,191,36,0.15);
          color: #fbbf24;
          margin-right: 8px;
        }

        .item-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .action-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.view {
          background: rgba(77,168,218,0.15);
          color: #4da8da;
        }

        .action-btn.view:hover {
          background: #4da8da;
          color: #0a1628;
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

        .loading-state {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-item {
          height: 88px;
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 14px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #7aa3c0;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: rgba(74,222,128,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #4ade80;
        }

        .empty-state h3 {
          font-size: 1.4rem;
          color: #fff;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #4da8da;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #fff;
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .bulk-actions { width: 100%; }
          .bulk-btn { flex: 1; justify-content: center; }
          .item-card { flex-direction: column; align-items: stretch; }
          .item-actions { justify-content: flex-end; }
        }
      `}</style>

            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <Link to="/professor/dashboard" className="back-btn">
                        <HiChevronLeft size={24} />
                    </Link>
                    <div className="page-title">
                        <h1>Pending Reviews</h1>
                        <p>Review and approve clinical cases & leave requests</p>
                    </div>
                </div>

                <div className="bulk-actions">
                    <button
                        className="bulk-btn approve"
                        disabled={selectedItems.length === 0}
                        onClick={() => handleBulkReview('Approved')}
                    >
                        <HiCheckCircle size={18} />
                        Approve Selected ({selectedItems.length})
                    </button>
                    <button
                        className="bulk-btn reject"
                        disabled={selectedItems.length === 0}
                        onClick={() => handleBulkReview('Rejected')}
                    >
                        <HiXCircle size={18} />
                        Reject Selected
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab ${activeTab === 'cases' ? 'active' : ''}`}
                    onClick={() => handleTabChange('cases')}
                >
                    <HiClipboardCheck size={20} />
                    Clinical Cases
                    <span className="tab-badge">
                        {pendingData.cases?.total || 0}
                    </span>
                </button>
                <button
                    className={`tab ${activeTab === 'leaves' ? 'active' : ''}`}
                    onClick={() => handleTabChange('leaves')}
                >
                    <HiCalendar size={20} />
                    Leave Requests
                    <span className="tab-badge">
                        {pendingData.leaves?.total || 0}
                    </span>
                </button>
            </div>

            {/* Select All */}
            {currentData?.items?.length > 0 && (
                <div className="select-all">
                    <div
                        className={`checkbox-custom ${selectedItems.length === currentData.items.length ? 'checked' : ''}`}
                        onClick={handleSelectAll}
                    >
                        {selectedItems.length === currentData.items.length && <HiCheckCircle size={14} />}
                    </div>
                    <span className="select-label">Select All</span>
                    <span className="select-count">
                        {selectedItems.length} of {currentData.items.length} selected
                    </span>
                </div>
            )}

            {/* Items List */}
            {loading ? (
                <div className="loading-state">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton-item"></div>
                    ))}
                </div>
            ) : currentData?.items?.length > 0 ? (
                <div className="items-list">
                    {currentData.items.map(item => (
                        <div
                            key={item._id}
                            className={`item-card ${selectedItems.includes(item._id) ? 'selected' : ''}`}
                        >
                            <div
                                className={`checkbox-custom ${selectedItems.includes(item._id) ? 'checked' : ''}`}
                                onClick={() => handleSelectItem(item._id)}
                            >
                                {selectedItems.includes(item._id) && <HiCheckCircle size={14} />}
                            </div>

                            <div className="item-info">
                                <div className="item-avatar">
                                    {item.student?.name?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <div className="item-details">
                                    <div className="item-title">
                                        {item.student?.name || 'Unknown Student'}
                                    </div>
                                    <div className="item-meta">
                                        {activeTab === 'cases' ? (
                                            <>
                                                <span className="meta-tag">
                                                    <HiDocumentText size={14} />
                                                    Patient: {item.patientInfo?.initials} ({item.patientInfo?.ageGroup})
                                                </span>
                                                <span className="meta-tag">
                                                    <HiClipboardCheck size={14} />
                                                    {item.testsPerformed?.length || 0} tests
                                                </span>
                                                <span className="meta-tag">
                                                    <HiCalendar size={14} />
                                                    {new Date(item.sessionDate).toLocaleDateString()}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="meta-tag">
                                                    <HiCalendar size={14} />
                                                    {item.leaveType} Leave
                                                </span>
                                                <span className="meta-tag">
                                                    <HiClock size={14} />
                                                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                </span>
                                            </>
                                        )}
                                        <span className="meta-tag">
                                            {item.student?.batch} • Sem {item.student?.semester}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <span className="item-type">Pending</span>

                            <div className="item-actions">
                                <Link
                                    to={`/professor/students/${item.student?._id}`}
                                    className="action-btn view"
                                    title="View Student"
                                >
                                    <HiEye size={18} />
                                </Link>
                                <button
                                    className="action-btn approve"
                                    title="Approve"
                                    onClick={() => activeTab === 'cases'
                                        ? handleReviewCase(item._id, 'Approved')
                                        : handleReviewLeave(item._id, 'Approved')
                                    }
                                >
                                    <HiCheckCircle size={18} />
                                </button>
                                <button
                                    className="action-btn reject"
                                    title="Reject"
                                    onClick={() => activeTab === 'cases'
                                        ? handleReviewCase(item._id, 'Rejected')
                                        : handleReviewLeave(item._id, 'Rejected')
                                    }
                                >
                                    <HiXCircle size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <HiCheckCircle size={48} />
                    </div>
                    <h3>All Caught Up!</h3>
                    <p>No pending {activeTab === 'cases' ? 'clinical cases' : 'leave requests'} to review</p>
                    <Link to="/professor/dashboard" className="back-link">
                        <HiChevronLeft size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            )}
        </div>
    )
}

export default ProfessorPending
