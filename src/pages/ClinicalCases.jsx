import { useState } from 'react'
import { format } from 'date-fns'
import { HiPlus, HiSearch, HiEye, HiPencil, HiDocumentText, HiCheckCircle, HiClock, HiFilter } from 'react-icons/hi'

const ClinicalCases = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const stats = { total: 24, approved: 20, pending: 4, revision: 0 }
  const cases = [
    { _id: '1', caseNumber: 'SRISH-2601-0045', patient: 'JD', gender: 'Male', ageGroup: '16.1-40y', date: new Date().toISOString(), tests: ['PTA', 'OAE'], status: 'Approved' },
    { _id: '2', caseNumber: 'SRISH-2601-0044', patient: 'AB', gender: 'Female', ageGroup: '2.1-5y', date: new Date(Date.now() - 86400000).toISOString(), tests: ['ABR', 'BERA'], status: 'Pending' },
    { _id: '3', caseNumber: 'SRISH-2601-0043', patient: 'XY', gender: 'Male', ageGroup: '>60y', date: new Date(Date.now() - 172800000).toISOString(), tests: ['PTA', 'Immittance', 'Speech'], status: 'Revision Required' },
    { _id: '4', caseNumber: 'SRISH-2601-0042', patient: 'MK', gender: 'Female', ageGroup: '40.1-60y', date: new Date(Date.now() - 259200000).toISOString(), tests: ['OAE', 'ABR'], status: 'Approved' }
  ]

  return (
    <div className="page">
      <style>{`
        .page { padding: 24px; background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%); min-height: calc(100vh - 70px); }
        .page-container { max-width: 1400px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .page-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .page-subtitle { color: #7aa3c0; font-size: 0.95rem; }
        .btn-primary { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(90deg, #1e5a7e, #2d7aa8); color: #fff; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(77,168,218,0.3); }
        
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 14px; padding: 18px; display: flex; align-items: center; gap: 14px; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.blue { background: rgba(77,168,218,0.15); color: #4da8da; }
        .stat-icon.green { background: rgba(74,222,128,0.15); color: #4ade80; }
        .stat-icon.yellow { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .stat-icon.red { background: rgba(248,113,113,0.15); color: #f87171; }
        .stat-value { font-size: 1.6rem; font-weight: 700; color: #fff; }
        .stat-label { font-size: 0.8rem; color: #7aa3c0; }
        
        .filters { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .search-box { flex: 1; min-width: 280px; position: relative; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #7aa3c0; }
        .search-input { width: 100%; padding: 14px 16px 14px 48px; background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 12px; color: #fff; font-size: 0.95rem; }
        .search-input:focus { outline: none; border-color: #4da8da; }
        .search-input::placeholder { color: #7aa3c0; }
        .filter-select { padding: 14px 20px; background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 12px; color: #fff; font-size: 0.95rem; min-width: 160px; cursor: pointer; }
        .filter-select option { background: #132238; }
        
        .table-card { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.15); border-radius: 16px; overflow: hidden; }
        .table-header { background: linear-gradient(90deg, #1e5a7e, #2d7aa8); padding: 16px 24px; font-weight: 600; color: #fff; display: flex; align-items: center; gap: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 14px 20px; font-size: 0.8rem; font-weight: 600; color: #7aa3c0; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(13,31,53,0.5); border-bottom: 1px solid rgba(77,168,218,0.1); }
        td { padding: 16px 20px; font-size: 0.9rem; color: #fff; border-bottom: 1px solid rgba(77,168,218,0.1); }
        tr:hover td { background: rgba(77,168,218,0.05); }
        tr:last-child td { border-bottom: none; }
        .case-num { color: #4da8da; font-weight: 600; }
        .patient-name { font-weight: 500; }
        .patient-gender { font-size: 0.8rem; color: #7aa3c0; }
        .test-badge { display: inline-block; padding: 4px 10px; background: rgba(77,168,218,0.15); color: #4da8da; border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-right: 6px; margin-bottom: 4px; }
        .status-badge { padding: 5px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
        .status-approved { background: rgba(74,222,128,0.15); color: #4ade80; }
        .status-pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .status-revision { background: rgba(248,113,113,0.15); color: #f87171; }
        .action-btns { display: flex; gap: 8px; }
        .action-btn { padding: 8px; background: rgba(77,168,218,0.1); border: 1px solid rgba(77,168,218,0.2); border-radius: 8px; color: #7aa3c0; cursor: pointer; transition: all 0.2s; }
        .action-btn:hover { background: rgba(77,168,218,0.2); color: #4da8da; }
        
        @media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stats-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <div><h1 className="page-title">Clinical Cases</h1><p className="page-subtitle">Manage and review patient cases</p></div>
          <button className="btn-primary"><HiPlus size={20} /> New Case</button>
        </div>

        <div className="stats-row">
          <div className="stat-card"><div className="stat-icon blue"><HiDocumentText size={22} /></div><div><div className="stat-value">{stats.total}</div><div className="stat-label">Total Cases</div></div></div>
          <div className="stat-card"><div className="stat-icon green"><HiCheckCircle size={22} /></div><div><div className="stat-value">{stats.approved}</div><div className="stat-label">Approved</div></div></div>
          <div className="stat-card"><div className="stat-icon yellow"><HiClock size={22} /></div><div><div className="stat-value">{stats.pending}</div><div className="stat-label">Pending</div></div></div>
          <div className="stat-card"><div className="stat-icon red"><HiPencil size={22} /></div><div><div className="stat-value">{stats.revision}</div><div className="stat-label">Revision</div></div></div>
        </div>

        <div className="filters">
          <div className="search-box">
            <HiSearch className="search-icon" size={20} />
            <input type="text" placeholder="Search by case number or patient..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Revision Required">Revision Required</option>
          </select>
        </div>

        <div className="table-card">
          <div className="table-header"><HiDocumentText size={18} /> Case Records</div>
          <table>
            <thead><tr><th>Case Number</th><th>Patient</th><th>Age Group</th><th>Date</th><th>Tests</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c._id}>
                  <td><span className="case-num">{c.caseNumber}</span></td>
                  <td><div className="patient-name">{c.patient}</div><div className="patient-gender">{c.gender}</div></td>
                  <td>{c.ageGroup}</td>
                  <td>{format(new Date(c.date), 'MMM d, yyyy')}</td>
                  <td>{c.tests.map((t, i) => <span key={i} className="test-badge">{t}</span>)}</td>
                  <td><span className={`status-badge status-${c.status === 'Approved' ? 'approved' : c.status === 'Pending' ? 'pending' : 'revision'}`}>{c.status}</span></td>
                  <td><div className="action-btns"><button className="action-btn"><HiEye size={16} /></button><button className="action-btn"><HiPencil size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ClinicalCases
