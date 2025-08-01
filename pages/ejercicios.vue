<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">✏️ Ejercicios de Repaso</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Practica y refuerza tus conocimientos</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <select v-model="selectedSubject" class="input-field">
          <option value="">Todas las asignaturas</option>
          <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
            {{ subject.name }}
          </option>
        </select>
        <button @click="showAddExerciseModal = true" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nuevo Ejercicio
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
      <button 
        v-for="filter in filterOptions" 
        :key="filter.value"
        @click="activeFilter = filter.value"
        :class="[
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          activeFilter === filter.value 
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <PencilIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalExercises }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total ejercicios</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ completedExercises }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Completados</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClockIcon class="h-8 w-8 text-orange-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ pendingExercises }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ChartBarIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ averageScore }}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Puntuación media</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Exercises List -->
    <div v-if="filteredExercises.length === 0" class="text-center py-12">
      <PencilIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay ejercicios</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        {{ selectedSubject ? 'No hay ejercicios para la asignatura seleccionada' : 'Comienza creando tu primer ejercicio de repaso' }}
      </p>
      <button @click="showAddExerciseModal = true" class="btn-primary">
        Crear ejercicio
      </button>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="exercise in filteredExercises" 
        :key="exercise.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getSubjectColor(exercise.subjectId)
                ]">
                  {{ getSubjectName(exercise.subjectId) }}
                </span>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getDifficultyColor(exercise.difficulty)
                ]">
                  {{ getDifficultyLabel(exercise.difficulty) }}
                </span>
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(exercise.status)
                ]">
                  {{ getStatusLabel(exercise.status) }}
                </span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ exercise.title }}
              </h3>
              
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                {{ exercise.description }}
              </p>

              <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center">
                  <ClockIcon class="h-4 w-4 mr-1" />
                  {{ exercise.estimatedTime }}min
                </div>
                <div v-if="exercise.lastAttempt" class="flex items-center">
                  <CalendarIcon class="h-4 w-4 mr-1" />
                  Último intento: {{ formatDate(exercise.lastAttempt) }}
                </div>
                <div v-if="exercise.score !== null" class="flex items-center">
                  <ChartBarIcon class="h-4 w-4 mr-1" />
                  Puntuación: {{ exercise.score }}%
                </div>
              </div>
            </div>

            <div class="flex flex-col space-y-2 ml-4">
              <button 
                @click="startExercise(exercise)"
                :class="[
                  'btn-primary text-sm',
                  exercise.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''
                ]"
              >
                {{ exercise.status === 'completed' ? 'Repasar' : 'Empezar' }}
              </button>
              <button @click="editExercise(exercise)" class="btn-secondary text-sm">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="deleteExercise(exercise.id)" class="btn-danger text-sm">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Progress bar for multi-part exercises -->
          <div v-if="exercise.totalQuestions > 1" class="mt-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Progreso</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ exercise.completedQuestions }}/{{ exercise.totalQuestions }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(exercise.completedQuestions / exercise.totalQuestions) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Exercise Modal -->
    <Modal v-model="showAddExerciseModal" :title="editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'">
      <form @submit.prevent="saveExercise" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Título
          </label>
          <input 
            v-model="exerciseForm.title"
            type="text" 
            required
            class="input-field"
            placeholder="Ej: Ejercicios de bucles en Python"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Asignatura
          </label>
          <select v-model="exerciseForm.subjectId" required class="input-field">
            <option value="">Selecciona una asignatura</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dificultad
            </label>
            <select v-model="exerciseForm.difficulty" required class="input-field">
              <option value="easy">Fácil</option>
              <option value="medium">Intermedio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tiempo estimado (min)
            </label>
            <input 
              v-model.number="exerciseForm.estimatedTime"
              type="number" 
              min="5"
              max="180"
              required
              class="input-field"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea 
            v-model="exerciseForm.description"
            rows="3"
            required
            class="input-field"
            placeholder="Describe qué se practicará en este ejercicio..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contenido del ejercicio
          </label>
          <textarea 
            v-model="exerciseForm.content"
            rows="8"
            required
            class="input-field"
            placeholder="Escribe las preguntas, problemas o ejercicios a resolver..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Solución (opcional)
          </label>
          <textarea 
            v-model="exerciseForm.solution"
            rows="4"
            class="input-field"
            placeholder="Solución o respuestas correctas..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="cancelEdit" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            {{ editingExercise ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Exercise Viewer Modal -->
    <Modal v-model="showExerciseViewer" title="Ejercicio" size="large">
      <div v-if="currentExercise" class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ currentExercise.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ currentExercise.description }}
          </p>
        </div>

        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Ejercicio:</h4>
          <div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {{ currentExercise.content }}
          </div>
        </div>

        <div v-if="currentExercise.solution && showSolution" class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Solución:</h4>
          <div class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {{ currentExercise.solution }}
          </div>
        </div>

        <div class="flex justify-between">
          <button 
            v-if="currentExercise.solution && !showSolution"
            @click="showSolution = true" 
            class="btn-secondary"
          >
            Ver Solución
          </button>
          <button 
            v-if="currentExercise.solution && showSolution"
            @click="showSolution = false" 
            class="btn-secondary"
          >
            Ocultar Solución
          </button>
          <div class="space-x-3">
            <button @click="completeExercise" class="btn-primary">
              Marcar como Completado
            </button>
            <button @click="showExerciseViewer = false" class="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'
