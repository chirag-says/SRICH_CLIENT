import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
    HiUsers, HiSearch, HiFilter, HiEye, HiMail,
    HiPhone, HiAcademicCap, HiChevronLeft, HiChevronRight,
    HiDocumentText, HiCheckCircle, HiClock, HiSortAscending
} from 'react-icons/hi'

const ProfessorStudents = () => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        batch: '',
        semester: '',
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
    })
    const [filterOptions, setFilterOptions] = useState({ batches: [], semesters: [] })
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    })
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchFilterOptions()
    }, [])

    useEffect(() => {
        fetchStudents()
    }, [pagination.page, filters])

    const fetchFilterOptions = async () => {
        try {
            const response = await api.get('/professor/filters')
            setFilterOptions(response.data.data)
        } catch (error) {
            console.error('Failed to fetch filter options', error)
        }
    }

    const fetchStudents = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            })

            // Remove empty params
            Object.keys(filters).forEach(key => {
                if (!filters[key]) params.delete(key)
            })

            const response = await api.get(`/professor/students?${params}`)
            setStudents(response.data.data)
            setPagination(prev => ({
                ...prev,
                total: response.data.total,
                pages: response.data.pages
            }))
        } catch (error) {
            toast.error('Failed to load students')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPagination(prev => ({ ...prev, page: 1 }))
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        fetchStudents()
    }

    const getProgressColor = (percentage) => {
        if (percentage >= 75) return '#4ade80'
        if (percentage >= 50) return '#4da8da'
        if (percentage >= 25) return '#fbbf24'
        return '#ef4444'
    }

    return (
        <div className="prof-students">
            <style>{`
        .prof-students {
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

        .page-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
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

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: rgba(13,31,53,0.8);
          border: 1px solid rgba(77,168,218,0.2);
          border-radius: 10px;
          padding: 0 14px;
          width: 280px;
        }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          padding: 12px 10px;
          font-size: 0.9rem;
          outline: none;
        }

        .search-box input::placeholder {
          color: #7aa3c0;
        }

        .search-box svg {
          color: #7aa3c0;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          background: rgba(77,168,218,0.15);
          border: 1px solid rgba(77,168,218,0.3);
          border-radius: 10px;
          color: #4da8da;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover, .filter-btn.active {
          background: #4da8da;
          color: #0a1628;
        }

        .filters-panel {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-label {
          font-size: 0.8rem;
          color: #7aa3c0;
          font-weight: 500;
        }

        .filter-select {
          padding: 10px 14px;
          background: rgba(13,31,53,0.8);
          border: 1px solid rgba(77,168,218,0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }

        .filter-select:focus {
          border-color: #4da8da;
        }

        .filter-select option {
          background: #132238;
          color: #fff;
        }

        .students-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .student-card {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
        }

        .student-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(77, 168, 218, 0.15);
          border-color: rgba(77,168,218,0.3);
        }

        .student-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .student-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
          color: #0a1628;
          flex-shrink: 0;
          border: 3px solid rgba(77,168,218,0.3);
        }

        .student-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .student-batch {
          font-size: 0.85rem;
          color: #7aa3c0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .view-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
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

        .view-btn:hover {
          background: #4da8da;
          color: #0a1628;
        }

        .student-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(77,168,218,0.1);
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: #7aa3c0;
        }

        .meta-row svg {
          color: #4da8da;
          flex-shrink: 0;
        }

        .student-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-mini {
          text-align: center;
          padding: 10px;
          background: rgba(13,31,53,0.6);
          border-radius: 10px;
        }

        .stat-mini-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }

        .stat-mini-label {
          font-size: 0.7rem;
          color: #7aa3c0;
          margin-top: 4px;
        }

        .stat-mini-value.blue { color: #4da8da; }
        .stat-mini-value.green { color: #4ade80; }
        .stat-mini-value.yellow { color: #fbbf24; }

        .progress-section {
          padding-top: 8px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-label {
          font-size: 0.8rem;
          color: #7aa3c0;
        }

        .progress-value {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .progress-bar {
          height: 8px;
          background: rgba(77,168,218,0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 20px 0;
        }

        .page-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(77,168,218,0.15);
          border: none;
          color: #7aa3c0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .page-btn:hover:not(:disabled) {
          background: rgba(77,168,218,0.3);
          color: #fff;
        }

        .page-btn.active {
          background: #4da8da;
          color: #0a1628;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-size: 0.9rem;
          color: #7aa3c0;
          padding: 0 16px;
        }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }

        .skeleton-card {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 16px;
          padding: 24px;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .skeleton-line {
          height: 16px;
          background: rgba(77,168,218,0.1);
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .skeleton-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(77,168,218,0.1);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #7aa3c0;
          grid-column: 1 / -1;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(77,168,218,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #4da8da;
        }

        .empty-state h3 {
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 8px;
        }

        @media (max-width: 768px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .header-actions { flex-wrap: wrap; width: 100%; }
          .search-box { width: 100%; }
          .students-grid { grid-template-columns: 1fr; }
        }
      `}</style>

            {/* Header */}
            <div className="page-header">
                <div className="page-title">
                    <Link to="/professor/dashboard" className="back-btn">
                        <HiChevronLeft size={22} />
                    </Link>
                    <div>
                        <h1>All Students</h1>
                        <p>{pagination.total} students registered</p>
                    </div>
                </div>

                <div className="header-actions">
                    <form onSubmit={handleSearchSubmit} className="search-box">
                        <HiSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </form>
                    <button
                        className={`filter-btn ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <HiFilter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="filters-panel">
                    <div className="filter-group">
                        <label className="filter-label">Batch</label>
                        <select
                            className="filter-select"
                            value={filters.batch}
                            onChange={(e) => handleFilterChange('batch', e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {filterOptions.batches.map((batch, i) => (
                                <option key={i} value={batch}>{batch}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Semester</label>
                        <select
                            className="filter-select"
                            value={filters.semester}
                            onChange={(e) => handleFilterChange('semester', e.target.value)}
                        >
                            <option value="">All Semesters</option>
                            {filterOptions.semesters.map((sem, i) => (
                                <option key={i} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Sort By</label>
                        <select
                            className="filter-select"
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="completedHours">Hours Completed</option>
                            <option value="createdAt">Join Date</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Order</label>
                        <select
                            className="filter-select"
                            value={filters.sortOrder}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Students Grid */}
            {loading ? (
                <div className="loading-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton-card">
                            <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                                <div className="skeleton-circle"></div>
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton-line" style={{ width: '60%' }}></div>
                                    <div className="skeleton-line" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line" style={{ width: '80%' }}></div>
                        </div>
                    ))}
                </div>
            ) : students.length > 0 ? (
                <div className="students-grid">
                    {students.map(student => {
                        const progress = student.totalAllottedHours > 0
                            ? Math.round((student.completedHours / student.totalAllottedHours) * 100)
                            : 0
                        const cases = student.clinicalCases || {}

                        return (
                            <div key={student._id} className="student-card">
                                <div className="student-header">
                                    <div className="student-info">
                                        <div className="student-avatar">
                                            {student.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="student-name">{student.name}</div>
                                            <div className="student-batch">
                                                <HiAcademicCap size={14} />
                                                {student.batch} • Semester {student.semester}
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={`/professor/students/${student._id}`} className="view-btn">
                                        <HiEye size={18} />
                                    </Link>
                                </div>

                                <div className="student-meta">
                                    <div className="meta-row">
                                        <HiMail size={16} />
                                        {student.email}
                                    </div>
                                    {student.phone && (
                                        <div className="meta-row">
                                            <HiPhone size={16} />
                                            {student.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="student-stats">
                                    <div className="stat-mini">
                                        <div className="stat-mini-value blue">{cases.totalCases || 0}</div>
                                        <div className="stat-mini-label">Total Cases</div>
                                    </div>
                                    <div className="stat-mini">
                                        <div className="stat-mini-value green">{cases.approvedCases || 0}</div>
                                        <div className="stat-mini-label">Approved</div>
                                    </div>
                                    <div className="stat-mini">
                                        <div className="stat-mini-value yellow">{cases.pendingCases || 0}</div>
                                        <div className="stat-mini-label">Pending</div>
                                    </div>
                                </div>

                                <div className="progress-section">
                                    <div className="progress-header">
                                        <span className="progress-label">Hours Progress</span>
                                        <span className="progress-value" style={{ color: getProgressColor(progress) }}>
                                            {student.completedHours}/{student.totalAllottedHours}h ({progress}%)
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${progress}%`,
                                                background: `linear-gradient(90deg, ${getProgressColor(progress)}, ${getProgressColor(progress)}dd)`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="students-grid">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <HiUsers size={36} />
                        </div>
                        <h3>No Students Found</h3>
                        <p>Try adjusting your filters or search term</p>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                        <HiChevronLeft size={18} />
                    </button>

                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                        let pageNum
                        if (pagination.pages <= 5) {
                            pageNum = i + 1
                        } else if (pagination.page <= 3) {
                            pageNum = i + 1
                        } else if (pagination.page >= pagination.pages - 2) {
                            pageNum = pagination.pages - 4 + i
                        } else {
                            pageNum = pagination.page - 2 + i
                        }

                        return (
                            <button
                                key={i}
                                className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            >
                                {pageNum}
                            </button>
                        )
                    })}

                    <span className="page-info">
                        Page {pagination.page} of {pagination.pages}
                    </span>

                    <button
                        className="page-btn"
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                        <HiChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfessorStudents
