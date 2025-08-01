<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Subject not found -->
    <div v-else-if="!subject" class="text-center py-12">
      <BookOpenIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Asignatura no encontrada
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        La asignatura que buscas no existe
      </p>
      <NuxtLink to="/asignaturas" class="btn-primary">
        Volver a Asignaturas
      </NuxtLink>
    </div>

    <!-- Subject details -->
    <div v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-3">
            <NuxtLink
              to="/asignaturas"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </NuxtLink>
            <div :class="['w-4 h-4 rounded-full', getSubjectColor(subject.color)]"></div>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ subject.code }}</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {{ subject.name }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ subject.description }}
          </p>
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center">
              <UserIcon class="h-4 w-4 mr-1" />
              {{ subject.professor }}
            </div>
            <div class="flex items-center">
              <StarIcon class="h-4 w-4 mr-1" />
              {{ subject.credits }} créditos
            </div>
          </div>
        </div>

        <div class="mt-6 sm:mt-0 flex space-x-3">
          <button @click="showAddContentModal = true" class="btn-secondary">
            <PlusIcon class="h-4 w-4 mr-2" />
            Agregar Contenido
          </button>
          <button @click="editSubject" class="btn-primary">
            <PencilIcon class="h-4 w-4 mr-2" />
            Editar
          </button>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Progreso General
          </h3>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ subject.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            :class="['h-3 rounded-full transition-all duration-500', getSubjectColor(subject.color)]"
            :style="{ width: `${subject.progress}%` }"
          ></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ subject.assignments?.length || 0 }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Entregas</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ subject.studyHours || 0 }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Horas de Estudio</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ subject.notes?.length || 0 }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Notas</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ completedAssignments }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
          </div>
        </div>
      </div>

      <!-- Content Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 inline mr-2" />
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Assignments Tab -->
          <div v-if="activeTab === 'assignments'">
            <div v-if="!subject.assignments || subject.assignments.length === 0" class="text-center py-8">
              <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">No hay entregas registradas</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="assignment in subject.assignments"
                :key="assignment._id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ assignment.title }}
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {{ assignment.description }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Fecha: {{ formatDate(assignment.dueDate) }}</span>
                      <span v-if="assignment.status" :class="getStatusColor(assignment.status)">
                        {{ getStatusLabel(assignment.status) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button @click="editAssignment(assignment)" class="btn-secondary text-xs">
                      Editar
                    </button>
                    <button @click="deleteAssignment(assignment._id)" class="btn-danger text-xs">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes Tab -->
          <div v-else-if="activeTab === 'notes'">
            <!-- Header con buscador y controles -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div class="relative flex-1 max-w-md">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  v-model="searchNotes"
                  type="text"
                  placeholder="Buscar en notas..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div class="flex items-center gap-3">
                <select
                  v-model="notesPerPage"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">5 por página</option>
                  <option value="10">10 por página</option>
                  <option value="15">15 por página</option>
                  <option value="20">20 por página</option>
                </select>
                <button @click="showAddNote" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <PlusIcon class="h-4 w-4" />
                  Nueva Nota
                </button>
              </div>
            </div>

            <!-- Formulario de agregar/editar nota -->
            <div v-if="showAddNoteForm || editingNote" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {{ editingNote ? 'Editar Nota' : 'Nueva Nota' }}
              </h3>
              <form @submit.prevent="saveNote" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título
                  </label>
                  <input
                    v-model="noteForm.title"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Título de la nota"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contenido
                  </label>
                  <textarea
                    v-model="noteForm.content"
                    rows="6"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Contenido de la nota"
                  ></textarea>
                </div>
                <div class="flex justify-end gap-3">
                  <button
                    type="button"
                    @click="cancelAddNote"
                    class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {{ editingNote ? 'Actualizar' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Lista de notas -->
            <div v-if="loadingNotes" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div v-else-if="filteredNotes.length === 0" class="text-center py-8">
              <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">
                {{ searchNotes ? 'No se encontraron notas que coincidan con tu búsqueda' : 'No hay notas guardadas' }}
              </p>
              <button
                v-if="!searchNotes"
                @click="showAddNote"
                class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Crear primera nota
              </button>
            </div>

            <div v-else class="space-y-4">
              <!-- Información de resultados -->
              <div v-if="searchNotes" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Mostrando {{ filteredNotes.length }} resultado(s) para "{{ searchNotes }}"
              </div>

              <!-- Notas paginadas -->
              <div
                v-for="note in paginatedNotes"
                :key="note._id"
                class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-2" v-html="highlightSearchTerm(note.titulo, searchNotes)">
                    </h4>
                    <div class="text-gray-600 dark:text-gray-300 mb-3">
                      <div class="line-clamp-3" v-html="highlightSearchTerm(getPreviewText(note.contenido), searchNotes)">
                      </div>
                      <NuxtLink
                        :to="`/notas/${note._id}`"
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mt-2 inline-block"
                      >
                        Ver nota completa →
                      </NuxtLink>
                    </div>
                    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{{ formatDate(note.fechaCreacion) }}</span>
                      <span v-if="note.etiquetas && note.etiquetas.length > 0">
                        {{ note.etiquetas.join(', ') }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 ml-4">
                    <NuxtLink
                      :to="`/notas/${note._id}`"
                      class="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                      title="Ver nota"
                    >
                      <EyeIcon class="h-4 w-4" />
                    </NuxtLink>
                    <button
                      @click="editNote(note)"
                      class="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                      title="Editar nota"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteNote(note._id)"
                      class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      title="Eliminar nota"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Paginación -->
              <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredNotes.length) }} de {{ filteredNotes.length }} notas
                </div>
                
                <div class="flex items-center gap-2">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    :class="[
                      'p-2 rounded-lg transition-colors',
                      currentPage === 1
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    ]"
                  >
                    <ChevronLeftIcon class="h-5 w-5" />
                  </button>
                  
                  <div class="flex gap-1">
                    <button
                      v-for="page in getPageNumbers()"
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-2 text-sm rounded-lg transition-colors',
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                      ]"
                    >
                      {{ page }}
                    </button>
                  </div>
                  
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    :class="[
                      'p-2 rounded-lg transition-colors',
                      currentPage === totalPages
                        ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    ]"
                  >
                    <ChevronRightIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  UserIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/vue/24/outline";

