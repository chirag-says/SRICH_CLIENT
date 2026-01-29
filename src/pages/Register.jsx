import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    registrationNumber: '',
    batch: '2022-2026',
    semester: 4,
    role: 'Student'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    const { confirmPassword, ...userData } = formData
    const result = await register(userData)

    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } else {
      toast.error(result.message || 'Registration failed')
    }
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="register-page">
      <style>{`
        .register-page {
          min-height: 100vh;
          background: var(--color-bg-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 20px;
        }

        .register-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .institute-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          border-radius: 50%;
          overflow: hidden;
        }

        .institute-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .institute-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin-bottom: 6px;
        }

        .institute-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .register-card {
          width: 100%;
          max-width: 450px;
          background: var(--color-bg-secondary);
          border-radius: 24px;
          padding: 32px;
          box-shadow: var(--shadow-xl);
        }

        .register-title {
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 28px;
          color: var(--color-text-primary);
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 6px;
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

        .form-select {
          width: 100%;
          padding: 12px 0;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-primary);
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          cursor: pointer;
        }

        .form-select option {
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .register-btn {
          width: 100%;
          padding: 14px;
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

        .register-btn:hover {
          background: #0a1420;
          transform: translateY(-1px);
        }

        .register-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
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
          padding: 12px;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          background: var(--color-bg-card);
          border-color: var(--color-accent-blue);
        }

        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }

        .login-link a {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .login-link a:hover {
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
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div className="register-header">
        <div className="institute-logo">
          <img src="/logo.png" alt="SRISH Logo" />
        </div>
        <h1 className="institute-name">
          Dr. S. R. Chandrasekhar<br />
          Institute of Speech and Hearing
        </h1>
        <p className="institute-subtitle">Designed By Atria Institute Of Technology</p>
      </div>

      {/* Register Card */}
      <div className="register-card animate-fadeIn">
        <h2 className="register-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="form-input"
              placeholder="student@srish.edu.in"
              required
            />
          </div>

          {/* Password Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Batch & Semester */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Batch</label>
              <select
                value={formData.batch}
                onChange={(e) => updateField('batch', e.target.value)}
                className="form-select"
              >
                <option value="2021-2025">2021-2025</option>
                <option value="2022-2026">2022-2026</option>
                <option value="2023-2027">2023-2027</option>
                <option value="2024-2028">2024-2028</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => updateField('semester', parseInt(e.target.value))}
                className="form-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Register Button */}
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading && <span className="spinner"></span>}
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="divider">Or continue with</div>

        {/* Social Buttons */}
        <div className="social-buttons">
          <button type="button" className="social-btn">
            <FcGoogle size={20} />
            Google
          </button>
          <button type="button" className="social-btn">
            <FaFacebook size={20} style={{ color: '#1877f2' }} />
            Facebook
          </button>
        </div>

        {/* Login Link */}
        <p className="login-link">
          Already have account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
