<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
      <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nota no encontrada</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
      <NuxtLink to="/asignaturas" class="btn-primary">
        Volver a Asignaturas
      </NuxtLink>
    </div>

    <!-- Nota completa -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header con navegación -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <NuxtLink 
            to="/asignaturas" 
            class="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <ArrowLeftIcon class="h-5 w-5 mr-2" />
            Volver a Asignaturas
          </NuxtLink>
          
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ asignatura?.nombre }}
            </span>
            <div class="flex space-x-2">
              <button 
                @click="toggleEditMode" 
                :class="[
                  'btn-secondary',
                  editMode ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''
                ]"
              >
                <PencilIcon class="h-4 w-4 mr-2" />
                {{ editMode ? 'Vista Lectura' : 'Editar' }}
              </button>
              
              <button 
                v-if="editMode && hasChanges" 
                @click="saveNote" 
                :disabled="saving"
                class="btn-primary"
              >
                <CheckIcon v-if="!saving" class="h-4 w-4 mr-2" />
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ saving ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Estado de guardado -->
        <div v-if="lastSaved" class="text-sm text-gray-500 dark:text-gray-400">
          Guardado automáticamente: {{ formatTimeAgo(lastSaved) }}
        </div>
      </div>

      <!-- Contenido de la nota -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <!-- Título -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <input
            v-if="editMode"
            v-model="editableNote.titulo"
            @input="markAsChanged"
            class="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Título de la nota..."
          />
          <h1 v-else class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ note.titulo }}
          </h1>
        </div>

        <!-- Editor/Contenido -->
        <div class="p-6">
          <!-- Modo edición con editor rico -->
          <div v-if="editMode" class="min-h-96">
            <div class="mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
              <div class="flex items-center space-x-2 text-sm">
                <!-- Toolbar del editor -->
                <button 
                  @click="formatText('bold')"
                  class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Negrita"
                >
                  <strong>B</strong>
                </button>
                <button 
                  @click="formatText('italic')"
                  class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Cursiva"
                >
                  <em>I</em>
                </button>
                <button 
                  @click="formatText('underline')"
                  class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Subrayado"
                >
                  <u>U</u>
                </button>
                <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button 
                  @click="insertList('ul')"
                  class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Lista con viñetas"
                >
                  •
                </button>
                <button 
                  @click="insertList('ol')"
                  class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Lista numerada"
                >
                  1.
                </button>
              </div>
            </div>
            
            <div
              ref="editor"
              contenteditable="true"
              @input="onEditorInput"
              @paste="onPaste"
              class="min-h-96 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-gray-900 dark:text-white"
              style="white-space: pre-wrap;"
              v-html="editableNote.contenido"
            >
            </div>
          </div>

          <!-- Modo lectura -->
          <div v-else class="prose prose-lg dark:prose-invert max-w-none">
            <div 
              class="text-gray-900 dark:text-white leading-relaxed"
              style="white-space: pre-wrap;"
              v-html="formatContent(note.contenido)"
            >
            </div>
          </div>
        </div>

        <!-- Footer con metadatos -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl border-t border-gray-200 dark:border-gray-600">
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div>
              Creada: {{ formatDate(note.fechaCreacion) }}
            </div>
            <div v-if="note.fechaActualizacion !== note.fechaCreacion">
              Última edición: {{ formatDate(note.fechaActualizacion) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Props de la ruta
const route = useRoute()
const noteId = route.params.id

// Convex setup
const { convex, getCurrentUserId } = useConvexData()

// Estados reactivos
const loading = ref(true)
const error = ref(null)
const note = ref(null)
const asignatura = ref(null)
const editMode = ref(false)
const saving = ref(false)
const hasChanges = ref(false)
const lastSaved = ref(null)

// Editor
const editor = ref(null)
const editableNote = ref({
  titulo: '',
  contenido: ''
})

// Cargar la nota
onMounted(async () => {
  await loadNote()
})

const loadNote = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Obtener la nota por ID
    const noteData = await convex.query('notes:getNoteById', {
      noteId: noteId,
      usuarioId: DEFAULT_USER_ID
    })
    
    if (!noteData) {
      error.value = 'La nota no existe o no tienes permisos para verla'
      return
    }
    
    note.value = noteData
    
    // Cargar información de la asignatura
    const asignaturaData = await convex.query('asignaturas:getAsignaturaById', {
      asignaturaId: noteData.asignaturaId,
      usuarioId: DEFAULT_USER_ID
    })
    
    asignatura.value = asignaturaData
    
    // Inicializar contenido editable
    editableNote.value = {
      titulo: noteData.titulo,
      contenido: noteData.contenido
    }
    
  } catch (err) {
    console.error('❌ Error cargando nota:', err)
    error.value = 'Error al cargar la nota'
  } finally {
    loading.value = false
  }
}

