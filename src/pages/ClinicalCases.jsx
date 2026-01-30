import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import api from '../services/api'
import toast from 'react-hot-toast'
import { HiPlus, HiSearch, HiEye, HiPencil, HiDocumentText, HiCheckCircle, HiClock, HiX } from 'react-icons/hi'

const ClinicalCases = () => {
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, revision: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patientInfo: { initials: '', ageGroup: '', gender: 'Male', referralSource: '' },
    sessionDate: new Date().toISOString().split('T')[0],
    testsPerformed: [],
    findings: { additionalFindings: '' },
    recommendations: ''
  })

  const testTypes = ['PTA', 'ABR', 'OAE', 'Immittance', 'BERA', 'ASSR', 'Speech', 'BOA', 'VRA', 'CondPlay', 'CPA', 'HA_Trial', 'HA_Fitting', 'CI_Mapping', 'Counseling', 'Other']
  const ageGroups = ['<2y', '2.1-5y', '5.1-16y', '16.1-40y', '40.1-60y', '>60y']

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      setLoading(true)
      const response = await api.get('/clinical-cases')
      const casesData = response.data.data || []
      setCases(casesData)

      // Calculate stats
      const approved = casesData.filter(c => c.supervisorApproval?.status === 'Approved').length
      const pending = casesData.filter(c => c.supervisorApproval?.status === 'Pending').length
      const revision = casesData.filter(c => c.supervisorApproval?.status === 'Revision Required').length
      setStats({ total: casesData.length, approved, pending, revision })
    } catch (error) {
      toast.error('Failed to load clinical cases')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestToggle = (testType) => {
    const current = formData.testsPerformed
    const exists = current.find(t => t.testType === testType)
    if (exists) {
      setFormData({
        ...formData,
        testsPerformed: current.filter(t => t.testType !== testType)
      })
    } else {
      setFormData({
        ...formData,
        testsPerformed: [...current, { testType, completed: true }]
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.patientInfo.initials || !formData.patientInfo.ageGroup) {
      toast.error('Please fill in patient initials and age group')
      return
    }

    if (formData.testsPerformed.length === 0) {
      toast.error('Please select at least one test')
      return
    }

    try {
      setSubmitting(true)
      await api.post('/clinical-cases', formData)
      toast.success('Clinical case created successfully!')
      setShowModal(false)
      setFormData({
        patientInfo: { initials: '', ageGroup: '', gender: 'Male', referralSource: '' },
        sessionDate: new Date().toISOString().split('T')[0],
        testsPerformed: [],
        findings: { additionalFindings: '' },
        recommendations: ''
      })
      fetchCases()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create case')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCases = cases.filter(c => {
    const matchesSearch = !searchTerm ||
      c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientInfo?.initials?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || c.supervisorApproval?.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
        
        .empty-state { text-align: center; padding: 60px 20px; color: #7aa3c0; }
        .empty-state h3 { color: #fff; margin-bottom: 8px; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal { background: linear-gradient(145deg, #132238, #0f1c2e); border: 1px solid rgba(77,168,218,0.2); border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(77,168,218,0.1); }
        .modal-title { font-size: 1.2rem; font-weight: 600; color: #fff; }
        .modal-close { background: none; border: none; color: #7aa3c0; cursor: pointer; padding: 8px; }
        .modal-close:hover { color: #fff; }
        .modal-body { padding: 24px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 0.85rem; color: #7aa3c0; margin-bottom: 8px; font-weight: 500; }
        .form-input { width: 100%; padding: 12px 16px; background: rgba(13,31,53,0.8); border: 1px solid rgba(77,168,218,0.2); border-radius: 10px; color: #fff; font-size: 0.95rem; }
        .form-input:focus { outline: none; border-color: #4da8da; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .test-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .test-btn { padding: 10px; background: rgba(13,31,53,0.6); border: 2px solid transparent; border-radius: 8px; color: #7aa3c0; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
        .test-btn:hover { border-color: rgba(77,168,218,0.3); }
        .test-btn.active { background: rgba(77,168,218,0.15); border-color: #4da8da; color: #4da8da; }
        .modal-footer { padding: 20px 24px; border-top: 1px solid rgba(77,168,218,0.1); display: flex; justify-content: flex-end; gap: 12px; }
        .btn-secondary { padding: 12px 24px; background: transparent; border: 1px solid rgba(77,168,218,0.3); color: #7aa3c0; border-radius: 10px; font-size: 0.95rem; cursor: pointer; }
        .btn-secondary:hover { border-color: #4da8da; color: #fff; }
        
        @media (max-width: 900px) { 
          .stats-row { grid-template-columns: repeat(2, 1fr); } 
          .test-grid { grid-template-columns: repeat(3, 1fr); } 
        }
        
        @media (max-width: 640px) {
          .page { padding: 16px; }
          .page-header { flex-direction: column; align-items: stretch; gap: 12px; }
          .stats-row { grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .stat-card { padding: 14px; gap: 10px; }
          .stat-icon { width: 40px; height: 40px; }
          .stat-value { font-size: 1.2rem; }
          .stat-label { font-size: 0.7rem; }
          .filters { flex-direction: column; gap: 12px; }
          .search-box { min-width: 100%; }
          .filter-select { width: 100%; }
          .test-grid { grid-template-columns: repeat(2, 1fr); }
          .form-row { grid-template-columns: 1fr; }
          
          /* Table Responsive */
          .table-card { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          table { min-width: 800px; } /* Ensure table doesn't squish */
          th, td { padding: 12px 16px; font-size: 0.85rem; }
          
          .modal { margin: 10px; max-height: calc(100vh - 40px); }
          .modal-header { padding: 16px 20px; }
          .modal-body { padding: 16px 20px; }
        }
      `}</style>

      <div className="page-container">
        <div className="page-header">
          <div><h1 className="page-title">Clinical Cases</h1><p className="page-subtitle">Manage and review patient cases</p></div>
          <button className="btn-primary" onClick={() => setShowModal(true)}><HiPlus size={20} /> New Case</button>
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
            <option value="Rejected">Rejected</option>
            <option value="Revision Required">Revision Required</option>
          </select>
        </div>

        <div className="table-card">
          <div className="table-header"><HiDocumentText size={18} /> Case Records</div>
          {filteredCases.length > 0 ? (
            <table>
              <thead><tr><th>Case Number</th><th>Patient</th><th>Age Group</th><th>Date</th><th>Tests</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr key={c._id}>
                    <td><span className="case-num">{c.caseNumber}</span></td>
                    <td><div className="patient-name">{c.patientInfo?.initials}</div><div className="patient-gender">{c.patientInfo?.gender}</div></td>
                    <td>{c.patientInfo?.ageGroup}</td>
                    <td>{format(new Date(c.sessionDate), 'MMM d, yyyy')}</td>
                    <td>{c.testsPerformed?.slice(0, 3).map((t, i) => <span key={i} className="test-badge">{t.testType}</span>)}{c.testsPerformed?.length > 3 && <span className="test-badge">+{c.testsPerformed.length - 3}</span>}</td>
                    <td><span className={`status-badge ${c.supervisorApproval?.status === 'Approved' ? 'status-approved' : c.supervisorApproval?.status === 'Pending' ? 'status-pending' : 'status-revision'}`}>{c.supervisorApproval?.status}</span></td>
                    <td><div className="action-btns"><button className="action-btn"><HiEye size={16} /></button><button className="action-btn"><HiPencil size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <h3>No clinical cases found</h3>
              <p>Click "New Case" to add your first clinical case</p>
            </div>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Clinical Case</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Patient Initials *</label>
                    <input type="text" className="form-input" placeholder="e.g., JD" maxLength={5} value={formData.patientInfo.initials} onChange={e => setFormData({ ...formData, patientInfo: { ...formData.patientInfo, initials: e.target.value.toUpperCase() } })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select className="form-input" value={formData.patientInfo.gender} onChange={e => setFormData({ ...formData, patientInfo: { ...formData.patientInfo, gender: e.target.value } })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Age Group *</label>
                    <select className="form-input" value={formData.patientInfo.ageGroup} onChange={e => setFormData({ ...formData, patientInfo: { ...formData.patientInfo, ageGroup: e.target.value } })}>
                      <option value="">Select age group</option>
                      {ageGroups.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Session Date *</label>
                    <input type="date" className="form-input" value={formData.sessionDate} onChange={e => setFormData({ ...formData, sessionDate: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Referral Source</label>
                  <input type="text" className="form-input" placeholder="e.g., ENT Department" value={formData.patientInfo.referralSource} onChange={e => setFormData({ ...formData, patientInfo: { ...formData.patientInfo, referralSource: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tests Performed *</label>
                  <div className="test-grid">
                    {testTypes.map(test => (
                      <button type="button" key={test} className={`test-btn ${formData.testsPerformed.find(t => t.testType === test) ? 'active' : ''}`} onClick={() => handleTestToggle(test)}>{test}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Findings</label>
                  <textarea className="form-input" rows={3} placeholder="Additional findings..." value={formData.findings.additionalFindings} onChange={e => setFormData({ ...formData, findings: { ...formData.findings, additionalFindings: e.target.value } })}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Recommendations</label>
                  <textarea className="form-input" rows={2} placeholder="Recommendations..." value={formData.recommendations} onChange={e => setFormData({ ...formData, recommendations: e.target.value })}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Case'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClinicalCases
