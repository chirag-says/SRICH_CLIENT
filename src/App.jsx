import React from 'react'
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Student Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ClinicalCases from './pages/ClinicalCases'
import Attendance from './pages/Attendance'
import LeaveRequests from './pages/LeaveRequests'
import Statistics from './pages/Statistics'
import Profile from './pages/Profile'

// Professor Pages
import ProfessorLogin from './pages/ProfessorLogin'
import ProfessorDashboard from './pages/ProfessorDashboard'
import ProfessorStudents from './pages/ProfessorStudents'
import ProfessorStudentDetail from './pages/ProfessorStudentDetail'
import ProfessorPending from './pages/ProfessorPending'

// Icons
import {
  HiAcademicCap,
  HiHome,
  HiClipboardList,
  HiClock,
  HiCalendar,
  HiChartBar,
  HiUser,
  HiLogout,
  HiX,
  HiMenu
} from 'react-icons/hi'

// Student Layout Component with Header Navigation
const AppLayout = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { path: '/dashboard', label: 'DASHBOARD', icon: HiHome },
    { path: '/clinical-cases', label: 'CLINICAL CASES', icon: HiClipboardList },
    { path: '/attendance', label: 'ATTENDANCE', icon: HiClock },
    { path: '/leave-requests', label: 'LEAVE REQUESTS', icon: HiCalendar },
    { path: '/statistics', label: 'STATISTICS', icon: HiChartBar },
    { path: '/profile', label: 'PROFILE', icon: HiUser }
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="app-layout">
      <style>{`
        .app-layout {
          min-height: 100vh;
          background: var(--color-bg-primary);
          width: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .app-header {
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
          padding: 0 16px;
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          margin: 0;
          z-index: 100;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .app-header {
            padding: 0 24px;
          }
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          height: 60px;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .header-content {
            height: 70px;
          }
        }

        /* Hamburger Menu Button */
        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .hamburger-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .hamburger-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger-icon span {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--color-text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.active .hamburger-icon span:nth-child(1) {
          transform: rotate(45deg) translate(4px, 4px);
        }

        .hamburger-btn.active .hamburger-icon span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.active .hamburger-icon span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @media (min-width: 1024px) {
          .hamburger-btn {
            display: none;
          }
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          justify-content: flex-start;
        }

        @media (min-width: 1024px) {
          .header-logo {
            flex: none;
            margin-right: 40px;
          }
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .logo-icon {
            width: 50px;
            height: 50px;
          }
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-text-primary);
          white-space: nowrap;
          display: none;
        }

        @media (min-width: 768px) {
          .logo-text {
            display: block;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        @media (min-width: 1280px) {
          .logo-text {
            max-width: none;
            font-size: 1.1rem;
          }
        }

        .header-nav {
          display: none;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        @media (min-width: 1024px) {
          .header-nav {
            display: flex;
          }
        }

        .nav-link {
          padding: 24px 16px;
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: 0.85rem;
          text-decoration: none;
          position: relative;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        @media (min-width: 1280px) {
          .nav-link {
            padding: 24px 20px;
            font-size: 0.9rem;
          }
        }

        .nav-link:hover {
          color: var(--color-text-primary);
        }

        .nav-link.active {
          color: var(--color-text-primary);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 3px;
          background: var(--color-accent-blue);
          border-radius: 3px 3px 0 0;
        }

        @media (min-width: 1280px) {
          .nav-link.active::after {
            left: 20px;
            right: 20px;
          }
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .header-actions {
            gap: 12px;
          }
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-bg-primary);
          cursor: pointer;
          transition: transform 0.2s ease;
          text-decoration: none;
        }

        @media (min-width: 640px) {
          .user-avatar {
            width: 40px;
            height: 40px;
          }
        }

        .user-avatar:hover {
          transform: scale(1.05);
        }

        .logout-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: none;
        }

        @media (min-width: 640px) {
          .logout-btn {
            display: block;
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }

        .logout-btn:hover {
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          border-color: var(--color-accent-blue);
        }

        .app-main {
          min-height: calc(100vh - 60px);
        }

        @media (min-width: 640px) {
          .app-main {
            min-height: calc(100vh - 70px);
          }
        }

        /* Mobile Menu Overlay */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 200;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Menu Drawer */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          max-width: 85vw;
          height: 100vh;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          z-index: 201;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        @media (min-width: 1024px) {
          .mobile-menu-overlay,
          .mobile-menu {
            display: none;
          }
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--color-border);
        }

        .mobile-menu-logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .mobile-menu-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mobile-menu-title {
          flex: 1;
        }

        .mobile-menu-title h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .mobile-menu-title p {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin: 2px 0 0;
        }

        .mobile-close-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-close-btn:hover {
          background: rgba(255,255,255,0.1);
          color: var(--color-text-primary);
        }

        .mobile-nav {
          flex: 1;
          padding: 12px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s ease;
          margin-bottom: 4px;
        }

        .mobile-nav-link:hover {
          background: rgba(255,255,255,0.05);
          color: var(--color-text-primary);
        }

        .mobile-nav-link.active {
          background: linear-gradient(135deg, rgba(77,168,218,0.15), rgba(0,212,255,0.1));
          color: var(--color-accent-cyan);
        }

        .mobile-nav-link .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .mobile-menu-footer {
          padding: 16px 20px;
          border-top: 1px solid var(--color-border);
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .mobile-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--color-bg-primary);
          flex-shrink: 0;
        }

        .mobile-user-details {
          flex: 1;
          min-width: 0;
        }

        .mobile-user-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-user-role {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          margin: 2px 0 0;
        }

        .mobile-logout-btn {
          width: 100%;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #ef4444;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .mobile-logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
        }
      `}</style>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <img src="/logo.png" alt="SRISH Logo" />
          </div>
          <div className="mobile-menu-title">
            <h3>SRISH</h3>
            <p>Clinical Logbook</p>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <HiX size={20} />
          </button>
        </div>

        <nav className="mobile-nav">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className="nav-icon" size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-footer">
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="mobile-user-details">
              <p className="mobile-user-name">{user?.name || 'User'}</p>
              <p className="mobile-user-role">{user?.batch} • Semester {user?.semester}</p>
            </div>
          </div>
          <button className="mobile-logout-btn" onClick={logout}>
            <HiLogout size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Logo */}
          <div className="header-logo">
            <div className="logo-icon">
              <img src="/logo.png" alt="SRISH Logo" />
            </div>
            <span className="logo-text">Dr. S. R. Chandrasekhar Institute Of Speech And Hearing</span>
          </div>

          {/* Navigation - Desktop Only */}
          <nav className="header-nav">
            {navItems.filter(item => item.path !== '/profile').map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="header-actions">
            <Link to="/profile" className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Link>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}

