<template>
  <div class="min-h-screen">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="space-y-8">
      <!-- Header -->
      <div class="text-center py-6">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🎓 Bienvenido a Repasa+
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Organiza tu carrera de Ingeniería Informática con herramientas diseñadas para el éxito académico
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CalendarIcon class="h-8 w-8 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.proximasEntregas }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Entregas próximas</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <BookOpenIcon class="h-8 w-8 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.asignaturas }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Asignaturas activas</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-8 w-8 text-emerald-600" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.completados }}%</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Progreso general</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClockIcon class="h-8 w-8 text-orange-600" />
            </div>
            <div class="ml-4">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.horasEstudio }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Horas totales</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink to="/calendario" class="block group">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 border border-blue-100 dark:border-blue-800 group-hover:shadow-lg group-hover:-translate-y-1">
            <CalendarIcon class="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ver Calendario</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Revisa tus entregas y planifica tu tiempo</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/asignaturas" class="block group">
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300 border border-green-100 dark:border-green-800 group-hover:shadow-lg group-hover:-translate-y-1">
            <BookOpenIcon class="h-10 w-10 text-green-600 dark:text-green-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mis Asignaturas</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Gestiona el contenido por materia</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/ejercicios" class="block group">
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 border border-purple-100 dark:border-purple-800 group-hover:shadow-lg group-hover:-translate-y-1">
            <PencilIcon class="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ejercicios</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">Practica y repasa conceptos clave</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div class="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Actividad Reciente</h3>
        </div>
        <div class="p-8">
          <div v-if="recentActivity.length === 0" class="text-center py-12">
            <ClockIcon class="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <p class="text-lg text-gray-500 dark:text-gray-400 mb-2">No hay actividad reciente</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">¡Comienza agregando tus asignaturas!</p>
          </div>
          <div v-else class="space-y-6">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <component :is="activity.icon" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ activity.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CalendarIcon,
  BookOpenIcon,
  CheckCircleIcon,
  PencilIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// Importar Convex
const { convex, getCurrentUserId } = useConvexData()

// Estados reactivos
const loading = ref(true)
const stats = ref({
  proximasEntregas: 0,
  asignaturas: 0,
  completados: 0,
  horasEstudio: 0
})

// Actividad reciente
const recentActivity = ref([])

// Cargar datos reales de la base de datos
onMounted(async () => {
  try {
    loading.value = true
    
    // Obtener asignaturas del usuario
    const asignaturas = await convex.query('asignaturas:getAsignaturasByUsuario', {
      usuarioId: getCurrentUserId()
    })
    
    // Obtener entregas del usuario
    const entregas = await convex.query('entregas:getEntregasByUsuario', {
      usuarioId: getCurrentUserId()
    })
    
    // Obtener usuario para las horas totales
    const usuario = await convex.query('usuarios:getUsuarioByEmail', {
      email: 'estudiante@ejemplo.com'
    })
    
    console.log('📊 Datos cargados:', { asignaturas, entregas, usuario })
    
    // Calcular estadísticas reales
    const ahora = Date.now()
    const unaSemana = 7 * 24 * 60 * 60 * 1000 // 7 días en millisegundos
    
    // Entregas próximas (próximas 2 semanas)
    const entregasProximas = entregas.filter(entrega => 
      entrega.estado === 'pendiente' && 
      entrega.fechaEntrega > ahora && 
      entrega.fechaEntrega < (ahora + (2 * unaSemana))
    )
    
    // Progreso general (promedio de progreso de asignaturas)
    const progresoGeneral = asignaturas.length > 0 
      ? Math.round(asignaturas.reduce((sum, asig) => sum + asig.progreso, 0) / asignaturas.length)
      : 0
    
    // Horas de estudio totales de las asignaturas
    const horasEstudioTotales = asignaturas.reduce((sum, asig) => sum + (asig.horasEstudio || 0), 0)
    
    stats.value = {
      proximasEntregas: entregasProximas.length,
      asignaturas: asignaturas.length,
      completados: progresoGeneral,
      horasEstudio: horasEstudioTotales
    }
    
    // Generar actividad reciente basada en datos reales
    const actividadReciente = []
    
    // Entregas completadas recientemente
    const entregasCompletadas = entregas
      .filter(entrega => entrega.estado === 'completada')
      .sort((a, b) => b.fechaActualizacion - a.fechaActualizacion)
      .slice(0, 2)
    
    entregasCompletadas.forEach(entrega => {
      const asignatura = asignaturas.find(a => a._id === entrega.asignaturaId)
      actividadReciente.push({
        id: entrega._id,
        description: `Completaste "${entrega.titulo}" de ${asignatura?.nombre || 'una asignatura'}`,
        time: formatTimeAgo(entrega.fechaActualizacion),
        icon: CheckCircleIcon
      })
    })
    
    // Entregas próximas
    entregasProximas.slice(0, 2).forEach(entrega => {
      const asignatura = asignaturas.find(a => a._id === entrega.asignaturaId)
      actividadReciente.push({
        id: `proxima-${entrega._id}`,
        description: `Tienes "${entrega.titulo}" de ${asignatura?.nombre || 'una asignatura'} próximamente`,
        time: formatTimeUntil(entrega.fechaEntrega),
        icon: CalendarIcon
      })
    })
    
    // Si no hay actividad, mostrar mensaje motivacional
    if (actividadReciente.length === 0) {
      actividadReciente.push({
        id: 'welcome',
        description: '¡Bienvenido a Repasa+! Comienza agregando tus asignaturas',
        time: 'Ahora',
        icon: BookOpenIcon
      })
    }
    
    recentActivity.value = actividadReciente.slice(0, 5) // Máximo 5 actividades
    
    console.log('📊 Estadísticas calculadas:', stats.value)
    console.log('📝 Actividad reciente:', recentActivity.value)
    
  } catch (error) {
    console.error('❌ Error cargando datos del dashboard:', error)
    
    // Valores por defecto en caso de error
    stats.value = {
      proximasEntregas: 0,
      asignaturas: 0,
      completados: 0,
      horasEstudio: 0
    }
    
    recentActivity.value = [{
      id: 'error',
      description: 'Error cargando datos. Verifica tu conexión.',
      time: 'Ahora',
      icon: ClockIcon
    }]
  } finally {
    loading.value = false
  }
})

// Funciones auxiliares para formatear tiempo
function formatTimeAgo(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) return `Hace ${minutes} minutos`
  if (hours < 24) return `Hace ${hours} horas`
  if (days < 7) return `Hace ${days} días`
  return `Hace más de una semana`
}

function formatTimeUntil(timestamp) {
  const now = Date.now()
  const diff = timestamp - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (hours < 24) return `En ${hours} horas`
  if (days < 7) return `En ${days} días`
  return `En más de una semana`
}

// Meta tags para SEO
useSeoMeta({
  title: 'Mi Plan de Estudios - Ingeniería Informática',
  description: 'Organiza y planifica tu carrera universitaria con herramientas diseñadas para estudiantes de ingeniería'
})
</script>