import Modal from '~/components/Modal.vue'

// Estado reactivo
const exercises = ref([])
const subjects = ref([])
const selectedSubject = ref('')
const activeFilter = ref('all')
const showAddExerciseModal = ref(false)
const showExerciseViewer = ref(false)
const editingExercise = ref(null)
const currentExercise = ref(null)
const showSolution = ref(false)

// Opciones de filtro
const filterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completados' },
  { value: 'favorite', label: 'Favoritos' }
]

// Formulario de ejercicio
const exerciseForm = ref({
  title: '',
  subjectId: '',
  difficulty: 'medium',
  estimatedTime: 30,
  description: '',
  content: '',
  solution: ''
})

// Computed properties
const filteredExercises = computed(() => {
  let filtered = exercises.value

  // Filtrar por asignatura
  if (selectedSubject.value) {
    filtered = filtered.filter(ex => ex.subjectId === selectedSubject.value)
  }

  // Filtrar por estado
  switch (activeFilter.value) {
    case 'pending':
      filtered = filtered.filter(ex => ex.status !== 'completed')
      break
    case 'completed':
      filtered = filtered.filter(ex => ex.status === 'completed')
      break
    case 'favorite':
      filtered = filtered.filter(ex => ex.favorite)
      break
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalExercises = computed(() => exercises.value.length)
const completedExercises = computed(() => exercises.value.filter(ex => ex.status === 'completed').length)
const pendingExercises = computed(() => exercises.value.filter(ex => ex.status !== 'completed').length)
const averageScore = computed(() => {
  const scoresExercises = exercises.value.filter(ex => ex.score !== null)
  if (scoresExercises.length === 0) return 0
  const total = scoresExercises.reduce((sum, ex) => sum + ex.score, 0)
  return Math.round(total / scoresExercises.length)
})

// Métodos
const getSubjectName = (subjectId) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject ? subject.name : 'Sin asignatura'
}

const getSubjectColor = (subjectId) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  }
  return colorMap[subject?.color] || colorMap.blue
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return colors[difficulty] || colors.medium
}

const getDifficultyLabel = (difficulty) => {
  const labels = {
    easy: 'Fácil',
    medium: 'Intermedio',
    hard: 'Difícil'
  }
  return labels[difficulty] || 'Intermedio'
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }
  return colors[status] || colors.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completado'
  }
  return labels[status] || 'Pendiente'
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES')
}

const startExercise = (exercise) => {
  currentExercise.value = exercise
  showSolution.value = false
  showExerciseViewer.value = true
  
  // Marcar como en progreso si está pendiente
  if (exercise.status === 'pending') {
    exercise.status = 'in_progress'
    exercise.startedAt = new Date().toISOString()
  }
}

