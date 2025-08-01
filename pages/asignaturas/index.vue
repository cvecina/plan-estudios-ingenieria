<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          📚 Mis Asignaturas
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Gestiona el contenido de tus asignaturas
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="recalcularTodosProgreso"
          class="btn-secondary"
          :disabled="calculandoProgreso"
        >
          <svg
            v-if="calculandoProgreso"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <CheckCircleIcon v-else class="h-5 w-5 mr-2" />
          {{ calculandoProgreso ? "Calculando..." : "Recalcular Progreso" }}
        </button>
        <button @click="showAddSubjectModal = true" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nueva Asignatura
        </button>
      </div>
    </div>

    <!-- Subjects Grid -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <div v-else-if="subjects.length === 0" class="text-center py-12">
      <BookOpenIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No hay asignaturas
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        Comienza agregando las materias de tu cuatrimestre
      </p>
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
        <div :class="['p-4 text-white', getSubjectColor(subject.color)]">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold truncate">{{ subject.name }}</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="editSubject(subject)"
                class="p-1 hover:bg-white/20 rounded"
              >
                <PencilIcon class="h-4 w-4" />
              </button>
              <button
                @click="deleteSubject(subject._id)"
                class="p-1 hover:bg-white/20 rounded"
              >
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
                <span
                  class="text-gray-600 dark:text-gray-400 flex items-center"
                >
                  Progreso
                  <span
                    class="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full"
                    >AUTO</span
                  >
                </span>
                <span class="font-medium text-gray-900 dark:text-white"
                  >{{ subject.progress }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full transition-all duration-300',
                    getSubjectColor(subject.color),
                  ]"
                  :style="{ width: `${subject.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ subject.assignmentsCount || 0 }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Entregas</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ subject.studyHours || 0 }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Horas</p>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="flex space-x-2">
              <button
                @click="viewSubjectDetails(subject._id)"
                class="btn-secondary flex-1 text-center text-sm"
              >
                Ver Detalles
              </button>
              <button
                @click="addQuickNote(subject._id)"
                class="btn-secondary p-2"
              >
                <DocumentTextIcon class="h-4 w-4" />
              </button>
            </div>

            <!-- Next Assignment - Comentado temporalmente -->
            <!--
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
            -->
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div
      v-if="subjects.length > 0"
      class="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <BookOpenIcon class="h-8 w-8 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ subjects.length }}
            </p>
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
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ totalStudyHours }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Horas totales
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <DocumentTextIcon class="h-8 w-8 text-purple-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ totalAssignments }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Entregas totales
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-emerald-600" />
          </div>
          <div class="ml-4">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ averageProgress }}%
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Progreso medio
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Subject Modal -->
    <Modal
      v-model="showAddSubjectModal"
      :title="editingSubject ? 'Editar Asignatura' : 'Nueva Asignatura'"
    >
      <AsignaturaForm
        v-model="subjectForm"
        :mode="editingSubject ? 'edit' : 'create'"
        :submit-button-text="editingSubject ? 'Actualizar' : 'Guardar'"
        :existing-codes="subjects.map(s => s.code).filter(code => code !== subjectForm.code)"
        @submit="saveSubject"
        @cancel="cancelEdit"
      />
    </Modal>

    <!-- Notes Modal -->
    <Modal
      v-model="showNotesModal"
      :title="`Notas - ${selectedSubjectForNotes?.name || ''}`"
    >
      <div class="space-y-6">
        <!-- Header con botón para agregar nota -->
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Gestiona las notas de esta asignatura
          </p>
          <button @click="showAddNote" class="btn-primary">
            <PlusIcon class="h-4 w-4 mr-2" />
            Nueva Nota
          </button>
        </div>

        <!-- Buscador de notas -->
        <div v-if="notes.length > 0" class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchNotes"
            type="text"
            placeholder="Buscar en las notas..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <!-- Contador de resultados -->
          <div
            v-if="searchNotes.trim()"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ filteredNotes.length }} de {{ notes.length }}
            </span>
          </div>
        </div>

        <!-- Formulario para agregar/editar nota -->
        <div
          v-if="showAddNoteForm"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border"
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ editingNote ? "Editar Nota" : "Nueva Nota" }}
          </h3>

          <form @submit.prevent="saveNote" class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Título
              </label>
              <input
                v-model="noteForm.titulo"
                type="text"
                required
                class="input-field"
                placeholder="Título de la nota"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Contenido
              </label>
              <textarea
                v-model="noteForm.contenido"
                rows="4"
                required
                class="input-field"
                placeholder="Escribe el contenido de tu nota aquí..."
              ></textarea>
            </div>

            <div class="flex space-x-3 pt-2">
              <button type="submit" class="btn-primary">
                {{ editingNote ? "Actualizar" : "Guardar" }}
              </button>
              <button
                type="button"
                @click="cancelAddNote"
                class="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de notas -->
        <div class="space-y-4">
          <div v-if="loadingNotes" class="flex justify-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
          </div>

          <div v-else-if="notes.length === 0" class="text-center py-8">
            <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-2">
              No hay notas aún
            </p>
            <p class="text-sm text-gray-400">
              ¡Crea tu primera nota para esta asignatura!
            </p>
          </div>

          <!-- Sin resultados de búsqueda -->
          <div
            v-else-if="filteredNotes.length === 0 && searchNotes.trim()"
            class="text-center py-8"
          >
            <MagnifyingGlassIcon class="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500 dark:text-gray-400 mb-2">
              No se encontraron notas
            </p>
            <p class="text-sm text-gray-400">
              Intenta con otros términos de búsqueda
            </p>
            <button
              @click="searchNotes = ''"
              class="mt-3 text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
            >
              Limpiar búsqueda
            </button>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="note in paginatedNotes"
              :key="note._id"
              class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-2">
                <h4
                  class="font-medium text-gray-900 dark:text-white"
                  v-html="highlightSearchTerm(note.titulo)"
                ></h4>
                <div class="flex space-x-1 ml-2">
                  <button
                    @click="editNote(note)"
                    class="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    title="Editar nota rápida"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteNote(note._id)"
                    class="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                    title="Eliminar nota"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Preview del contenido con resaltado -->
              <div
                class="text-gray-600 dark:text-gray-300 text-sm mb-3 whitespace-pre-wrap"
              >
                <span
                  v-html="highlightSearchTerm(getPreviewText(note.contenido))"
                ></span>
                <span v-if="note.contenido.length > 150" class="text-gray-400"
                  >...</span
                >
              </div>

              <!-- Botón para ver nota completa -->
              <div v-if="note.contenido.length > 150" class="mb-2">
                <NuxtLink
                  :to="`/notas/${note._id}`"
                  class="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
                >
                  <EyeIcon class="h-4 w-4 mr-1" />
                  Ver nota completa
                </NuxtLink>
              </div>

              <div
                class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400"
              >
                <span>{{ formatDate(note.fechaCreacion) }}</span>
                <span v-if="note.fechaActualizacion !== note.fechaCreacion">
                  Editada: {{ formatDate(note.fechaActualizacion) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Información y controles de paginación -->
          <div
            v-if="filteredNotes.length > notesPerPage"
            class="border-t border-gray-200 dark:border-gray-600 pt-4"
          >
            <!-- Información de paginación -->
            <div class="flex items-center justify-between mb-4">
              <div class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando
                <span class="font-medium">{{ startIndex }}</span>
                a
                <span class="font-medium">{{ endIndex }}</span>
                de
                <span class="font-medium">{{ filteredNotes.length }}</span>
                notas
              </div>

              <!-- Selector de notas por página -->
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-700 dark:text-gray-300">
                  Notas por página:
                </label>
                <select
                  v-model="notesPerPage"
                  @change="currentPage = 1"
                  class="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>

            <!-- Controles de navegación -->
            <div class="flex items-center justify-center space-x-2">
              <!-- Botón anterior -->
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === 1
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <ChevronLeftIcon class="h-4 w-4 mr-1" />
                Anterior
              </button>

              <!-- Números de página -->
              <div class="flex space-x-1">
                <template v-for="page in getPageNumbers()" :key="page">
                  <!-- Puntos suspensivos -->
                  <span
                    v-if="page === '...'"
                    class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    ...
                  </span>
                  <!-- Número de página -->
                  <button
                    v-else
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      page === currentPage
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
              </div>

              <!-- Botón siguiente -->
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  currentPage === totalPages
                    ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                Siguiente
                <ChevronRightIcon class="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="flex justify-end pt-4 border-t">
          <button @click="closeNotesModal" class="btn-secondary">Cerrar</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  PlusIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";
import Modal from "~/components/Modal.vue";
import AsignaturaForm from "~/components/AsignaturaForm.vue";

// Estado reactivo
const subjects = ref([]);
const showAddSubjectModal = ref(false);
const editingSubject = ref(null);
const loading = ref(true);
const calculandoProgreso = ref(false);

// Estado para modal de notas
const showNotesModal = ref(false);
const selectedSubjectForNotes = ref(null);
const notes = ref([]);
const loadingNotes = ref(false);
const showAddNoteForm = ref(false);
const editingNote = ref(null);
const searchNotes = ref("");
const currentPage = ref(1);
const notesPerPage = ref(5);

// Convex setup
const { convex, getCurrentUserId } = useConvexData();

// Formulario de asignatura
const subjectForm = ref({
  name: "",
  code: "",
  professor: "",
  credits: 6,
  color: "blue",
  description: "",
  progress: 0,
  studyHours: 0,
  useAutomaticHours: true,
});

// Formulario de notas
const noteForm = ref({
  titulo: "",
  contenido: "",
  etiquetas: [],
});

// Computed properties
const totalStudyHours = computed(() => {
  return subjects.value.reduce(
    (total, subject) => total + (subject.studyHours || 0),
    0
  );
});

const totalAssignments = computed(() => {
  return subjects.value.reduce(
    (total, subject) => total + (subject.assignmentsCount || 0),
    0
  );
});

const averageProgress = computed(() => {
  if (subjects.value.length === 0) return 0;
  const total = subjects.value.reduce(
    (sum, subject) => sum + subject.progress,
    0
  );
  return Math.round(total / subjects.value.length);
});

// Filtrar notas basado en la búsqueda
const filteredNotes = computed(() => {
  if (!searchNotes.value.trim()) {
    return notes.value;
  }

  const searchTerms = searchNotes.value.toLowerCase().trim().split(/\s+/);

  return notes.value
    .filter((note) => {
      const noteText = (note.titulo + " " + note.contenido).toLowerCase();

      // Buscar que todas las palabras estén presentes
      return searchTerms.every((term) => noteText.includes(term));
    })
    .sort((a, b) => {
      // Ordenar por relevancia: notas con términos en el título primero
      const aTitle = a.titulo.toLowerCase();
      const bTitle = b.titulo.toLowerCase();
      const searchTerm = searchNotes.value.toLowerCase();

      const aTitleMatch = aTitle.includes(searchTerm);
      const bTitleMatch = bTitle.includes(searchTerm);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      return 0; // Mantener orden original si ambos tienen igual relevancia
    });
});

// Computed properties para paginación
const totalPages = computed(() => {
  return Math.ceil(filteredNotes.value.length / notesPerPage.value);
});

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * notesPerPage.value;
  const end = start + notesPerPage.value;
  return filteredNotes.value.slice(start, end);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * notesPerPage.value + 1;
});

