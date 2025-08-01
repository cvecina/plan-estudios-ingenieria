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
    const newSubject = {
      ...subject,
      id: Date.now(),
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
    const newExercise = {
      ...exercise,
      id: Date.now(),
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
    const newEvent = {
      ...event,
      id: Date.now(),
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
    const newGoal = {
      ...goal,
      id: Date.now(),
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
  const initializeData = () => {
    // Asignaturas de ejemplo
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
          { id: 1, title: 'Práctica 1', date: '2025-08-15', status: 'pending' }
        ],
        studyHours: 25,
        notes: [],
        resources: [],
        schedule: [],
        createdAt: '2025-08-01T00:00:00Z'
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
          { id: 1, title: 'Examen Parcial', date: '2025-08-20', status: 'pending' }
        ],
        studyHours: 30,
        notes: [],
        resources: [],
        schedule: [],
        createdAt: '2025-08-01T00:00:00Z'
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
        studyHours: 18,
        notes: [],
        resources: [],
        schedule: [],
        createdAt: '2025-08-01T00:00:00Z'
      }
    ]

    // Ejercicios de ejemplo
    exercises.value = [
      {
        id: 1,
        title: 'Ejercicios de Bucles',
        subjectId: 1,
        difficulty: 'medium',
        estimatedTime: 45,
        description: 'Practica el uso de bucles for y while en Python',
        content: '1. Crear un programa que imprima los números del 1 al 100\n2. Calcular la suma de números pares entre 1 y 50\n3. Crear un programa que pida números hasta que se ingrese 0',
        solution: '# Solución 1\nfor i in range(1, 101):\n    print(i)\n\n# Solución 2\nsuma = sum(i for i in range(2, 51, 2))\nprint(suma)',
        status: 'completed',
        score: 85,
        totalQuestions: 3,
        completedQuestions: 3,
        createdAt: '2025-08-01T10:00:00Z',
        lastAttempt: '2025-08-05T14:30:00Z'
      },
      {
        id: 2,
        title: 'Derivadas Básicas',
        subjectId: 2,
        difficulty: 'easy',
        estimatedTime: 30,
        description: 'Ejercicios fundamentales de derivación',
        content: 'Calcula las derivadas de las siguientes funciones:\n1. f(x) = 3x² + 2x - 1\n2. f(x) = sin(x) + cos(x)\n3. f(x) = e^x * ln(x)',
        solution: '1. f\'(x) = 6x + 2\n2. f\'(x) = cos(x) - sin(x)\n3. f\'(x) = e^x * ln(x) + e^x/x',
        status: 'pending',
        score: null,
        totalQuestions: 3,
        completedQuestions: 0,
        createdAt: '2025-08-02T09:15:00Z'
      }
    ]

    // Eventos del calendario
    calendar.value = [
      {
        id: 1,
        title: 'Entrega Práctica 1',
        subject: 'Programación I',
        subjectId: 1,
        date: '2025-08-15T23:59',
        type: 'assignment',
        description: 'Primera práctica de programación'
      },
      {
        id: 2,
        title: 'Examen Parcial',
        subject: 'Matemáticas I',
        subjectId: 2,
        date: '2025-08-20T10:00',
        type: 'exam',
        description: 'Parcial de derivadas e integrales'
      }
    ]

    // Objetivos
    goals.value = [
      {
        id: 1,
        title: 'Completar todas las prácticas de Programación',
        description: 'Entregar las 12 prácticas del cuatrimestre',
        dueDate: '2025-12-15',
        status: 'in_progress',
        progress: 67,
        createdAt: '2025-08-01'
      },
      {
        id: 2,
        title: 'Estudiar 100 horas este cuatrimestre',
        description: 'Meta de tiempo de estudio para el cuatrimestre',
        dueDate: '2025-12-20',
        status: 'in_progress',
        progress: 85,
        createdAt: '2025-08-01'
      }
    ]

    studyHours.value = 73
  }

  // Función para persistir datos (se puede conectar a Convex más adelante)
  const saveData = () => {
    // TODO: Implementar persistencia con Convex
    console.log('Guardando datos...', {
      subjects: subjects.value,
      exercises: exercises.value,
      calendar: calendar.value,
      goals: goals.value,
      studyHours: studyHours.value
    })
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
