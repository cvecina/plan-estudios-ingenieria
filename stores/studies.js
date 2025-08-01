import { defineStore } from 'pinia'

export const useStudiesStore = defineStore('studies', () => {
  // Estado reactivo
  const subjects = ref([])
  const exercises = ref([])
  const calendar = ref([])
  const progress = ref({})
  const goals = ref([])
  const studyHours = ref(0)

  // Getters (computed)
  const totalSubjects = computed(() => subjects.value.length)
  
  const averageProgress = computed(() => {
    if (subjects.value.length === 0) return 0
    const total = subjects.value.reduce((sum, subject) => sum + subject.progress, 0)
    return Math.round(total / subjects.value.length)
  })

  const upcomingDeadlines = computed(() => {
    const now = new Date()
    return calendar.value
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
  })

  const completedExercises = computed(() => {
    return exercises.value.filter(ex => ex.status === 'completed').length
  })

  const pendingExercises = computed(() => {
    return exercises.value.filter(ex => ex.status !== 'completed').length
  })

  // Actions
  const addSubject = (subject) => {
    const { getCurrentUserId } = useConvexData()
    const newSubject = {
      ...subject,
      id: Date.now(),
      userId: getCurrentUserId(),
      createdAt: new Date().toISOString(),
      assignments: [],
      notes: [],
      resources: [],
      schedule: [],
      studyHours: 0
    }
    subjects.value.push(newSubject)
    return newSubject
  }

  const updateSubject = (id, updates) => {
    const index = subjects.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subjects.value[index] = { ...subjects.value[index], ...updates }
    }
  }

  const deleteSubject = (id) => {
    subjects.value = subjects.value.filter(s => s.id !== id)
    // También limpiar ejercicios y eventos relacionados
    exercises.value = exercises.value.filter(ex => ex.subjectId !== id)
    calendar.value = calendar.value.filter(event => event.subjectId !== id)
  }

  const addExercise = (exercise) => {
    const { getCurrentUserId } = useConvexData()
    const newExercise = {
      ...exercise,
      id: Date.now(),
      userId: getCurrentUserId(),
      status: 'pending',
      score: null,
      createdAt: new Date().toISOString(),
      completedQuestions: 0,
      totalQuestions: 1
    }
    exercises.value.push(newExercise)
    return newExercise
  }

  const updateExercise = (id, updates) => {
    const index = exercises.value.findIndex(ex => ex.id === id)
    if (index !== -1) {
      exercises.value[index] = { ...exercises.value[index], ...updates }
    }
  }

  const deleteExercise = (id) => {
    exercises.value = exercises.value.filter(ex => ex.id !== id)
  }

  const addCalendarEvent = (event) => {
    const { getCurrentUserId } = useConvexData()
    const newEvent = {
      ...event,
      id: Date.now(),
      userId: getCurrentUserId(),
      createdAt: new Date().toISOString()
    }
    calendar.value.push(newEvent)
    return newEvent
  }

  const updateCalendarEvent = (id, updates) => {
    const index = calendar.value.findIndex(event => event.id === id)
    if (index !== -1) {
      calendar.value[index] = { ...calendar.value[index], ...updates }
    }
  }

  const deleteCalendarEvent = (id) => {
    calendar.value = calendar.value.filter(event => event.id !== id)
  }

  const addGoal = (goal) => {
    const { getCurrentUserId } = useConvexData()
    const newGoal = {
      ...goal,
      id: Date.now(),
      userId: getCurrentUserId(),
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString()
    }
    goals.value.push(newGoal)
    return newGoal
  }

  const updateGoal = (id, updates) => {
    const index = goals.value.findIndex(goal => goal.id === id)
    if (index !== -1) {
      goals.value[index] = { ...goals.value[index], ...updates }
    }
  }

  const deleteGoal = (id) => {
    goals.value = goals.value.filter(goal => goal.id !== id)
  }

  const addStudyTime = (hours, subjectId) => {
    studyHours.value += hours
    
    // Agregar horas a la asignatura específica
    if (subjectId) {
      const subject = subjects.value.find(s => s.id === subjectId)
      if (subject) {
        subject.studyHours = (subject.studyHours || 0) + hours
      }
    }
  }

  // Inicializar con datos de ejemplo
  // Inicializar datos del usuario actual
  const initializeData = () => {
    const { getCurrentUserId } = useConvexData()
    const userId = getCurrentUserId()
    
    // Cargar datos del localStorage específicos del usuario
    const userDataKey = `studies_data_${userId}`
    const savedData = localStorage.getItem(userDataKey)
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        subjects.value = data.subjects || []
        exercises.value = data.exercises || []
        calendar.value = data.calendar || []
        goals.value = data.goals || []
        studyHours.value = data.studyHours || 0
        return
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    
    // Si no hay datos guardados, inicializar con arrays vacíos
    subjects.value = []
    exercises.value = []
    calendar.value = []
    goals.value = []
    studyHours.value = 0
  }

  // Guardar datos específicos del usuario
  const saveData = () => {
    const { getCurrentUserId } = useConvexData()
    const userId = getCurrentUserId()
    
    const userDataKey = `studies_data_${userId}`
    const data = {
      subjects: subjects.value,
      exercises: exercises.value,
      calendar: calendar.value,
      goals: goals.value,
      studyHours: studyHours.value,
      lastSaved: new Date().toISOString()
    }
    
    localStorage.setItem(userDataKey, JSON.stringify(data))
    console.log(`Datos guardados para usuario ${userId}`)
  }

  // Auto-guardar cada vez que cambie el estado
  watch([subjects, exercises, calendar, goals, studyHours], () => {
    saveData()
  }, { deep: true })

  return {
    // Estado
    subjects,
    exercises,
    calendar,
    progress,
    goals,
    studyHours,
    
    // Getters
    totalSubjects,
    averageProgress,
    upcomingDeadlines,
    completedExercises,
    pendingExercises,
    
    // Actions
    addSubject,
    updateSubject,
    deleteSubject,
    addExercise,
    updateExercise,
    deleteExercise,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    addGoal,
    updateGoal,
    deleteGoal,
    addStudyTime,
    initializeData,
    saveData
  }
})
