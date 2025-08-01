<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Nombre de la asignatura
      </label>
      <input
        v-model="localForm.name"
        type="text"
        required
        class="input-field"
        placeholder="Ej: Programación I"
      />
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Código
      </label>
      <div class="flex gap-2">
        <input
          v-model="localForm.code"
          type="text"
          class="flex-1 input-field"
          placeholder="Ej: PROG001"
        />
        <button
          type="button"
          @click="regenerateCode"
          class="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
          title="Regenerar código automáticamente"
        >
          ↻
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Se genera automáticamente desde el nombre
      </p>
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Profesor
      </label>
      <input
        v-model="localForm.professor"
        type="text"
        class="input-field"
        placeholder="Nombre del profesor"
      />
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Créditos
      </label>
      <input
        v-model.number="localForm.credits"
        type="number"
        min="1"
        max="12"
        class="input-field"
      />
    </div>

    <!-- Calculador de horas automático -->
    <div v-if="calculatedHours" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div class="flex justify-between items-center mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          📚 {{ mode === 'create' ? 'Estimación de Horas de Estudio' : 'Horas de Estudio Planificadas' }}
        </label>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useAutomaticHours"
            v-model="localForm.useAutomaticHours"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="useAutomaticHours" class="text-xs text-gray-600 dark:text-gray-400">
            Automático
          </label>
        </div>
      </div>
      
      <!-- Horas automáticas -->
      <div v-if="localForm.useAutomaticHours" class="space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Semanales</p>
            <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ calculatedHours.horasSemanales }}h</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Totales (semestre)</p>
            <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ calculatedHours.horasTotales }}h</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ calculatedHours.recomendacion }}
        </p>
        <p v-if="calculatedHours.analisisAutomatico" class="text-xs text-blue-600 dark:text-blue-400">
          {{ calculatedHours.analisisAutomatico.razonamiento }}
        </p>
      </div>
      
      <!-- Horas manuales -->
      <div v-else class="space-y-3">
        <div>
          <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            {{ mode === 'create' ? 'Horas Estimadas de Estudio' : 'Horas Totales de Estudio' }}
          </label>
          <input
            v-model.number="localForm.studyHours"
            type="number"
            min="0"
            max="1000"
            step="1"
            class="input-field"
            :placeholder="mode === 'create' ? 'ej. 144 (estimación inicial)' : 'ej. 144 (horas reales estudiadas)'"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ mode === 'create' ? 'Estimación inicial de horas para el semestre' : 'Horas totales dedicadas a esta asignatura' }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Color
      </label>
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="color in colorOptions"
          :key="color"
          type="button"
          @click="localForm.color = color"
          :class="[
            'w-8 h-8 rounded-full border-2 transition-all',
            localForm.color === color
              ? 'border-gray-900 dark:border-white scale-110'
              : 'border-gray-300',
            getColorClass(color),
          ]"
        ></button>
      </div>
    </div>

    <div>
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Descripción {{ mode === 'create' ? '(Opcional)' : '' }}
      </label>
      <textarea
        v-model="localForm.description"
        rows="3"
        class="input-field"
        :placeholder="mode === 'create' ? 'Describe brevemente la asignatura (temas, enfoque, etc.)' : 'Actualiza la descripción de la asignatura...'"
      ></textarea>
      <p v-if="mode === 'create'" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Una buena descripción ayuda al cálculo automático de horas de estudio
      </p>
    </div>

    <!-- Campo de Progreso - Solo en modo editar -->
    <div v-if="mode === 'edit'" class="border-t pt-4 mt-6">
      <label
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        📈 Progreso de la Asignatura
      </label>
      <div class="flex items-center space-x-3">
        <input
          v-model.number="localForm.progress"
          type="range"
          min="0"
          max="100"
          step="5"
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <span class="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem]">
          {{ localForm.progress }}%
        </span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Ajusta el progreso actual de la asignatura (0% = Sin comenzar, 100% = Completada)
      </p>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Cancelar
      </button>
      <button type="submit" class="btn-primary">
        {{ mode === 'edit' ? 'Actualizar' : submitButtonText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { calculateStudyHours } from '~/utils/calculateStudyHours.js'
import { generateSubjectCode } from '~/utils/generateSubjectCode.js'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      name: '',
      code: '',
      professor: '',
      credits: 6,
      color: 'blue',
      description: '',
      progress: 0,
      studyHours: 0,
      useAutomaticHours: true
    })
  },
  mode: {
    type: String,
    default: 'create', // 'create' o 'edit'
  },
  submitButtonText: {
    type: String,
    default: 'Guardar'
  },
  existingCodes: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Local form state
const localForm = ref({ ...props.modelValue })

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  localForm.value = { ...newValue }
}, { deep: true })

// Watch for local changes and emit them
watch(localForm, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

// Color options
const colorOptions = [
  'blue',
  'green', 
  'purple',
  'red',
  'yellow',
  'indigo',
  'pink',
  'gray',
]

// Computed properties
const calculatedHours = computed(() => {
  if (!localForm.value.name || !localForm.value.credits) return null
  
  return calculateStudyHours(
    localForm.value.name,
    localForm.value.credits,
    localForm.value.description || ''
  )
})

// Methods
const getColorClass = (color) => {
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

const regenerateCode = () => {
  if (localForm.value.name.trim()) {
    const generatedCode = generateSubjectCode(localForm.value.name, props.existingCodes)
    localForm.value.code = generatedCode
  }
}

const handleSubmit = () => {
  // Calcular las horas finales a guardar
  const finalHours = localForm.value.useAutomaticHours && calculatedHours.value 
    ? calculatedHours.value.horasTotales 
    : localForm.value.studyHours

  const formData = {
    ...localForm.value,
    studyHours: finalHours
  }

  emit('submit', formData)
}

// Watcher para generar código automáticamente basado en el nombre
watch(
  () => localForm.value.name,
  (newName) => {
    if (newName && newName.trim() && props.mode === 'create') {
      const generatedCode = generateSubjectCode(newName, props.existingCodes)
      localForm.value.code = generatedCode
    }
  }
)
</script>

<style scoped>
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
</style>