const completeExercise = () => {
  if (currentExercise.value) {
    currentExercise.value.status = 'completed'
    currentExercise.value.completedAt = new Date().toISOString()
    currentExercise.value.lastAttempt = new Date().toISOString()
    
    // Aquí podrías agregar lógica para calcular puntuación
    if (!currentExercise.value.score) {
      currentExercise.value.score = Math.floor(Math.random() * 40) + 60 // Score aleatorio entre 60-100
    }
  }
  showExerciseViewer.value = false
}

const editExercise = (exercise) => {
  editingExercise.value = exercise
  exerciseForm.value = { ...exercise }
  showAddExerciseModal.value = true
}

const deleteExercise = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
    exercises.value = exercises.value.filter(ex => ex.id !== id)
  }
}

const saveExercise = () => {
  if (editingExercise.value) {
    // Actualizar ejercicio existente
    const index = exercises.value.findIndex(ex => ex.id === editingExercise.value.id)
    if (index !== -1) {
      exercises.value[index] = { 
        ...exerciseForm.value, 
        id: editingExercise.value.id,
        updatedAt: new Date().toISOString()
      }
    }
  } else {
    // Crear nuevo ejercicio
    const newExercise = {
      id: Date.now(),
      ...exerciseForm.value,
      status: 'pending',
      score: null,
      totalQuestions: 1,
      completedQuestions: 0,
      createdAt: new Date().toISOString(),
      favorite: false
    }
    exercises.value.push(newExercise)
  }
  
  cancelEdit()
}

const cancelEdit = () => {
  editingExercise.value = null
  exerciseForm.value = {
    title: '',
    subjectId: '',
    difficulty: 'medium',
    estimatedTime: 30,
    description: '',
    content: '',
    solution: ''
  }
  showAddExerciseModal.value = false
}

// Cargar datos iniciales
onMounted(() => {
  // Datos de ejemplo para asignaturas
  subjects.value = [
    { id: 1, name: 'Programación I', color: 'blue' },
    { id: 2, name: 'Matemáticas I', color: 'green' },
    { id: 3, name: 'Física I', color: 'purple' },
    { id: 4, name: 'Álgebra Linear', color: 'red' }
  ]
  
  // Ejercicios de ejemplo
  exercises.value = [
    {
      id: 1,
      title: 'Ejercicios de Bucles',
      subjectId: 1,
      difficulty: 'medium',
      estimatedTime: 45,
      description: 'Practica el uso de bucles for y while en Python',
      content: '1. Crear un programa que imprima los números del 1 al 100\n2. Calcular la suma de números pares entre 1 y 50\n3. Crear un programa que pida números hasta que se ingrese 0',
      solution: '# Solución 1\nfor i in range(1, 101):\n    print(i)\n\n# Solución 2\nsuma = sum(i for i in range(2, 51, 2))\nprint(suma)',
      status: 'completed',
      score: 85,
      totalQuestions: 3,
      completedQuestions: 3,
      createdAt: '2025-08-01T10:00:00Z',
      lastAttempt: '2025-08-05T14:30:00Z',
      favorite: true
    },
    {
      id: 2,
      title: 'Derivadas Básicas',
      subjectId: 2,
      difficulty: 'easy',
      estimatedTime: 30,
      description: 'Ejercicios fundamentales de derivación',
      content: 'Calcula las derivadas de las siguientes funciones:\n1. f(x) = 3x² + 2x - 1\n2. f(x) = sin(x) + cos(x)\n3. f(x) = e^x * ln(x)',
      solution: '1. f\'(x) = 6x + 2\n2. f\'(x) = cos(x) - sin(x)\n3. f\'(x) = e^x * ln(x) + e^x/x',
      status: 'pending',
      score: null,
      totalQuestions: 3,
      completedQuestions: 0,
      createdAt: '2025-08-02T09:15:00Z',
      favorite: false
    }
  ]
})

// Meta tags
useSeoMeta({
  title: 'Ejercicios - Mi Plan de Estudios',
  description: 'Practica y refuerza tus conocimientos con ejercicios personalizados'
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

.btn-danger {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: rgb(220 38 38);
  transition: all 200ms;
}

.btn-danger:hover {
  background-color: rgb(185 28 28);
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
