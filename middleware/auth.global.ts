export default defineNuxtRouteMiddleware((to) => {
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register']
  
  // Si es una ruta pública, permitir acceso
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // En aplicaciones SPA, necesitamos esperar a que el cliente esté completamente cargado
  if (process.client) {
    // Pequeño delay para asegurar que localStorage esté disponible
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      return navigateTo('/login')
    }
  }
})
