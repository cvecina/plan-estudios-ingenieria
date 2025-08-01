<script setup>
import moment from "moment";
import "moment/dist/locale/es";
moment.locale("es");

// Inicializar stores
const studiesStore = useStudiesStore()
const authStore = useAuthStore()
const router = useRouter()

// Verificar autenticación en el cliente
onMounted(() => {
  // Inicializar store de estudios
  studiesStore.initializeData()
  
  // Inicializar autenticación
  authStore.init()
  
  // Verificar autenticación para rutas protegidas
  const publicRoutes = ['/login', '/register']
  const currentPath = router.currentRoute.value.path
  
  if (!publicRoutes.includes(currentPath) && !authStore.isAuthenticated) {
    router.push('/login')
  }
})

// Escuchar cambios de ruta para verificar autenticación
router.beforeEach((to, from, next) => {
  const publicRoutes = ['/login', '/register']
  
  if (process.client && !publicRoutes.includes(to.path)) {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return next('/login')
    }
  }
  
  next()
})
</script>

<template>
  <NuxtLayout>
    <template #header></template>
    <template #main>
      <NuxtPage />
    </template>
    <template #footer></template>
  </NuxtLayout>
</template>
