import axios from 'axios'

// Use environment variable for production, fallback to /api for development (proxy)
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('srish-auth-storage')
        if (token) {
            try {
                const parsed = JSON.parse(token)
                if (parsed.state?.token) {
                    config.headers.Authorization = `Bearer ${parsed.state.token}`
                }
            } catch (e) {
                // Invalid token in storage
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login')

        if (error.response?.status === 401 && !isLoginRequest) {
            // Token expired or invalid
            localStorage.removeItem('srish-auth-storage')

            // Redirect based on current path
            if (window.location.pathname.startsWith('/professor')) {
                window.location.href = '/professor/login'
            } else {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
