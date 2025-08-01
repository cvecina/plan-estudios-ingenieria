<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📊 Mi Progreso</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Seguimiento detallado de tu rendimiento académico</p>
    </div>

    <!-- Time Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            selectedPeriod === period.value 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
      
      <div class="mt-4 sm:mt-0">
        <select v-model="selectedSubjectFilter" class="input-field">
          <option value="">Todas las asignaturas</option>
          <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ChartBarIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ overallProgress }}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Progreso General</p>
          </div>
        </div>
        <div class="mt-4">
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-green-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClockIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalStudyTime }}h</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tiempo de Estudio</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ averageDailyTime }}h promedio diario
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ completedTasks }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tareas Completadas</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ pendingTasks }} pendientes
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <StarIcon class="h-8 w-8 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ currentStreak }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Días Consecutivos</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Récord: {{ maxStreak }} días
        </p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Progress by Subject -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progreso por Asignatura</h3>
        <div class="space-y-4">
          <div v-for="subject in subjectProgress" :key="subject.id" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ subject.name }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ subject.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                :class="['h-2 rounded-full transition-all duration-500', getSubjectColor(subject.color)]"
                :style="{ width: `${subject.progress}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ subject.completedTasks }}/{{ subject.totalTasks }} tareas</span>
              <span>{{ subject.studyHours }}h estudio</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Study Time Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tiempo de Estudio Semanal</h3>
        <div class="space-y-3">
          <div v-for="week in weeklyStudyTime" :key="week.week" class="flex items-center space-x-3">
            <span class="text-sm text-gray-500 dark:text-gray-400 w-16">{{ week.week }}</span>
            <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
              <div 
                class="bg-blue-600 h-4 rounded-full transition-all duration-500"
                :style="{ width: `${(week.hours / maxWeeklyHours) * 100}%` }"
              ></div>
              <span class="absolute right-2 top-0 text-xs text-white font-medium leading-4">
                {{ week.hours }}h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Achievements -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Logros Recientes</h3>
        <div class="space-y-3">
          <div v-for="achievement in recentAchievements" :key="achievement.id" class="flex items-start space-x-3">
            <div :class="['flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm', achievement.color]">
              {{ achievement.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ achievement.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ achievement.description }}</p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(achievement.date) }}</p>
            </div>
          </div>
        </div>
        <div v-if="recentAchievements.length === 0" class="text-center py-8">
          <TrophyIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p class="text-sm text-gray-500 dark:text-gray-400">No hay logros recientes</p>
        </div>
      </div>

      <!-- Study Habits -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hábitos de Estudio</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Mejor hora del día</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ bestStudyTime }}</span>
            </div>
          </div>
          
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Sesión promedio</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ averageSessionTime }}min</span>
            </div>
          </div>
          
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Días más productivos</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ mostProductiveDays }}</span>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Asignatura favorita</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ favoriteSubject }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Goals -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Objetivos</h3>
          <button @click="showAddGoalModal = true" class="text-blue-600 hover:text-blue-700 text-sm">
            <PlusIcon class="h-4 w-4 inline mr-1" />
            Agregar
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="goal in goals" :key="goal.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ goal.title }}</h4>
              <span :class="[
                'text-xs px-2 py-1 rounded-full',
                goal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
              ]">
                {{ getGoalStatusLabel(goal.status) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${goal.progress}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{{ goal.progress }}% completado</span>
              <span>Vence: {{ formatDate(goal.dueDate) }}</span>
            </div>
          </div>
        </div>
        <div v-if="goals.length === 0" class="text-center py-8">
          <FlagIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p class="text-sm text-gray-500 dark:text-gray-400">No hay objetivos definidos</p>
        </div>
      </div>
    </div>

    <!-- Add Goal Modal -->
    <Modal v-model="showAddGoalModal" title="Nuevo Objetivo">
      <form @submit.prevent="addGoal" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Título del objetivo
          </label>
          <input 
            v-model="goalForm.title"
            type="text" 
            required
            class="input-field"
            placeholder="Ej: Completar todas las prácticas de Programación"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha límite
          </label>
          <input 
            v-model="goalForm.dueDate"
            type="date" 
            required
            class="input-field"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea 
            v-model="goalForm.description"
            rows="3"
            class="input-field"
            placeholder="Describe tu objetivo..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="showAddGoalModal = false" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            Crear Objetivo
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  TrophyIcon,
  FlagIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import Modal from '~/components/Modal.vue'

// Estado reactivo
const selectedPeriod = ref('week')
const selectedSubjectFilter = ref('')
const showAddGoalModal = ref(false)
const subjects = ref([])
const progressData = ref({})
const goals = ref([])

// Períodos de tiempo
const timePeriods = [
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'semester', label: 'Este cuatrimestre' },
  { value: 'year', label: 'Este año' }
]

// Formulario de objetivo
const goalForm = ref({
  title: '',
  dueDate: '',
  description: ''
})

// Datos de ejemplo
const studyData = ref({
  totalHours: 85,
  averageDailyHours: 2.1,
  completedTasks: 23,
  pendingTasks: 8,
  currentStreak: 7,
  maxStreak: 12,
  bestStudyTime: '16:00-18:00',
  averageSessionTime: 45,
  mostProductiveDays: 'Mar, Jue',
  favoriteSubject: 'Programación I'
})

const weeklyStudyTime = ref([
  { week: 'Sem 1', hours: 15 },
  { week: 'Sem 2', hours: 22 },
  { week: 'Sem 3', hours: 18 },
  { week: 'Sem 4', hours: 25 },
  { week: 'Actual', hours: 12 }
])

const recentAchievements = ref([
  {
    id: 1,
    title: '7 días consecutivos',
    description: 'Has estudiado 7 días seguidos',
    date: '2025-08-07',
    icon: '🔥',
    color: 'bg-orange-500'
  },
  {
    id: 2,
    title: 'Primera práctica completada',
    description: 'Completaste tu primera práctica de Programación',
    date: '2025-08-05',
    icon: '🎯',
    color: 'bg-green-500'
  },
  {
    id: 3,
    title: '50 horas de estudio',
    description: 'Has alcanzado las 50 horas de estudio',
    date: '2025-08-03',
    icon: '📚',
    color: 'bg-blue-500'
  }
])

// Computed properties
const overallProgress = computed(() => {
  if (subjects.value.length === 0) return 0
  const total = subjects.value.reduce((sum, subject) => sum + subject.progress, 0)
  return Math.round(total / subjects.value.length)
})

const totalStudyTime = computed(() => studyData.value.totalHours)
const averageDailyTime = computed(() => studyData.value.averageDailyHours)
const completedTasks = computed(() => studyData.value.completedTasks)
const pendingTasks = computed(() => studyData.value.pendingTasks)
const currentStreak = computed(() => studyData.value.currentStreak)
const maxStreak = computed(() => studyData.value.maxStreak)
const bestStudyTime = computed(() => studyData.value.bestStudyTime)
const averageSessionTime = computed(() => studyData.value.averageSessionTime)
const mostProductiveDays = computed(() => studyData.value.mostProductiveDays)
const favoriteSubject = computed(() => studyData.value.favoriteSubject)

const subjectProgress = computed(() => {
  let filtered = subjects.value
  if (selectedSubjectFilter.value) {
    filtered = filtered.filter(s => s.id === selectedSubjectFilter.value)
  }
  return filtered
})

const maxWeeklyHours = computed(() => {
  return Math.max(...weeklyStudyTime.value.map(w => w.hours))
})

// Métodos
const getSubjectColor = (color) => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500'
  }
  return colors[color] || colors.blue
}

const getGoalStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado'
  }
  return labels[status] || 'Pendiente'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const addGoal = () => {
  const newGoal = {
    id: Date.now(),
    ...goalForm.value,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString()
  }
  
  goals.value.push(newGoal)
  
  // Reset form
  goalForm.value = {
    title: '',
    dueDate: '',
    description: ''
  }
  
  showAddGoalModal.value = false
}

// Cargar datos iniciales
onMounted(() => {
  // Datos de ejemplo para asignaturas
  subjects.value = [
    {
      id: 1,
      name: 'Programación I',
      color: 'blue',
      progress: 65,
      completedTasks: 8,
      totalTasks: 12,
      studyHours: 35
    },
    {
      id: 2,
      name: 'Matemáticas I',
      color: 'green',
      progress: 45,
      completedTasks: 5,
      totalTasks: 10,
      studyHours: 28
    },
    {
      id: 3,
      name: 'Física I',
      color: 'purple',
      progress: 30,
      completedTasks: 3,
      totalTasks: 8,
      studyHours: 22
    }
  ]

  // Objetivos de ejemplo
  goals.value = [
    {
      id: 1,
      title: 'Completar todas las prácticas de Programación',
      description: 'Entregar las 12 prácticas del cuatrimestre',
      dueDate: '2025-12-15',
      status: 'in_progress',
      progress: 67,
      createdAt: '2025-08-01'
    },
    {
      id: 2,
      title: 'Estudiar 100 horas este cuatrimestre',
      description: 'Meta de tiempo de estudio para el cuatrimestre',
      dueDate: '2025-12-20',
      status: 'in_progress',
      progress: 85,
      createdAt: '2025-08-01'
    }
  ]
})

// Meta tags
useSeoMeta({
  title: 'Progreso - Repasa+',
  description: 'Seguimiento detallado de tu rendimiento académico'
})
</script>

<style scoped>
.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: white;
  background-color: rgb(37 99 235);
  transition: all 200ms;
}

.btn-primary:hover {
  background-color: rgb(29 78 216);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid rgb(209 213 219);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: rgb(55 65 81);
  background-color: white;
  transition: all 200ms;
}

.btn-secondary:hover {
  background-color: rgb(249 250 251);
}

.dark .btn-secondary {
  border-color: rgb(75 85 99);
  color: rgb(209 213 219);
  background-color: rgb(31 41 55);
}

.dark .btn-secondary:hover {
  background-color: rgb(55 65 81);
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: white;
  color: rgb(17 24 39);
  transition: all 200ms;
}

.input-field:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246);
  border-color: rgb(59 130 246);
}

.dark .input-field {
  border-color: rgb(75 85 99);
  background-color: rgb(31 41 55);
  color: white;
}
</style>
