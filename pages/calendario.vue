<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">📅 Calendario</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">Planifica tus entregas y horarios de estudio</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="showAddEventModal = true" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nueva Entrega
        </button>
      </div>
    </div>

    <!-- Calendar View Selector -->
    <div class="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
      <button 
        v-for="view in viewOptions" 
        :key="view.value"
        @click="currentView = view.value"
        :class="[
          'px-4 py-2 rounded-md text-sm font-medium transition-all',
          currentView === view.value 
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        {{ view.label }}
      </button>
    </div>

    <!-- Calendar -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="p-6">
        <!-- Calendar Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-4">
            <button @click="previousPeriod" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ currentPeriodTitle }}
            </h2>
            <button @click="nextPeriod" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
          <button @click="goToToday" class="btn-secondary text-sm">
            Hoy
          </button>
        </div>

        <!-- Calendar Grid -->
        <div v-if="currentView === 'month'" class="calendar-grid">
          <!-- Days of week header -->
          <div class="grid grid-cols-7 gap-px mb-2">
            <div 
              v-for="day in daysOfWeek" 
              :key="day"
              class="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {{ day }}
            </div>
          </div>
          
          <!-- Calendar days -->
          <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
            <div 
              v-for="day in calendarDays" 
              :key="day.date"
              :class="[
                'min-h-[100px] bg-white dark:bg-gray-800 p-2',
                !day.isCurrentMonth && 'bg-gray-50 dark:bg-gray-900 text-gray-400',
                day.isToday && 'bg-blue-50 dark:bg-blue-900/20'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <span :class="[
                  'text-sm font-medium',
                  day.isToday && 'text-blue-600 dark:text-blue-400'
                ]">
                  {{ day.dayNumber }}
                </span>
              </div>
              
              <!-- Events for this day -->
              <div class="space-y-1">
                <div 
                  v-for="event in day.events" 
                  :key="event.id"
                  :class="[
                    'text-xs p-1 rounded truncate cursor-pointer',
                    getEventClasses(event.type)
                  ]"
                  @click="viewEvent(event)"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Week View -->
        <div v-else-if="currentView === 'week'" class="space-y-4">
          <div class="grid grid-cols-8 gap-4">
            <div class="text-sm font-medium text-gray-500">Hora</div>
            <div 
              v-for="day in weekDays" 
              :key="day.date"
              class="text-center"
            >
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ day.dayName }}</div>
              <div :class="[
                'text-lg font-semibold mt-1',
                day.isToday && 'text-blue-600 dark:text-blue-400'
              ]">
                {{ day.dayNumber }}
              </div>
            </div>
          </div>
          
          <!-- Time slots -->
          <div class="space-y-2">
            <div 
              v-for="hour in hours" 
              :key="hour"
              class="grid grid-cols-8 gap-4 border-b border-gray-100 dark:border-gray-700 pb-2"
            >
              <div class="text-sm text-gray-500">{{ hour }}:00</div>
              <div 
                v-for="day in weekDays" 
                :key="`${day.date}-${hour}`"
                class="min-h-[50px] bg-gray-50 dark:bg-gray-900 rounded p-2"
              >
                <!-- Events for this hour -->
                <div 
                  v-for="event in getEventsForHour(day.date, hour)" 
                  :key="event.id"
                  :class="[
                    'text-xs p-1 rounded mb-1 cursor-pointer',
                    getEventClasses(event.type)
                  ]"
                  @click="viewEvent(event)"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Próximas Entregas</h3>
      </div>
      <div class="p-6">
        <div v-if="upcomingEvents.length === 0" class="text-center py-8">
          <CalendarIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">No hay entregas próximas</p>
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="event in upcomingEvents" 
            :key="event.id"
            class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-3 h-3 rounded-full',
                getEventColor(event.type)
              ]"></div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">{{ event.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ event.subject }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(event.date) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ getTimeUntil(event.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <Modal v-model="showAddEventModal" title="Nueva Entrega">
      <form @submit.prevent="addEvent" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Título
          </label>
          <input 
            v-model="newEvent.title"
            type="text" 
            required
            class="input-field"
            placeholder="Ej: Entrega Práctica 1"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Asignatura
          </label>
          <select v-model="newEvent.subject" required class="input-field">
            <option value="">Selecciona una asignatura</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.name">
              {{ subject.name }}
            </option>
          </select>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha
            </label>
            <input 
              v-model="newEvent.date"
              type="date" 
              required
              class="input-field"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora
            </label>
            <input 
              v-model="newEvent.time"
              type="time" 
              class="input-field"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo
          </label>
          <select v-model="newEvent.type" required class="input-field">
            <option value="assignment">Entrega</option>
            <option value="exam">Examen</option>
            <option value="presentation">Presentación</option>
            <option value="study">Sesión de Estudio</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea 
            v-model="newEvent.description"
            rows="3"
            class="input-field"
            placeholder="Detalles adicionales..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="showAddEventModal = false" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            Guardar
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
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'
import Modal from '~/components/Modal.vue'

// Estado reactivo
const currentView = ref('month')
const currentDate = ref(new Date())
const showAddEventModal = ref(false)
const events = ref([])
const subjects = ref([])

// Opciones de vista
const viewOptions = [
  { value: 'month', label: 'Mes' },
  { value: 'week', label: 'Semana' }
]

// Días de la semana
const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Horas para la vista semanal
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

// Formulario para nuevo evento
const newEvent = ref({
  title: '',
  subject: '',
  date: '',
  time: '',
  type: 'assignment',
  description: ''
})

// Computed properties
const currentPeriodTitle = computed(() => {
  const options = { year: 'numeric', month: 'long' }
  return currentDate.value.toLocaleDateString('es-ES', options)
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Primer día del mes
  const firstDay = new Date(year, month, 1)
  // Último día del mes
  const lastDay = new Date(year, month + 1, 0)
  
  // Ajustar para que la semana empiece en lunes
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))
  
  const days = []
  const currentDay = new Date(startDate)
  
  // Generar 42 días (6 semanas x 7 días)
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = currentDay.getMonth() === month
    const isToday = isToday_helper(currentDay)
    const dayEvents = getEventsForDate(currentDay)
    
    days.push({
      date: new Date(currentDay),
      dayNumber: currentDay.getDate(),
      isCurrentMonth,
      isToday,
      events: dayEvents
    })
    
    currentDay.setDate(currentDay.getDate() + 1)
  }
  
  return days
})

