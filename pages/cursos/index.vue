<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Mis Cursos
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          Organiza tus asignaturas por cursos académicos
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2"
      >
        <PlusIcon class="h-5 w-5" />
        Nuevo Curso
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="cursos.length === 0" class="text-center py-12">
      <BookOpenIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No tienes cursos registrados
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Crea tu primer curso para organizar tus asignaturas
      </p>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors gap-2"
      >
        <PlusIcon class="h-5 w-5" />
        Crear Primer Curso
      </button>
    </div>

    <!-- Cursos Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="curso in cursos"
        :key="curso._id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer"
        @click="navigateToCurso(curso._id)"
      >
        <!-- Header del curso -->
        <div :class="['p-6 border-b border-gray-200 dark:border-gray-700', getCursoColorClass(curso.color)]">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-2">
                {{ curso.nombre }}
              </h3>
              <p class="text-white/80 text-sm line-clamp-2">
                {{ curso.descripcion || 'Sin descripción' }}
              </p>
            </div>
            <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click.stop="editCurso(curso)"
                class="p-2 text-white/80 hover:text-white transition-colors"
                title="Editar curso"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click.stop="deleteCurso(curso._id)"
                class="p-2 text-white/80 hover:text-white transition-colors"
                title="Eliminar curso"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Contenido del curso -->
        <div class="p-6">
          <!-- Progreso -->
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progreso General
              </span>
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ curso.progreso }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                :class="['h-2 rounded-full transition-all duration-500', getCursoColorClass(curso.color)]"
                :style="{ width: `${curso.progreso}%` }"
              ></div>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ curso.numeroAsignaturas }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Asignaturas
              </p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ getEstadoLabel(curso.estado) }}
              </p>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Estado
              </p>
            </div>
          </div>

          <!-- Fechas -->
          <div class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div class="flex justify-between">
              <span>Inicio:</span>
              <span>{{ formatDate(curso.fechaInicio) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Fin:</span>
              <span>{{ formatDate(curso.fechaFin) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Creado {{ formatDate(curso.fechaCreacion) }}
            </span>
            <ArrowRightIcon class="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar Curso -->
    <div
      v-if="showCreateModal || editingCurso"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ editingCurso ? 'Editar Curso' : 'Nuevo Curso' }}
          </h3>
          
          <form @submit.prevent="saveCurso" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Curso *
              </label>
              <input
                v-model="cursoForm.nombre"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="ej. Ingeniería de Software 2024-2025"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                v-model="cursoForm.descripcion"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="Descripción opcional del curso"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha Inicio *
                </label>
                <input
                  v-model="cursoForm.fechaInicio"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha Fin *
                </label>
                <input
                  v-model="cursoForm.fechaFin"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <select
                  v-model="cursoForm.color"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="blue">Azul</option>
                  <option value="green">Verde</option>
                  <option value="purple">Morado</option>
                  <option value="red">Rojo</option>
                  <option value="yellow">Amarillo</option>
                  <option value="indigo">Índigo</option>
                  <option value="pink">Rosa</option>
                  <option value="gray">Gris</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  v-model="cursoForm.estado"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="activo">Activo</option>
                  <option value="completado">Completado</option>
                  <option value="pausado">Pausado</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {{ editingCurso ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Convex setup
const { convex, getCurrentUserId } = useConvexData()

// Estado reactivo
const loading = ref(true)
const cursos = ref([])
const showCreateModal = ref(false)
const editingCurso = ref(null)

// Formulario de curso
const cursoForm = ref({
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  color: 'blue',
  estado: 'activo'
})

// Cargar cursos
const loadCursos = async () => {
  try {
    loading.value = true
    const data = await convex.query("cursos:getCursos", {
      usuarioId: DEFAULT_USER_ID
    })
    cursos.value = data || []
  } catch (error) {
    console.error('Error cargando cursos:', error)
    cursos.value = []
  } finally {
    loading.value = false
  }
}

// Guardar curso
const saveCurso = async () => {
  try {
    if (editingCurso.value) {
      await convex.mutation("cursos:updateCurso", {
        id: editingCurso.value._id,
        usuarioId: getCurrentUserId(),
        ...cursoForm.value
      })
    } else {
      await convex.mutation("cursos:createCurso", {
        usuarioId: getCurrentUserId(),
        ...cursoForm.value
      })
    }
    
    closeModal()
    await loadCursos()
  } catch (error) {
    console.error('Error guardando curso:', error)
  }
}

// Editar curso
const editCurso = (curso) => {
  editingCurso.value = curso
  cursoForm.value = {
    nombre: curso.nombre,
    descripcion: curso.descripcion || '',
    fechaInicio: curso.fechaInicio,
    fechaFin: curso.fechaFin,
    color: curso.color,
    estado: curso.estado
  }
}

// Eliminar curso
const deleteCurso = async (cursoId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este curso? También se eliminarán todas sus asignaturas.')) {
    return
  }
  
  try {
    await convex.mutation("cursos:deleteCurso", {
      id: cursoId,
      usuarioId: DEFAULT_USER_ID
    })
    await loadCursos()
  } catch (error) {
    console.error('Error eliminando curso:', error)
  }
}

// Cerrar modal
const closeModal = () => {
  showCreateModal.value = false
  editingCurso.value = null
  cursoForm.value = {
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    color: 'blue',
    estado: 'activo'
  }
}

// Navegar a curso
const navigateToCurso = (cursoId) => {
  navigateTo(`/cursos/${cursoId}`)
}

// Utilidades
const getCursoColorClass = (color) => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    indigo: 'bg-indigo-600',
    pink: 'bg-pink-600',
    gray: 'bg-gray-600'
  }
  return colors[color] || colors.blue
}

const getEstadoLabel = (estado) => {
  const labels = {
    activo: '🟢',
    completado: '✅',
    pausado: '⏸️'
  }
  return labels[estado] || '🟢'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Cargar datos al montar
onMounted(() => {
  loadCursos()
})

// Meta tags
useSeoMeta({
  title: 'Mis Cursos - Repasa+',
  description: 'Organiza tus asignaturas por cursos académicos'
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