// Alternar modo edición
const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (editMode.value) {
    nextTick(() => {
      if (editor.value) {
        editor.value.focus()
      }
    })
  }
}

// Detectar cambios
const markAsChanged = () => {
  hasChanges.value = true
}

// Eventos del editor
const onEditorInput = (event) => {
  editableNote.value.contenido = event.target.innerHTML
  markAsChanged()
}

const onPaste = (event) => {
  event.preventDefault()
  const text = event.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
}

// Formateo de texto
const formatText = (command) => {
  document.execCommand(command, false, null)
  editor.value.focus()
  markAsChanged()
}

const insertList = (type) => {
  document.execCommand(type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList', false, null)
  editor.value.focus()
  markAsChanged()
}

// Guardar nota
const saveNote = async () => {
  try {
    saving.value = true
    
    await convex.mutation('notes:actualizarNota', {
      notaId: noteId,
      usuarioId: getCurrentUserId(),
      titulo: editableNote.value.titulo,
      contenido: editableNote.value.contenido
    })
    
    // Actualizar la nota local
    note.value.titulo = editableNote.value.titulo
    note.value.contenido = editableNote.value.contenido
    note.value.fechaActualizacion = Date.now()
    
    hasChanges.value = false
    lastSaved.value = Date.now()
    
    console.log('✅ Nota guardada correctamente')
    
  } catch (err) {
    console.error('❌ Error guardando nota:', err)
    alert('Error al guardar la nota')
  } finally {
    saving.value = false
  }
}

// Auto-guardado cada 30 segundos si hay cambios
let autoSaveInterval
watch(hasChanges, (newValue) => {
  if (newValue && editMode.value) {
    if (autoSaveInterval) clearInterval(autoSaveInterval)
    autoSaveInterval = setInterval(async () => {
      if (hasChanges.value && !saving.value) {
        await saveNote()
      }
    }, 30000) // 30 segundos
  } else {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null
    }
  }
})

// Funciones auxiliares
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'hace un momento'
  if (minutes === 1) return 'hace 1 minuto'
  if (minutes < 60) return `hace ${minutes} minutos`
  
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'hace 1 hora'
  if (hours < 24) return `hace ${hours} horas`
  
  return formatDate(timestamp)
}

const formatContent = (content) => {
  // Convertir saltos de línea a <br> para la vista de lectura
  return content.replace(/\n/g, '<br>')
}

// Meta tags
useSeoMeta({
  title: () => note.value ? `${note.value.titulo} - Repasa+` : 'Cargando nota...',
  description: () => note.value ? note.value.contenido.substring(0, 160) : 'Visualizando nota de estudio'
})

// Limpiar interval al desmontar
onUnmounted(() => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval)
  }
})
</script>

<style scoped>
/* Estilos para el editor */
[contenteditable="true"]:focus {
  outline: none;
}

/* Estilos para el contenido formateado */
.prose {
  line-height: 1.8;
}

.prose p {
  margin-bottom: 1em;
}

.prose ul, .prose ol {
  margin-left: 1.5em;
  margin-bottom: 1em;
}

.prose li {
  margin-bottom: 0.5em;
}

.prose strong {
  font-weight: bold;
}

.prose em {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}
</style>
