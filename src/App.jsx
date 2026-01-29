import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ClinicalCases from './pages/ClinicalCases'
import Attendance from './pages/Attendance'
import LeaveRequests from './pages/LeaveRequests'
import Statistics from './pages/Statistics'
import Profile from './pages/Profile'

// Layout Component with Header Navigation
const AppLayout = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navItems = [
    { path: '/dashboard', label: 'DASHBOARD' },
    { path: '/clinical-cases', label: 'CLINICAL CASES' },
    { path: '/attendance', label: 'ATTENDANCE' },
    { path: '/leave-requests', label: 'LEAVE REQUESTS' },
    { path: '/statistics', label: 'STATISTICS' }
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="app-layout">
      <style>{`
        .app-layout {
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .app-header {
          background: var(--color-bg-secondary);
          border-bottom: 1px solid var(--color-border);
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          height: 70px;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-right: 40px;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          white-space: nowrap;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .nav-link {
          padding: 24px 20px;
          color: var(--color-text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          position: relative;
          transition: color 0.2s ease;
          white-space: nowrap;
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
          left: 20px;
          right: 20px;
          height: 3px;
          background: var(--color-accent-blue);
          border-radius: 3px 3px 0 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--color-bg-primary);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .user-avatar:hover {
          transform: scale(1.05);
        }

        .logout-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          border-color: var(--color-accent-blue);
        }

        .app-main {
          min-height: calc(100vh - 70px);
        }

        @media (max-width: 1024px) {
          .header-nav {
            display: none;
          }
          
          .logo-text {
            display: none;
          }
        }
      `}</style>

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo">
            <div className="logo-icon">
              <img src="/logo.png" alt="SRISH Logo" />
            </div>
            <span className="logo-text">Dr. S. R. Chandrasekhar Institute Of Speech And Hearing</span>
          </div>

          {/* Navigation */}
          <nav className="header-nav">
            {navItems.map((item, index) => (
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

// Protected Route Component
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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
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

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