// Get route params
const route = useRoute();
const subjectId = route.params.id;

// Convex setup
const { convex, getCurrentUserId } = useConvexData()

console.log('=== DEBUG ASIGNATURA DETALLE ===');
console.log('ID de asignatura:', subjectId);

// Estado reactivo
const loading = ref(true);
const subject = ref(null);
const activeTab = ref("assignments");
const showAddContentModal = ref(false);

// Estado para notas
const notes = ref([])
const loadingNotes = ref(false)
const showAddNoteForm = ref(false)
const editingNote = ref(null)
const searchNotes = ref('')
const currentPage = ref(1)
const notesPerPage = ref(5)

// Tabs configuration
const tabs = [
  { key: "assignments", label: "Entregas", icon: DocumentTextIcon },
  { key: "notes", label: "Notas", icon: DocumentTextIcon },
];

// Formulario de notas
const noteForm = ref({
  titulo: '',
  contenido: '',
  etiquetas: []
})

// Computed properties para notas
const filteredNotes = computed(() => {
  if (!searchNotes.value.trim()) {
    return notes.value
  }
  
  const searchTerms = searchNotes.value.toLowerCase().trim().split(/\s+/)
  
  return notes.value.filter(note => {
    const noteText = (note.titulo + ' ' + note.contenido).toLowerCase()
    
    // Buscar que todas las palabras estén presentes
    return searchTerms.every(term => noteText.includes(term))
  }).sort((a, b) => {
    // Ordenar por relevancia: notas con términos en el título primero
    const aTitle = a.titulo.toLowerCase()
    const bTitle = b.titulo.toLowerCase()
    const searchTerm = searchNotes.value.toLowerCase()
    
    const aTitleMatch = aTitle.includes(searchTerm)
    const bTitleMatch = bTitle.includes(searchTerm)
    
    if (aTitleMatch && !bTitleMatch) return -1
    if (!aTitleMatch && bTitleMatch) return 1
    
    return 0 // Mantener orden original si ambos tienen igual relevancia
  })
})

