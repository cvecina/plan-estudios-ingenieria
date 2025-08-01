<template>
  <div class="space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Curso not found -->
    <div v-else-if="!curso" class="text-center py-12">
      <BookOpenIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Curso no encontrado
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-6">
        El curso que buscas no existe
      </p>
      <NuxtLink to="/cursos" class="btn-primary">
        Volver a Cursos
      </NuxtLink>
    </div>

    <!-- Curso details -->
    <div v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-4">
            <NuxtLink
              to="/cursos"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </NuxtLink>
            <div :class="['w-4 h-4 rounded-full', getCursoColorClass(curso.color)]"></div>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ getEstadoLabel(curso.estado) }}</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ curso.nombre }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ curso.descripcion || 'Sin descripción' }}
          </p>
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center">
              <CalendarIcon class="h-4 w-4 mr-1" />
              {{ formatDate(curso.fechaInicio) }} - {{ formatDate(curso.fechaFin) }}
            </div>
            <div class="flex items-center">
              <BookOpenIcon class="h-4 w-4 mr-1" />
              {{ curso.numeroAsignaturas }} asignaturas
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button @click="showAddAsignaturaModal = true" class="btn-secondary">
            <PlusIcon class="h-4 w-4 mr-2" />
            Agregar Asignatura
          </button>
          <button @click="editCurso" class="btn-primary">
            <PencilIcon class="h-4 w-4 mr-2" />
            Editar Curso
          </button>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Progreso del Curso
          </h3>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ curso.progreso }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div
            :class="['h-3 rounded-full transition-all duration-500', getCursoColorClass(curso.color)]"
            :style="{ width: `${curso.progreso}%` }"
          ></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ curso.asignaturas?.length || 0 }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Asignaturas</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ completedAsignaturas }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ totalCreditos }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Créditos</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ totalHorasEstudio }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Horas de Estudio</p>
          </div>
        </div>
      </div>

      <!-- Asignaturas -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Asignaturas del Curso
          </h3>
        </div>

        <div class="p-6">
          <div v-if="!curso.asignaturas || curso.asignaturas.length === 0" class="text-center py-8">
            <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">No hay asignaturas en este curso</p>
            <button
              @click="showAddAsignaturaModal = true"
              class="btn-primary"
            >
              Agregar Primera Asignatura
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="asignatura in curso.asignaturas"
              :key="asignatura._id"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateToAsignatura(asignatura._id)"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div :class="['w-3 h-3 rounded-full', getAsignaturaColorClass(asignatura.color)]"></div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ asignatura.codigo }}</span>
                </div>
                <div class="flex space-x-1">
                  <button
                    @click.stop="editAsignatura(asignatura)"
                    class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon class="h-3 w-3" />
                  </button>
                  <button
                    @click.stop="deleteAsignatura(asignatura._id)"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon class="h-3 w-3" />
                  </button>
                </div>
              </div>

              <h4 class="font-medium text-gray-900 dark:text-white mb-2 line-clamp-1">
                {{ asignatura.nombre }}
              </h4>
              
              <div class="space-y-2 mb-3">
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-600 dark:text-gray-400">Progreso</span>
                  <span class="text-xs font-medium text-gray-900 dark:text-white">{{ asignatura.progreso }}%</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                  <div
                    :class="['h-1.5 rounded-full transition-all duration-300', getAsignaturaColorClass(asignatura.color)]"
                    :style="{ width: `${asignatura.progreso}%` }"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{{ asignatura.creditos }} créditos</span>
                <span>{{ asignatura.profesor }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Agregar Asignatura -->
    <div
      v-if="showAddAsignaturaModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeAddAsignaturaModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ editingAsignatura ? 'Editar Asignatura' : 'Agregar Asignatura al Curso' }}
          </h3>
          
          <AsignaturaForm
            v-model="asignaturaForm"
            :mode="editingAsignatura ? 'edit' : 'create'"
            :submit-button-text="editingAsignatura ? 'Actualizar' : 'Agregar Asignatura'"
            :existing-codes="curso?.asignaturas?.map(a => a.codigo).filter(code => code !== asignaturaForm.code) || []"
            @submit="saveAsignatura"
            @cancel="closeAddAsignaturaModal"
          />
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
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  DocumentTextIcon,
  TrashIcon
} from "@heroicons/vue/24/outline";
import AsignaturaForm from "~/components/AsignaturaForm.vue";
import { calculateStudyHours } from '~/utils/calculateStudyHours.js';
import { generateSubjectCode } from '~/utils/generateSubjectCode.js';

// Get route params
const route = useRoute();
const cursoId = route.params.id;

// Convex setup
const { convex, getCurrentUserId } = useConvexData()

// Estado reactivo
const loading = ref(true);
const curso = ref(null);
const showAddAsignaturaModal = ref(false);
const editingAsignatura = ref(null);

// Formulario de asignatura (sin progress para modo crear)
const asignaturaForm = ref({
  name: '',
  code: '',
  professor: '',
  credits: 6,
  color: 'blue',
  description: '',
  studyHours: 0,
  useAutomaticHours: true
})

// Opciones de colores
const colorOptions = [
  "blue",
  "green", 
  "purple",
  "red",
  "yellow",
  "indigo",
  "pink",
  "gray",
];

// Computed properties
const completedAsignaturas = computed(() => {
  if (!curso.value?.asignaturas) return 0;
  return curso.value.asignaturas.filter(a => a.progreso === 100).length;
});

