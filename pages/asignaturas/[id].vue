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
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <NuxtLink
              to="/asignaturas"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon class="h-5 w-5" />
            </NuxtLink>
            <div :class="['w-4 h-4 rounded-full', getSubjectColor(subject.color)]"></div>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ subject.code }}</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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

        <div class="mt-4 sm:mt-0 flex space-x-3">
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
                :key="assignment.id"
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
                    <button @click="deleteAssignment(assignment.id)" class="btn-danger text-xs">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes Tab -->
          <div v-else-if="activeTab === 'notes'">
            <div v-if="!subject.notes || subject.notes.length === 0" class="text-center py-8">
              <DocumentTextIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">No hay notas guardadas</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="note in subject.notes"
                :key="note.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900 dark:text-white">
                      {{ note.title }}
                    </h4>
                    <p class="text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-wrap">
                      {{ note.content }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {{ formatDate(note.createdAt) }}
                    </p>
                  </div>
                  <div class="flex space-x-2 ml-4">
                    <button @click="editNote(note)" class="btn-secondary text-xs">
                      Editar
                    </button>
                    <button @click="deleteNote(note.id)" class="btn-danger text-xs">
                      Eliminar
                    </button>
                  </div>
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
import { ref, computed, onMounted } from "vue";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  UserIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";

// Get route params
const route = useRoute();
const subjectId = parseInt(route.params.id);

console.log('=== DEBUG ASIGNATURA DETALLE ===');
console.log('ID de asignatura:', subjectId);

// Estado reactivo
const loading = ref(true);
const subject = ref(null);
const activeTab = ref("assignments");
const showAddContentModal = ref(false);

// Tabs configuration
const tabs = [
  { key: "assignments", label: "Entregas", icon: DocumentTextIcon },
  { key: "notes", label: "Notas", icon: DocumentTextIcon },
];

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

const deleteAssignment = (assignmentId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta entrega?")) {
    subject.value.assignments = subject.value.assignments.filter(
      (a) => a.id !== assignmentId
    );
  }
};

const editNote = (note) => {
  console.log("Editar nota:", note);
};

const deleteNote = (noteId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
    subject.value.notes = subject.value.notes.filter((n) => n.id !== noteId);
  }
};

// Load subject data
onMounted(async () => {
  console.log('Cargando asignatura con ID:', subjectId);
  
  // Simulate loading
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - aquí deberías obtener los datos del store o API
  const mockSubjects = [
    {
      id: 1,
      name: "Programación I",
      code: "PROG001",
      professor: "Dr. García",
      credits: 6,
      color: "blue",
      description: "Introducción a la programación con Python. Conceptos fundamentales, estructuras de datos básicas y paradigmas de programación.",
      progress: 65,
      assignments: [
        {
          id: 1,
          title: "Práctica 1: Variables y Tipos",
          description: "Ejercicios básicos de variables y tipos de datos",
          dueDate: "2025-08-15",
          status: "completed",
        },
        {
          id: 2,
          title: "Práctica 2: Estructuras de Control",
          description: "Implementación de bucles y condicionales",
          dueDate: "2025-08-22",
          status: "pending",
        },
      ],
      studyHours: 35,
      notes: [
        {
          id: 1,
          title: "Apuntes Clase 1",
          content: "Variables en Python:\n- int: números enteros\n- float: números decimales\n- str: cadenas de texto\n- bool: verdadero/falso",
          createdAt: "2025-08-01",
        },
      ],
    },
    {
      id: 2,
      name: "Matemáticas I",
      code: "MATH001",
      professor: "Dra. López",
      credits: 6,
      color: "green",
      description: "Cálculo diferencial e integral. Fundamentos matemáticos para la ingeniería.",
      progress: 45,
      assignments: [
        {
          id: 3,
          title: "Ejercicios de Derivadas",
          description: "Práctica de derivadas y sus aplicaciones",
          dueDate: "2025-08-20",
          status: "pending",
        },
      ],
      studyHours: 25,
      notes: [],
    },
    {
      id: 3,
      name: "Física I",
      code: "PHYS001",
      professor: "Dr. Martínez",
      credits: 6,
      color: "purple",
      description: "Mecánica clásica, ondas y termodinámica. Fundamentos físicos aplicados a la ingeniería.",
      progress: 30,
      assignments: [],
      studyHours: 18,
      notes: [],
    },
  ];

  const foundSubject = mockSubjects.find((s) => s.id === subjectId);
  console.log('Asignatura encontrada:', foundSubject);
  
  subject.value = foundSubject;
  loading.value = false;
  
  if (!foundSubject) {
    console.error('Asignatura no encontrada con ID:', subjectId);
  }
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
</style>