// Computed properties para paginación
const totalPages = computed(() => {
  return Math.ceil(filteredNotes.value.length / notesPerPage.value)
})

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * notesPerPage.value
  const end = start + notesPerPage.value
  return filteredNotes.value.slice(start, end)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * notesPerPage.value + 1
})

const endIndex = computed(() => {
  const end = currentPage.value * notesPerPage.value
  return Math.min(end, filteredNotes.value.length)
})

// Computed properties
const completedAssignments = computed(() => {
  if (!subject.value?.assignments) return 0;
  return subject.value.assignments.filter((a) => a.status === "completed").length;
});

// Métodos
const getSubjectColor = (color) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    gray: "bg-gray-500",
  };
  return colors[color] || colors.blue;
};

const getStatusColor = (status) => {
  const colors = {
    pending: "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full",
    completed: "text-green-600 bg-green-100 px-2 py-1 rounded-full",
    overdue: "text-red-600 bg-red-100 px-2 py-1 rounded-full",
  };
  return colors[status] || colors.pending;
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pendiente",
    completed: "Completado",
    overdue: "Vencido",
  };
  return labels[status] || "Pendiente";
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES");
};

const editSubject = () => {
  console.log("Editar asignatura:", subjectId);
};

const editAssignment = (assignment) => {
  console.log("Editar entrega:", assignment);
};

const deleteAssignment = async (assignmentId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta entrega?")) {
    try {
      await convex.mutation('entregas:eliminarEntrega', {
        entregaId: assignmentId,
        usuarioId: DEFAULT_USER_ID
      });
      
      // Actualizar la lista local
      subject.value.assignments = subject.value.assignments.filter(
        (a) => a._id !== assignmentId
      );
    } catch (error) {
      console.error('Error eliminando entrega:', error);
    }
  }
};

const editNote = (note) => {
  editingNote.value = note
  noteForm.value = {
    titulo: note.titulo,
    contenido: note.contenido,
    etiquetas: note.etiquetas || []
  }
  showAddNoteForm.value = true
};

const deleteNote = async (noteId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
    try {
      await convex.mutation('notes:eliminarNota', {
        notaId: noteId,
        usuarioId: DEFAULT_USER_ID
      });
      
      console.log('✅ Nota eliminada correctamente')
      await loadNotes()
    } catch (error) {
      console.error('❌ Error eliminando nota:', error);
      alert('Error al eliminar la nota')
    }
  }
};

// Funciones para gestión de notas
const loadNotes = async () => {
  try {
    loadingNotes.value = true
    const notasData = await convex.query('notes:getNotasByAsignatura', {
      asignaturaId: subjectId,
      usuarioId: DEFAULT_USER_ID
    })
    notes.value = notasData
    console.log('📝 Notas cargadas:', notasData)
  } catch (error) {
    console.error('❌ Error cargando notas:', error)
  } finally {
    loadingNotes.value = false
  }
}

const showAddNote = () => {
  editingNote.value = null
  noteForm.value = { titulo: '', contenido: '', etiquetas: [] }
  showAddNoteForm.value = true
}

const saveNote = async () => {
  try {
    if (!noteForm.value.titulo.trim() || !noteForm.value.contenido.trim()) {
      alert('Por favor completa el título y contenido de la nota')
      return
    }

    if (editingNote.value) {
      // Actualizar nota existente
      await convex.mutation('notes:actualizarNota', {
        notaId: editingNote.value._id,
        usuarioId: getCurrentUserId(),
        titulo: noteForm.value.titulo,
        contenido: noteForm.value.contenido,
        etiquetas: noteForm.value.etiquetas
      })
      console.log('✅ Nota actualizada correctamente')
    } else {
      // Crear nueva nota
      await convex.mutation('notes:crearNota', {
        usuarioId: getCurrentUserId(),
        asignaturaId: subjectId,
        titulo: noteForm.value.titulo,
        contenido: noteForm.value.contenido,
        etiquetas: noteForm.value.etiquetas
      })
      console.log('✅ Nota creada correctamente')
    }

    // Recargar notas y cerrar formulario
    await loadNotes()
    showAddNoteForm.value = false
    noteForm.value = { titulo: '', contenido: '', etiquetas: [] }
    editingNote.value = null
  } catch (error) {
    console.error('❌ Error guardando nota:', error)
    alert('Error al guardar la nota')
  }
}