const totalCreditos = computed(() => {
  if (!curso.value?.asignaturas) return 0;
  return curso.value.asignaturas.reduce((total, a) => total + (a.creditos || 0), 0);
});

const totalHorasEstudio = computed(() => {
  if (!curso.value?.asignaturas) return 0;
  return curso.value.asignaturas.reduce((total, a) => total + (a.horasEstudio || 0), 0);
});

// Cálculo automático de horas de estudio
const calculatedHours = computed(() => {
  if (!asignaturaForm.value.name || !asignaturaForm.value.credits) return null;
  
  return calculateStudyHours(
    asignaturaForm.value.name,
    asignaturaForm.value.credits,
    asignaturaForm.value.description || ""
  );
});

// Computed property para las horas finales (manuales o automáticas)
const finalStudyHours = computed(() => {
  if (asignaturaForm.value.useAutomaticHours && calculatedHours.value) {
    return calculatedHours.value.horasTotales;
  }
  return asignaturaForm.value.studyHours;
});

// Cargar curso
const loadCurso = async () => {
  try {
    loading.value = true;
    const data = await convex.query("cursos:getCursoById", {
      id: cursoId,
      usuarioId: DEFAULT_USER_ID
    });
    curso.value = data;
  } catch (error) {
    console.error('Error cargando curso:', error);
    curso.value = null;
  } finally {
    loading.value = false;
  }
};

// Guardar asignatura
const saveAsignatura = async (formData) => {
  try {
    if (editingAsignatura.value) {
      // Actualizar asignatura existente
      await convex.mutation("asignaturas:actualizarAsignatura", {
        asignaturaId: editingAsignatura.value._id,
        usuarioId: getCurrentUserId(),
        nombre: formData.name,
        codigo: formData.code,
        profesor: formData.professor,
        creditos: formData.credits,
        color: formData.color,
        descripcion: formData.description,
        progreso: formData.progress || 0,
        horasEstudio: formData.studyHours
      });
    } else {
      // Crear nueva asignatura (sin progreso inicial)
      await convex.mutation("asignaturas:crearAsignatura", {
        usuarioId: getCurrentUserId(),
        cursoId: cursoId,
        nombre: formData.name,
        codigo: formData.code,
        profesor: formData.professor,
        creditos: formData.credits,
        color: formData.color,
        descripcion: formData.description,
        progreso: 0, // Las nuevas asignaturas siempre empiezan en 0%
        horasEstudio: formData.studyHours
      });
    }
    
    closeAddAsignaturaModal();
    await loadCurso();
  } catch (error) {
    console.error('Error guardando asignatura:', error);
  }
};

// Editar asignatura
const editAsignatura = (asignatura) => {
  editingAsignatura.value = asignatura;
  asignaturaForm.value = {
    name: asignatura.nombre || '',
    code: asignatura.codigo || '',
    professor: asignatura.profesor || '',
    credits: asignatura.creditos || 6,
    color: asignatura.color || 'blue',
    description: asignatura.descripcion || '',
    progress: asignatura.progreso || 0,
    studyHours: asignatura.horasEstudio || 0,
    useAutomaticHours: true
  };
  showAddAsignaturaModal.value = true;
};

// Eliminar asignatura
const deleteAsignatura = async (asignaturaId) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta asignatura?')) {
    try {
      await convex.mutation("asignaturas:eliminarAsignatura", {
        asignaturaId: asignaturaId,
        usuarioId: DEFAULT_USER_ID
      });
      
      await loadCurso();
    } catch (error) {
      console.error('Error eliminando asignatura:', error);
    }
  }
};

// Cerrar modal
const closeAddAsignaturaModal = () => {
  showAddAsignaturaModal.value = false;
  editingAsignatura.value = null;
  asignaturaForm.value = {
    name: '',
    code: '',
    professor: '',
    credits: 6,
    color: 'blue',
    description: '',
    studyHours: 0,
    useAutomaticHours: true
  };
};

// Regenerar código manualmente
const regenerateCode = () => {
  if (asignaturaForm.value.name.trim()) {
    const existingCodes = curso.value?.asignaturas?.map(a => a.codigo) || [];
    const generatedCode = generateSubjectCode(asignaturaForm.value.name, existingCodes);
    asignaturaForm.value.code = generatedCode;
  }
};

// Navegar a asignatura
const navigateToAsignatura = (asignaturaId) => {
  navigateTo(`/asignaturas/${asignaturaId}`);
};

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

const getAsignaturaColorClass = (color) => {
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

const getEstadoLabel = (estado) => {
  const labels = {
    activo: '🟢 Activo',
    completado: '✅ Completado',
    pausado: '⏸️ Pausado'
  }
  return labels[estado] || '🟢 Activo'
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
  loadCurso();
});

// Watcher para generar código automáticamente basado en el nombre (solo en modo crear)
watch(
  () => asignaturaForm.value.name,
  (newName) => {
    if (newName && newName.trim() && !editingAsignatura.value) {
      // Obtener códigos existentes para evitar duplicados
      const existingCodes = curso.value?.asignaturas?.map(a => a.codigo) || [];
      
      // Generar nuevo código
      const generatedCode = generateSubjectCode(newName, existingCodes);
      asignaturaForm.value.code = generatedCode;
    }
  }
);

// Meta tags
useSeoMeta({
  title: () => curso.value ? `${curso.value.nombre} - Repasa+` : "Cargando...",
  description: () => curso.value ? curso.value.descripcion : "Cargando información del curso",
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
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
</style>