const endIndex = computed(() => {
  const end = currentPage.value * notesPerPage.value;
  return Math.min(end, filteredNotes.value.length);
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

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
  });
};

const getPreviewText = (text) => {
  if (text.length <= 150) return text;
  return text.substring(0, 150);
};

const highlightSearchTerm = (text) => {
  if (!searchNotes.value.trim()) {
    return text;
  }

  const searchTerms = searchNotes.value.trim().split(/\s+/);
  let highlightedText = text;

  // Resaltar cada término de búsqueda
  searchTerms.forEach((term) => {
    const regex = new RegExp(
      `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
    );
  });

  return highlightedText;
};

const viewSubjectDetails = (subjectId) => {
  console.log("🚀 Navegando a detalles de asignatura:", subjectId);
  console.log("📍 URL objetivo:", `/asignaturas/${subjectId}`);

  // Usar window.location directamente para forzar la navegación
  window.location.href = `/asignaturas/${subjectId}`;
};

const editSubject = (subject) => {
  editingSubject.value = subject;
  subjectForm.value = {
    name: subject.nombre || subject.name || '',
    code: subject.codigo || subject.code || '',
    professor: subject.profesor || subject.professor || '',
    credits: subject.creditos || subject.credits || 6,
    color: subject.color || 'blue',
    description: subject.descripcion || subject.description || '',
    progress: subject.progreso || subject.progress || 0,
    studyHours: subject.horasEstudio || subject.studyHours || 0,
    useAutomaticHours: true
  };
  showAddSubjectModal.value = true;
};

const deleteSubject = async (subjectId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta asignatura?")) {
    try {
      await convex.mutation("asignaturas:eliminarAsignatura", {
        asignaturaId: subjectId,
        usuarioId: getCurrentUserId(),
      });

      // Recargar datos
      await loadSubjects();
    } catch (error) {
      console.error("Error eliminando asignatura:", error);
    }
  }
};

const addQuickNote = async (subjectId) => {
  selectedSubjectForNotes.value = subjects.value.find(
    (s) => s._id === subjectId
  );
  showNotesModal.value = true;
  await loadNotes(subjectId);
};

// Funciones para gestión de notas
const loadNotes = async (subjectId) => {
  try {
    loadingNotes.value = true;
    const notasData = await convex.query("notes:getNotasByAsignatura", {
      asignaturaId: subjectId,
      usuarioId: getCurrentUserId(),
    });
    notes.value = notasData;
    console.log("📝 Notas cargadas:", notasData);
  } catch (error) {
    console.error("❌ Error cargando notas:", error);
  } finally {
    loadingNotes.value = false;
  }
};

const showAddNote = () => {
  editingNote.value = null;
  noteForm.value = { titulo: "", contenido: "", etiquetas: [] };
  showAddNoteForm.value = true;
};

const editNote = (note) => {
  editingNote.value = note;
  noteForm.value = {
    titulo: note.titulo,
    contenido: note.contenido,
    etiquetas: note.etiquetas || [],
  };
  showAddNoteForm.value = true;
};

const saveNote = async () => {
  try {
    if (!noteForm.value.titulo.trim() || !noteForm.value.contenido.trim()) {
      alert("Por favor completa el título y contenido de la nota");
      return;
    }

    if (editingNote.value) {
      // Actualizar nota existente
      await convex.mutation("notes:actualizarNota", {
        notaId: editingNote.value._id,
        usuarioId: getCurrentUserId(),
        titulo: noteForm.value.titulo,
        contenido: noteForm.value.contenido,
        etiquetas: noteForm.value.etiquetas,
      });
      console.log("✅ Nota actualizada correctamente");
    } else {
      // Crear nueva nota
      await convex.mutation("notes:crearNota", {
        usuarioId: getCurrentUserId(),
        asignaturaId: selectedSubjectForNotes.value._id,
        titulo: noteForm.value.titulo,
        contenido: noteForm.value.contenido,
        etiquetas: noteForm.value.etiquetas,
      });
      console.log("✅ Nota creada correctamente");
    }

    // Recargar notas y cerrar formulario
    await loadNotes(selectedSubjectForNotes.value._id);
    showAddNoteForm.value = false;
    noteForm.value = { titulo: "", contenido: "", etiquetas: [] };
    editingNote.value = null;
  } catch (error) {
    console.error("❌ Error guardando nota:", error);
    alert("Error al guardar la nota");
  }
};

const deleteNote = async (noteId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
    try {
      await convex.mutation("notes:eliminarNota", {
        notaId: noteId,
        usuarioId: getCurrentUserId(),
      });
      console.log("✅ Nota eliminada correctamente");
      await loadNotes(selectedSubjectForNotes.value._id);
    } catch (error) {
      console.error("❌ Error eliminando nota:", error);
      alert("Error al eliminar la nota");
    }
  }
};

const cancelAddNote = () => {
  showAddNoteForm.value = false;
  noteForm.value = { titulo: "", contenido: "", etiquetas: [] };
  editingNote.value = null;
};

const closeNotesModal = () => {
  showNotesModal.value = false;
  selectedSubjectForNotes.value = null;
  notes.value = [];
  showAddNoteForm.value = false;
  editingNote.value = null;
  searchNotes.value = ""; // Limpiar búsqueda
  currentPage.value = 1; // Resetear paginación
};

// Funciones de paginación
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Resetear página cuando cambie la búsqueda
const resetPagination = () => {
  currentPage.value = 1;
};

// Generar números de página para mostrar
const getPageNumbers = () => {
  const pages = [];
  const maxVisible = 5; // Máximo número de páginas visibles

  if (totalPages.value <= maxVisible) {
    // Si hay pocas páginas, mostrar todas
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Lógica para páginas con puntos suspensivos
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, currentPage.value + 2);

    // Siempre mostrar la primera página
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    // Páginas alrededor de la actual
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Siempre mostrar la última página
    if (end < totalPages.value) {
      if (end < totalPages.value - 1) {
        pages.push("...");
      }
      pages.push(totalPages.value);
    }
  }

  return pages;
};

const recalcularTodosProgreso = async () => {
  try {
    calculandoProgreso.value = true;

    console.log("🔄 Recalculando progreso de todas las asignaturas...");

    const resultado = await convex.mutation(
      "asignaturas:calcularProgresoTodasAsignaturas",
      {
        usuarioId: getCurrentUserId(),
      }
    );

    console.log("✅ Progreso recalculado:", resultado);

    // Mostrar mensaje de éxito
    if (resultado.asignaturasActualizadas > 0) {
      // Aquí podrías agregar un toast o notificación
      console.log(
        `✨ Se actualizó el progreso de ${resultado.asignaturasActualizadas} asignaturas`
      );

      // Recargar los datos para mostrar los nuevos progresos
      await loadSubjects();
    } else {
      console.log("ℹ️ No hay asignaturas para actualizar");
    }
  } catch (error) {
    console.error("❌ Error recalculando progreso:", error);
  } finally {
    calculandoProgreso.value = false;
  }
};

const saveSubject = async (formData) => {
  try {
    if (editingSubject.value) {
      // Actualizar asignatura existente
      await convex.mutation("asignaturas:actualizarAsignatura", {
        asignaturaId: editingSubject.value._id,
        usuarioId: getCurrentUserId(),
        nombre: formData.name,
        codigo: formData.code,
        profesor: formData.professor,
        creditos: formData.credits,
        color: formData.color,
        descripcion: formData.description,
        progreso: formData.progress,
        horasEstudio: formData.studyHours,
      });
    } else {
      // Crear nueva asignatura
      await convex.mutation("asignaturas:crearAsignatura", {
        usuarioId: getCurrentUserId(),
        nombre: formData.name,
        codigo: formData.code,
        profesor: formData.professor,
        creditos: formData.credits,
        color: formData.color,
        descripcion: formData.description,
        horasEstudio: formData.studyHours,
      });
    }

    // Recargar datos
    await loadSubjects();
    cancelEdit();
  } catch (error) {
    console.error("Error guardando asignatura:", error);
  }
};

const cancelEdit = () => {
  editingSubject.value = null;
  subjectForm.value = {
    name: "",
    code: "",
    professor: "",
    credits: 6,
    color: "blue",
    description: "",
    progress: 0,
    studyHours: 0,
    useAutomaticHours: true,
  };
  showAddSubjectModal.value = false;
};

// Cargar datos desde Convex
const loadSubjects = async () => {
  try {
    loading.value = true;

    // Obtener asignaturas del usuario desde Convex
    const asignaturasData = await convex.query(
      "asignaturas:getAsignaturasByUsuario",
      {
        usuarioId: getCurrentUserId(),
      }
    );

    // Obtener todas las entregas del usuario
    const entregasData = await convex.query("entregas:getEntregasByUsuario", {
      usuarioId: getCurrentUserId(),
    });

    console.log("📚 Asignaturas obtenidas de Convex:", asignaturasData);
    console.log("📝 Entregas obtenidas de Convex:", entregasData);

    // Mapear las asignaturas para compatibilidad con el frontend
    subjects.value = asignaturasData.map((asignatura) => {
      // Contar entregas para esta asignatura específica
      const entregasAsignatura = entregasData.filter(
        (entrega) => entrega.asignaturaId === asignatura._id
      );

      return {
        _id: asignatura._id,
        id: asignatura._id, // Para compatibilidad
        name: asignatura.nombre,
        code: asignatura.codigo,
        professor: asignatura.profesor,
        credits: asignatura.creditos,
        color: asignatura.color,
        description: asignatura.descripcion,
        progress: asignatura.progreso,
        studyHours: asignatura.horasEstudio || 0,
        assignmentsCount: entregasAsignatura.length, // Contador de entregas
        assignments: entregasAsignatura, // Entregas completas
        notes: [], // Se llenarán después si es necesario
      };
    });
  } catch (error) {
    console.error("❌ Error cargando asignaturas:", error);
  } finally {
    loading.value = false;
  }
};

// Cargar datos iniciales
onMounted(async () => {
  await loadSubjects();
});

// Watcher para resetear paginación cuando cambie la búsqueda
watch(searchNotes, () => {
  currentPage.value = 1;
});

// Meta tags
useSeoMeta({
  title: "Asignaturas - Repasa+",
  description: "Gestiona el contenido de tus materias universitarias",
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

/* Estilos para el resaltado de búsqueda */
mark {
  background-color: rgb(254 240 138); /* yellow-200 */
  color: rgb(17 24 39); /* gray-900 */
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.dark mark {
  background-color: rgb(133 77 14); /* yellow-800 */
  color: rgb(254 240 138); /* yellow-200 */
}
</style>