const cancelAddNote = () => {
  showAddNoteForm.value = false
  noteForm.value = { titulo: '', contenido: '', etiquetas: [] }
  editingNote.value = null
}

// Funciones de paginación
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Generar números de página para mostrar
const getPageNumbers = () => {
  const pages = []
  const maxVisible = 5 // Máximo número de páginas visibles
  
  if (totalPages.value <= maxVisible) {
    // Si hay pocas páginas, mostrar todas
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para páginas con puntos suspensivos
    const start = Math.max(1, currentPage.value - 2)
    const end = Math.min(totalPages.value, currentPage.value + 2)
    
    // Siempre mostrar la primera página
    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }
    
    // Páginas alrededor de la actual
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Siempre mostrar la última página
    if (end < totalPages.value) {
      if (end < totalPages.value - 1) {
        pages.push('...')
      }
      pages.push(totalPages.value)
    }
  }
  
  return pages
}

// Funciones auxiliares
const getPreviewText = (text) => {
  if (text.length <= 150) return text
  return text.substring(0, 150)
}

const highlightSearchTerm = (text) => {
  if (!searchNotes.value.trim()) {
    return text
  }
  
  const searchTerms = searchNotes.value.trim().split(/\s+/)
  let highlightedText = text
  
  // Resaltar cada término de búsqueda
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
  })
  
  return highlightedText
}

// Load subject data from Convex
onMounted(async () => {
  console.log('Cargando asignatura con ID:', subjectId);
  
  try {
    loading.value = true;
    
    // Obtener asignatura específica
    const asignatura = await convex.query('asignaturas:getAsignatura', {
      asignaturaId: route.params.id,
      usuarioId: DEFAULT_USER_ID
    });
    
    if (!asignatura) {
      console.error('Asignatura no encontrada con ID:', route.params.id);
      subject.value = null;
      loading.value = false;
      return;
    }
    
    // Obtener entregas de la asignatura
    const entregas = await convex.query('entregas:getEntregasByAsignatura', {
      asignaturaId: route.params.id,
      usuarioId: DEFAULT_USER_ID
    });
    
    // Cargar notas por separado
    await loadNotes()
    
    // Mapear datos para compatibilidad con el frontend
    subject.value = {
      _id: asignatura._id,
      id: asignatura._id,
      name: asignatura.nombre,
      code: asignatura.codigo,
      professor: asignatura.profesor,
      credits: asignatura.creditos,
      color: asignatura.color,
      description: asignatura.descripcion,
      progress: asignatura.progreso,
      studyHours: asignatura.horasEstudio || 0,
      assignments: entregas.map(entrega => ({
        _id: entrega._id,
        id: entrega._id,
        title: entrega.titulo,
        description: entrega.descripcion,
        dueDate: entrega.fechaEntrega,
        type: entrega.tipo,
        priority: entrega.prioridad,
        status: entrega.estado,
        score: entrega.puntuacion
      })),
    };
    
    console.log('Asignatura cargada:', subject.value);
    
  } catch (error) {
    console.error('Error cargando asignatura:', error);
    subject.value = null;
  } finally {
    loading.value = false;
  }
});

// Watcher para reiniciar paginación cuando cambia la búsqueda
watch(searchNotes, () => {
  currentPage.value = 1;
});

// Meta tags
useSeoMeta({
  title: () => subject.value ? `${subject.value.name} - Repasa+` : "Cargando...",
  description: () => subject.value ? subject.value.description : "Cargando información de la asignatura",
});
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
  text-decoration: none;
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
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: rgb(220 38 38);
  transition: all 200ms;
}

.btn-danger:hover {
  background-color: rgb(185 28 28);
}

/* Estilos para resaltado de búsqueda */
.highlight {
  background-color: yellow;
  font-weight: bold;
}

.dark .highlight {
  background-color: rgb(253 224 71);
  color: rgb(0 0 0);
}

/* Utilidad para truncar texto */
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
