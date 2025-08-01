<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📚 Mis Asignaturas</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Gestiona el contenido de tus asignaturas</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="showAddSubjectModal = true" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nueva Asignatura
        </button>
      </div>
    </div>

    <!-- Subjects Grid -->
    <div v-if="subjects.length === 0" class="text-center py-12">
      <BookOpenIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay asignaturas</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">Comienza agregando las materias de tu cuatrimestre</p>
      <button @click="showAddSubjectModal = true" class="btn-primary">
        Agregar mi primera asignatura
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="subject in subjects" 
        :key="subject.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Subject Header -->
        <div :class="[
          'p-4 text-white',
          getSubjectColor(subject.color)
        ]">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold truncate">{{ subject.name }}</h3>
            <div class="flex items-center space-x-2">
              <button @click="editSubject(subject)" class="p-1 hover:bg-white/20 rounded">
                <PencilIcon class="h-4 w-4" />
              </button>
              <button @click="deleteSubject(subject.id)" class="p-1 hover:bg-white/20 rounded">
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <p class="text-sm opacity-90 mt-1">{{ subject.code }}</p>
        </div>

        <!-- Subject Content -->
        <div class="p-4">
          <div class="space-y-3">
            <!-- Progress -->
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 dark:text-gray-400">Progreso</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ subject.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  :class="['h-2 rounded-full transition-all duration-300', getSubjectColor(subject.color)]"
                  :style="{ width: `${subject.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ subject.assignments?.length || 0 }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Entregas</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ subject.studyHours || 0 }}</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Horas</p>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex space-x-2">
              <button @click="viewSubjectDetails(subject.id)" class="btn-secondary flex-1 text-center text-sm">
                Ver Detalles
              </button>
              <button @click="addQuickNote(subject.id)" class="btn-secondary p-2">
                <DocumentTextIcon class="h-4 w-4" />
              </button>
            </div>

            <!-- Next Assignment -->
            <div v-if="subject.nextAssignment" class="border-t pt-3">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Próxima entrega</p>
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ subject.nextAssignment.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {{ formatDate(subject.nextAssignment.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div v-if="subjects.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <BookOpenIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ subjects.length }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Asignaturas</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ClockIcon class="h-8 w-8 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalStudyHours }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Horas totales</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DocumentTextIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalAssignments }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Entregas totales</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-emerald-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ averageProgress }}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Progreso medio</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Subject Modal -->
    <Modal v-model="showAddSubjectModal" :title="editingSubject ? 'Editar Asignatura' : 'Nueva Asignatura'">
      <form @submit.prevent="saveSubject" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de la asignatura
          </label>
          <input 
            v-model="subjectForm.name"
            type="text" 
            required
            class="input-field"
            placeholder="Ej: Programación I"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Código
          </label>
          <input 
            v-model="subjectForm.code"
            type="text" 
            class="input-field"
            placeholder="Ej: PROG001"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profesor
          </label>
          <input 
            v-model="subjectForm.professor"
            type="text" 
            class="input-field"
            placeholder="Nombre del profesor"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Créditos
          </label>
          <input 
            v-model.number="subjectForm.credits"
            type="number" 
            min="1"
            max="12"
            class="input-field"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <div class="grid grid-cols-6 gap-2">
            <button 
              v-for="color in colorOptions" 
              :key="color"
              type="button"
              @click="subjectForm.color = color"
              :class="[
                'w-8 h-8 rounded-full border-2 transition-all',
                subjectForm.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-gray-300',
                getSubjectColor(color)
              ]"
            ></button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea 
            v-model="subjectForm.description"
            rows="3"
            class="input-field"
            placeholder="Descripción de la asignatura..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="cancelEdit" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            {{ editingSubject ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  PlusIcon, 
  BookOpenIcon, 
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import Modal from '~/components/Modal.vue'

// Estado reactivo
const subjects = ref([])
const showAddSubjectModal = ref(false)
const editingSubject = ref(null)

