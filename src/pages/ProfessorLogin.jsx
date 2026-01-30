import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { HiMail, HiLockClosed, HiArrowLeft } from 'react-icons/hi'

const ProfessorLogin = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    const result = await login(formData.email, formData.password)

    if (result.success) {
      // Check if user is a supervisor or admin
      const user = useAuthStore.getState().user
      if (user.role === 'Supervisor' || user.role === 'Admin') {
        toast.success('Welcome to Professor Panel!')
        navigate('/professor/dashboard')
      } else {
        // If not a professor, log them out and show error
        useAuthStore.getState().logout()
        toast.error('Access denied. This portal is for professors only.')
      }
    } else {
      toast.error(result.message || 'Login failed')
    }
  }

  return (
    <div className="prof-login">
      <style>{`
        .prof-login {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a1628 0%, #0d1f35 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
        }

        .back-link {
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7aa3c0;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #4da8da;
        }

        .login-container {
          width: 100%;
          max-width: 440px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .logo-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin: 0 auto 24px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(77, 168, 218, 0.35);
        }

        .logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-size: 0.95rem;
          color: #7aa3c0;
        }

        .login-card {
          background: linear-gradient(145deg, #132238 0%, #0f1c2e 100%);
          border: 1px solid rgba(77,168,218,0.15);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          color: #7aa3c0;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #4da8da;
        }

        .form-input {
          width: 100%;
          padding: 16px 16px 16px 50px;
          background: rgba(13,31,53,0.8);
          border: 1px solid rgba(77,168,218,0.2);
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: #4da8da;
          box-shadow: 0 0 20px rgba(77, 168, 218, 0.15);
        }

        .form-input::placeholder {
          color: #7aa3c0;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7aa3c0;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid rgba(77,168,218,0.4);
          background: transparent;
          cursor: pointer;
        }

        .forgot-link {
          color: #4da8da;
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .forgot-link:hover {
          color: #fff;
        }

        .login-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #4da8da, #2196F3);
          color: #0a1628;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(77, 168, 218, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(10, 22, 40, 0.3);
          border-top-color: #0a1628;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .student-link {
          text-align: center;
          margin-top: 28px;
          font-size: 0.9rem;
          color: #7aa3c0;
        }

        .student-link a {
          color: #4da8da;
          font-weight: 600;
          transition: color 0.2s;
        }

        .student-link a:hover {
          color: #fff;
        }

        .features {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(77,168,218,0.15);
        }

        .feature {
          text-align: center;
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(77,168,218,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          color: #4da8da;
        }

        .feature-text {
          font-size: 0.75rem;
          color: #7aa3c0;
        }

        @media (max-width: 480px) {
          .login-card { padding: 28px 24px; }
          .features { flex-direction: column; gap: 16px; }
        }
      `}</style>

      <Link to="/login" className="back-link">
        <HiArrowLeft size={18} />
        Student Login
      </Link>

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo-icon">
            <img src="/logo.png" alt="SRISH Logo" />
          </div>
          <h1 className="login-title">Professor Portal</h1>
          <p className="login-subtitle">Dr. S. R. Chandrasekhar Institute of Speech and Hearing</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <HiMail className="input-icon" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="professor@srish.edu"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <HiLockClosed className="input-icon" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Form Options */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" className="checkbox" />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {/* Login Button */}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading && <span className="spinner"></span>}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Student Link */}
          <p className="student-link">
            Are you a student? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfessorLogin
