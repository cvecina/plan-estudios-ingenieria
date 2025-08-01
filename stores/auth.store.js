import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  }),

  getters: {
    getUserId: (state) => state.user?._id,
    getUserEmail: (state) => state.user?.email,
    getUserName: (state) => state.user?.name || state.user?.email?.split('@')[0]
  },

  actions: {
    // Inicializar desde localStorage
    init() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        if (token && userData) {
          try {
            this.user = JSON.parse(userData)
            this.isAuthenticated = true
          } catch (error) {
            console.error('Error parsing user data:', error)
            this.logout()
          }
        }
      }
    },

    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        // Por ahora simulamos login local
        // TODO: Integrar con Convex para autenticación real
        
        if (email && password.length >= 6) {
          const userData = {
            _id: `user_${Date.now()}`, // ID temporal
            email,
            name: email.split('@')[0],
            createdAt: Date.now()
          }

          this.user = userData
          this.isAuthenticated = true

          // Guardar en localStorage
          if (process.client) {
            localStorage.setItem('auth_token', 'temp_token_' + Date.now())
            localStorage.setItem('user_data', JSON.stringify(userData))
          }

          return { success: true }
        } else {
          throw new Error('Credenciales inválidas')
        }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async register(name, email, password) {
      this.isLoading = true
      this.error = null

      try {
        // Por ahora simulamos registro local
        // TODO: Integrar con Convex para registro real
        
        if (name && email && password.length >= 6) {
          const userData = {
            _id: `user_${Date.now()}`, // ID temporal
            name,
            email,
            createdAt: Date.now()
          }

          this.user = userData
          this.isAuthenticated = true

          // Guardar en localStorage
          if (process.client) {
            localStorage.setItem('auth_token', 'temp_token_' + Date.now())
            localStorage.setItem('user_data', JSON.stringify(userData))
          }

          return { success: true }
        } else {
          throw new Error('Datos de registro inválidos')
        }
      } catch (error) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.error = null

      if (process.client) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }

      // Redirigir al login
      if (process.client) {
        window.location.href = '/login'
      }
    },

    clearError() {
      this.error = null
    }
  }
})