const weekDays = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Ajustar para lunes
  startOfWeek.setDate(diff)
  
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    
    days.push({
      date: new Date(date),
      dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: isToday_helper(date)
    })
  }
  
  return days
})

const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)
})

// Métodos
const isToday_helper = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const getEventsForDate = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return events.value.filter(event => event.date.startsWith(dateStr))
}

const getEventsForHour = (date, hour) => {
  const events = getEventsForDate(date)
  return events.filter(event => {
    if (event.time) {
      const eventHour = parseInt(event.time.split(':')[0])
      return eventHour === hour
    }
    return false
  })
}

const getEventClasses = (type) => {
  const classes = {
    assignment: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    exam: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    presentation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    study: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  }
  return classes[type] || classes.assignment
}

const getEventColor = (type) => {
  const colors = {
    assignment: 'bg-blue-500',
    exam: 'bg-red-500',
    presentation: 'bg-purple-500',
    study: 'bg-green-500'
  }
  return colors[type] || colors.assignment
}

const previousPeriod = () => {
  if (currentView.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() - 1)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() - 7)
  }
  currentDate.value = new Date(currentDate.value)
}

const nextPeriod = () => {
  if (currentView.value === 'month') {
    currentDate.value.setMonth(currentDate.value.getMonth() + 1)
  } else {
    currentDate.value.setDate(currentDate.value.getDate() + 7)
  }
  currentDate.value = new Date(currentDate.value)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getTimeUntil = (dateStr) => {
  const eventDate = new Date(dateStr)
  const now = new Date()
  const diff = eventDate - now
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  if (days < 7) return `En ${days} días`
  return `En ${Math.ceil(days / 7)} semanas`
}

const addEvent = () => {
  const event = {
    id: Date.now(),
    ...newEvent.value,
    date: newEvent.value.date + (newEvent.value.time ? `T${newEvent.value.time}` : '')
  }
  
  events.value.push(event)
  
  // Reset form
  newEvent.value = {
    title: '',
    subject: '',
    date: '',
    time: '',
    type: 'assignment',
    description: ''
  }
  
  showAddEventModal.value = false
}

const viewEvent = (event) => {
  // TODO: Implementar modal de vista/edición de evento
  console.log('Ver evento:', event)
}

// Cargar datos iniciales
onMounted(() => {
  // Datos de ejemplo
  subjects.value = [
    { id: 1, name: 'Programación I' },
    { id: 2, name: 'Matemáticas I' },
    { id: 3, name: 'Física I' },
    { id: 4, name: 'Álgebra Linear' },
    { id: 5, name: 'Sistemas Digitales' },
    { id: 6, name: 'Inglés Técnico' }
  ]
  
  // Eventos de ejemplo
  events.value = [
    {
      id: 1,
      title: 'Entrega Práctica 1',
      subject: 'Programación I',
      date: '2025-08-15T23:59',
      type: 'assignment',
      description: 'Primera práctica de programación'
    },
    {
      id: 2,
      title: 'Examen Parcial',
      subject: 'Matemáticas I',
      date: '2025-08-20T10:00',
      type: 'exam',
      description: 'Parcial de derivadas e integrales'
    }
  ]
})

// Meta tags
useSeoMeta({
  title: 'Calendario - Mi Plan de Estudios',
  description: 'Organiza tus entregas y horarios de estudio'
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

.btn-primary:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246);
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

.btn-secondary:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246);
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

.input-field::placeholder {
  color: rgb(107 114 128);
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

.dark .input-field::placeholder {
  color: rgb(156 163 175);
}
</style>