// Professor Layout Component
const ProfessorLayout = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/professor/dashboard', label: 'DASHBOARD' },
    { path: '/professor/students', label: 'STUDENTS' },
    { path: '/professor/pending', label: 'PENDING REVIEWS' }
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="prof-layout">
      <style>{`
        .prof-layout {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .prof-header {
          background: linear-gradient(90deg, #132238 0%, #1e3a5f 100%);
          border-bottom: 1px solid rgba(77,168,218,0.2);
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .prof-header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          height: 70px;
        }

        .prof-header-logo {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-right: 40px;
        }

        .prof-logo-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
        }

        .prof-logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .prof-logo-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          white-space: nowrap;
        }

        .prof-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #0a1628;
          margin-left: 12px;
        }

        .prof-header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .prof-nav-link {
          padding: 24px 20px;
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          position: relative;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .prof-nav-link:hover {
          color: var(--color-text-primary);
        }

        .prof-nav-link.active {
          color: var(--color-text-primary);
        }

        .prof-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20px;
          right: 20px;
          height: 3px;
          background: linear-gradient(90deg, #4da8da, #00d4ff);
          border-radius: 3px 3px 0 0;
        }

        .prof-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .prof-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #0a1628;
          cursor: pointer;
          transition: transform 0.2s ease;
          text-decoration: none;
        }

        .prof-user-avatar:hover {
          transform: scale(1.05);
        }

        .prof-logout-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(77,168,218,0.3);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .prof-logout-btn:hover {
          background: rgba(77,168,218,0.1);
          color: var(--color-text-primary);
          border-color: #4da8da;
        }

        .prof-main {
          min-height: calc(100vh - 70px);
        }

        @media (max-width: 1024px) {
          .prof-header-nav {
            display: none;
          }
          
          .prof-logo-text {
            display: none;
          }

          .prof-badge {
            margin-left: 0;
          }
        }
      `}</style>

      {/* Header */}
      <header className="prof-header">
        <div className="prof-header-content">
          {/* Logo */}
          <div className="prof-header-logo">
            <div className="prof-logo-icon">
              <img src="/logo.png" alt="SRISH Logo" />
            </div>
            <span className="prof-logo-text">SRISH - Professor Panel</span>
            <span className="prof-badge">
              <HiAcademicCap size={12} />
              Professor
            </span>
          </div>

          {/* Navigation */}
          <nav className="prof-header-nav">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`prof-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="prof-header-actions">
            <Link to="/professor/dashboard" className="prof-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </Link>
            <button onClick={logout} className="prof-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="prof-main">
        {children}
      </main>
    </div>
  )
}

// Protected Route Component for Students
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-primary)'
      }}>
        <div className="spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-bg-card)',
          borderTopColor: 'var(--color-accent-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

// Protected Route Component for Professors
const ProfessorRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore()

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f35 100%)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(77,168,218,0.2)',
          borderTopColor: '#4da8da',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/professor/login" replace />
  }

  // Check if user is a professor (Supervisor or Admin)
  if (user?.role !== 'Supervisor' && user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <ProfessorLayout>{children}</ProfessorLayout>
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/professor/login" element={<ProfessorLogin />} />

      {/* Student Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/clinical-cases/*" element={
        <ProtectedRoute><ClinicalCases /></ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute><Attendance /></ProtectedRoute>
      } />
      <Route path="/leave-requests" element={
        <ProtectedRoute><LeaveRequests /></ProtectedRoute>
      } />
      <Route path="/statistics" element={
        <ProtectedRoute><Statistics /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Professor Protected Routes */}
      <Route path="/professor/dashboard" element={
        <ProfessorRoute><ProfessorDashboard /></ProfessorRoute>
      } />
      <Route path="/professor/students" element={
        <ProfessorRoute><ProfessorStudents /></ProfessorRoute>
      } />
      <Route path="/professor/students/:id" element={
        <ProfessorRoute><ProfessorStudentDetail /></ProfessorRoute>
      } />
      <Route path="/professor/pending" element={
        <ProfessorRoute><ProfessorPending /></ProfessorRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
