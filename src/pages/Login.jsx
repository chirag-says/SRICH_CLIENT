import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'

const Login = () => {
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
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.message || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .institute-logo {
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
          border-radius: 50%;
          overflow: hidden;
        }

        .institute-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .institute-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin-bottom: 8px;
        }

        .institute-subtitle {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--color-bg-secondary);
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: var(--shadow-xl);
        }

        .login-title {
          font-size: 1.75rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 32px;
          color: var(--color-text-primary);
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }

        .form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-primary);
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          border-bottom-color: var(--color-accent-blue);
        }

        .form-input::placeholder {
          color: var(--color-text-muted);
        }

        .forgot-link {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }

        .forgot-link:hover {
          color: var(--color-accent-blue);
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: var(--color-bg-primary);
          color: var(--color-text-primary);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .login-btn:hover {
          background: #0a1420;
          transform: translateY(-1px);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
          color: var(--color-text-muted);
          font-size: 0.85rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        .social-buttons {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          background: var(--color-bg-card);
          border-color: var(--color-accent-blue);
        }

        .social-btn svg {
          width: 20px;
          height: 20px;
        }

        .register-link {
          text-align: center;
          margin-top: 28px;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }

        .register-link a {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .register-link a:hover {
          color: var(--color-accent-blue);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--color-text-muted);
          border-top-color: var(--color-text-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header with Institute Logo */}
      <div className="login-header">
        <div className="institute-logo">
          <img src="/logo.png" alt="SRISH Logo" />
        </div>
        <h1 className="institute-name">
          Dr. S. R. Chandrasekhar<br />
          Institute of Speech<br />
          and Hearing
        </h1>
        <p className="institute-subtitle">Designed By Atria Institute Of Technology</p>
      </div>

      {/* Login Card */}
      <div className="login-card animate-fadeIn">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="atria.cse@gmail.com"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Password</label>
              <a href="#" className="forgot-link">Forgot?</a>
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              placeholder="••••••••"
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading && <span className="spinner"></span>}
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="divider">Or continue with</div>

        {/* Social Buttons */}
        <div className="social-buttons">
          <button type="button" className="social-btn">
            <FcGoogle />
            Google
          </button>
          <button type="button" className="social-btn">
            <FaFacebook style={{ color: '#1877f2' }} />
            Facebook
          </button>
        </div>

        {/* Register Link */}
        <p className="register-link">
          Don't have account? <Link to="/register">Create now</Link>
        </p>

        {/* Professor Portal Link */}
        <p className="register-link" style={{ marginTop: '12px' }}>
          Are you a professor? <Link to="/professor/login">Professor Portal</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
