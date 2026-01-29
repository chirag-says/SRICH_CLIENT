import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await api.post('/auth/login', { email, password })
                    const { token, user } = response.data

                    // Set token in API headers
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    })

                    return { success: true }
                } catch (error) {
                    const message = error.response?.data?.message || 'Login failed'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            // Register action
            register: async (userData) => {
                set({ isLoading: true, error: null })
                try {
                    const response = await api.post('/auth/register', userData)
                    const { token, user } = response.data

                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    })

                    return { success: true }
                } catch (error) {
                    const message = error.response?.data?.message || 'Registration failed'
                    set({ isLoading: false, error: message })
                    return { success: false, message }
                }
            },

            // Logout action
            logout: () => {
                delete api.defaults.headers.common['Authorization']
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null
                })
            },

            // Get current user
            fetchUser: async () => {
                const token = get().token
                if (!token) return

                set({ isLoading: true })
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    const response = await api.get('/auth/me')
                    set({ user: response.data.data, isLoading: false })
                } catch (error) {
                    get().logout()
                }
            },

            // Update user data locally
            updateUser: (userData) => {
                set({ user: { ...get().user, ...userData } })
            },

            // Clear error
            clearError: () => set({ error: null })
        }),
        {
            name: 'srish-auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
