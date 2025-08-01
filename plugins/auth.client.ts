export default defineNuxtPlugin(() => {
  if (process.client) {
    // Asegurarnos de que el store se inicialice inmediatamente
    const authStore = useAuthStore()
    authStore.init()
  }
})
