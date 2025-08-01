<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        🎓 Bienvenido a Repasa+
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Organiza tu carrera de Ingeniería Informática con herramientas diseñadas para el éxito académico
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CalendarIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.proximasEntregas }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Entregas próximas</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <BookOpenIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.asignaturas }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Asignaturas activas</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-emerald-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.completados }}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Progreso general</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClockIcon class="h-8 w-8 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stats.horasEstudio }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Horas esta semana</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/calendario" class="block">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
          <CalendarIcon class="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ver Calendario</h3>
          <p class="text-gray-600 dark:text-gray-300">Revisa tus entregas y planifica tu tiempo</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/asignaturas" class="block">
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
          <BookOpenIcon class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mis Asignaturas</h3>
          <p class="text-gray-600 dark:text-gray-300">Gestiona el contenido por materia</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/ejercicios" class="block">
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
          <PencilIcon class="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ejercicios</h3>
          <p class="text-gray-600 dark:text-gray-300">Practica y repasa conceptos clave</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Actividad Reciente</h3>
      </div>
      <div class="p-6">
        <div v-if="recentActivity.length === 0" class="text-center py-8">
          <ClockIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">No hay actividad reciente</p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">¡Comienza agregando tus asignaturas!</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <component :is="activity.icon" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-white">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Steps -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white p-6">
      <h3 class="text-xl font-semibold mb-4">🚀 Próximos Pasos</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center space-x-3">
          <CheckCircleIcon class="h-6 w-6 text-green-300" />
          <span>Configura tus asignaturas del cuatrimestre</span>
        </div>
        <div class="flex items-center space-x-3">
          <CheckCircleIcon class="h-6 w-6 text-green-300" />
          <span>Añade las fechas de entregas importantes</span>
        </div>
        <div class="flex items-center space-x-3">
          <CheckCircleIcon class="h-6 w-6 text-green-300" />
          <span>Planifica tu horario de estudio</span>
        </div>
        <div class="flex items-center space-x-3">
          <CheckCircleIcon class="h-6 w-6 text-green-300" />
          <span>Comienza a trackear tu progreso</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  CalendarIcon, 
  BookOpenIcon, 
  PencilIcon, 
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

// Stats reactivos
const stats = ref({
  proximasEntregas: 0,
  asignaturas: 0,
  completados: 0,
  horasEstudio: 0
})

// Actividad reciente
const recentActivity = ref([])

// Cargar datos iniciales
onMounted(async () => {
  // Aquí conectaremos con Convex más adelante
  // Por ahora, datos de ejemplo
  stats.value = {
    proximasEntregas: 3,
    asignaturas: 6,
    completados: 25,
    horasEstudio: 12
  }
  
  recentActivity.value = [
    {
      id: 1,
      description: 'Completaste el ejercicio de Álgebra Linear',
      time: 'Hace 2 horas',
      icon: CheckCircleIcon
    },
    {
      id: 2,
      description: 'Añadiste nueva entrega para Programación',
      time: 'Ayer',
      icon: CalendarIcon
    }
  ]
})

// Meta tags para SEO
useSeoMeta({
  title: 'Mi Plan de Estudios - Ingeniería Informática',
  description: 'Organiza y planifica tu carrera universitaria con herramientas diseñadas para estudiantes de ingeniería'
})
</script>