// Opciones de colores
const colorOptions = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 'gray']

// Formulario de asignatura
const subjectForm = ref({
  name: '',
  code: '',
  professor: '',
  credits: 6,
  color: 'blue',
  description: '',
  progress: 0
})

// Computed properties
const totalStudyHours = computed(() => {
  return subjects.value.reduce((total, subject) => total + (subject.studyHours || 0), 0)
})

const totalAssignments = computed(() => {
  return subjects.value.reduce((total, subject) => total + (subject.assignments?.length || 0), 0)
})

const averageProgress = computed(() => {
  if (subjects.value.length === 0) return 0
  const total = subjects.value.reduce((sum, subject) => sum + subject.progress, 0)
  return Math.round(total / subjects.value.length)
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

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const viewSubjectDetails = (subjectId) => {
  console.log('🚀 Navegando a detalles de asignatura:', subjectId)
  console.log('📍 URL objetivo:', `/asignaturas/${subjectId}`)
  
  // Usar window.location directamente para forzar la navegación
  window.location.href = `/asignaturas/${subjectId}`
}

const editSubject = (subject) => {
  editingSubject.value = subject
  subjectForm.value = { ...subject }
  showAddSubjectModal.value = true
}

const deleteSubject = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta asignatura?')) {
    subjects.value = subjects.value.filter(s => s.id !== id)
  }
}

const addQuickNote = (subjectId) => {
  // TODO: Implementar funcionalidad de notas rápidas
  console.log('Agregar nota rápida para:', subjectId)
}

const saveSubject = () => {
  if (editingSubject.value) {
    // Actualizar asignatura existente
    const index = subjects.value.findIndex(s => s.id === editingSubject.value.id)
    if (index !== -1) {
      subjects.value[index] = { ...subjectForm.value, id: editingSubject.value.id }
    }
  } else {
    // Crear nueva asignatura
    const newSubject = {
      id: Date.now(),
      ...subjectForm.value,
      assignments: [],
      studyHours: 0,
      notes: []
    }
    subjects.value.push(newSubject)
  }
  
  cancelEdit()
}

const cancelEdit = () => {
  editingSubject.value = null
  subjectForm.value = {
    name: '',
    code: '',
    professor: '',
    credits: 6,
    color: 'blue',
    description: '',
    progress: 0
  }
  showAddSubjectModal.value = false
}

// Cargar datos iniciales
onMounted(() => {
  // Datos de ejemplo
  subjects.value = [
    {
      id: 1,
      name: 'Programación I',
      code: 'PROG001',
      professor: 'Dr. García',
      credits: 6,
      color: 'blue',
      description: 'Introducción a la programación con Python',
      progress: 35,
      assignments: [
        { id: 1, title: 'Práctica 1', date: '2025-08-15' }
      ],
      studyHours: 25,
      nextAssignment: { title: 'Práctica 1', date: '2025-08-15' }
    },
    {
      id: 2,
      name: 'Matemáticas I',
      code: 'MATH001',
      professor: 'Dra. López',
      credits: 6,
      color: 'green',
      description: 'Cálculo diferencial e integral',
      progress: 20,
      assignments: [
        { id: 1, title: 'Examen Parcial', date: '2025-08-20' }
      ],
      studyHours: 30,
      nextAssignment: { title: 'Examen Parcial', date: '2025-08-20' }
    },
    {
      id: 3,
      name: 'Física I',
      code: 'PHYS001',
      professor: 'Dr. Martínez',
      credits: 6,
      color: 'purple',
      description: 'Mecánica clásica y ondas',
      progress: 15,
      assignments: [],
      studyHours: 18
    }
  ]
})

// Meta tags
useSeoMeta({
  title: 'Asignaturas - Repasa+',
  description: 'Gestiona el contenido de tus materias universitarias'
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
  text-decoration: none;
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
