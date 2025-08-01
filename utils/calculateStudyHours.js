/**
 * Calcula las horas de estudio recomendadas basándose en los créditos de la asignatura
 * @param {number} creditos - Número de créditos de la asignatura
 * @param {string} dificultad - Nivel de dificultad: 'basica', 'intermedia', 'avanzada'
 * @param {string} tipo - Tipo de asignatura: 'teorica', 'practica', 'mixta'
 * @returns {object} - Objeto con horas semanales y totales estimadas
 */
export const calculateStudyHours = (creditos, dificultad = 'intermedia', tipo = 'mixta') => {
  if (!creditos || creditos <= 0) {
    return {
      horasSemanales: 0,
      horasTotales: 0,
      recomendacion: 'Ingrese un número válido de créditos'
    }
  }

  // Factores base por crédito (horas por semana)
  const factorBase = {
    basica: 2.5,     // 2.5 horas por crédito por semana
    intermedia: 3,   // 3 horas por crédito por semana
    avanzada: 3.5    // 3.5 horas por crédito por semana
  }

  // Multiplicadores por tipo de asignatura
  const multiplicadorTipo = {
    teorica: 0.9,    // Menos tiempo práctico
    practica: 1.2,   // Más tiempo de laboratorio/ejercicios
    mixta: 1.0       // Balance estándar
  }

  // Calcular horas semanales
  const factorDificultad = factorBase[dificultad] || factorBase.intermedia
  const multiplicador = multiplicadorTipo[tipo] || multiplicadorTipo.mixta
  const horasSemanales = Math.round(creditos * factorDificultad * multiplicador)

  // Calcular horas totales (asumiendo semestre de 16 semanas)
  const semanasSemsestre = 16
  const horasTotales = horasSemanales * semanasSemsestre

  // Generar recomendación
  let recomendacion = `${horasSemanales}h/semana durante ${semanasSemsestre} semanas`

  if (dificultad === 'avanzada') {
    recomendacion += ' (asignatura avanzada)'
  } else if (dificultad === 'basica') {
    recomendacion += ' (asignatura básica)'
  }

  return {
    horasSemanales,
    horasTotales,
    recomendacion,
    detalles: {
      creditosBase: creditos,
      factorDificultad,
      multiplicadorTipo: multiplicador,
      semanasConsideradas: semanasSemsestre
    }
  }
}

/**
 * Calcula horas basándose solo en créditos (versión simplificada)
 * @param {number} creditos - Número de créditos
 * @returns {number} - Horas totales estimadas
 */
export const calculateSimpleHours = (creditos) => {
  if (!creditos || creditos <= 0) return 0
  
  // Fórmula estándar: 3 horas por crédito por semana × 16 semanas
  return creditos * 3 * 16
}

/**
 * Obtiene recomendaciones de estudio personalizadas
 * @param {number} creditos - Créditos de la asignatura
 * @param {string} nombre - Nombre de la asignatura (para análisis inteligente)
 * @returns {object} - Recomendaciones detalladas
 */
export const getStudyRecommendations = (creditos, nombre = '') => {
  const nombreLower = nombre.toLowerCase()
  
  // Detectar dificultad automáticamente basándose en el nombre
  let dificultad = 'intermedia'
  let tipo = 'mixta'

  // Patrones para detectar dificultad
  if (nombreLower.includes('avanzada') || nombreLower.includes('avanzado') || 
      nombreLower.includes('superior') || nombreLower.includes('iv') || 
      nombreLower.includes('4') || nombreLower.includes('master')) {
    dificultad = 'avanzada'
  } else if (nombreLower.includes('introduccion') || nombreLower.includes('basica') || 
             nombreLower.includes('basico') || nombreLower.includes('fundamentos') || 
             nombreLower.includes('i') || nombreLower.includes('1')) {
    dificultad = 'basica'
  }

  // Patrones para detectar tipo
  if (nombreLower.includes('laboratorio') || nombreLower.includes('practica') || 
      nombreLower.includes('taller') || nombreLower.includes('proyecto')) {
    tipo = 'practica'
  } else if (nombreLower.includes('teoria') || nombreLower.includes('teorica') || 
             nombreLower.includes('historia') || nombreLower.includes('filosofia')) {
    tipo = 'teorica'
  }

  const calculo = calculateStudyHours(creditos, dificultad, tipo)

  return {
    ...calculo,
    analisisAutomatico: {
      dificultadDetectada: dificultad,
      tipoDetectado: tipo,
      razonamiento: `Detectado como ${dificultad} y ${tipo} basándose en el nombre "${nombre}"`
    }
  }
}

/**
 * Genera horario de estudio semanal sugerido
 * @param {number} horasSemanales - Horas totales semanales
 * @returns {Array} - Array con distribución semanal
 */
export const generateWeeklySchedule = (horasSemanales) => {
  if (horasSemanales <= 0) return []

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const horario = []

  if (horasSemanales <= 6) {
    // Pocas horas: distribuir en días laborables
    const horasPorDia = Math.floor(horasSemanales / 3)
    const horasExtra = horasSemanales % 3
    
    for (let i = 0; i < 3; i++) {
      horario.push({
        dia: dias[i * 2], // Lunes, Miércoles, Viernes
        horas: horasPorDia + (i < horasExtra ? 1 : 0),
        sugerencia: `${horasPorDia + (i < horasExtra ? 1 : 0)}h de estudio`
      })
    }
  } else {
    // Muchas horas: distribuir en más días
    const horasPorDia = Math.floor(horasSemanales / 5)
    const horasExtra = horasSemanales % 5
    
    for (let i = 0; i < 5; i++) {
      horario.push({
        dia: dias[i],
        horas: horasPorDia + (i < horasExtra ? 1 : 0),
        sugerencia: `${horasPorDia + (i < horasExtra ? 1 : 0)}h de estudio`
      })
    }
  }

  return horario
}

/**
 * Ejemplos de uso y casos típicos
 */
export const ejemplosCalculo = {
  // Asignatura típica de 3 créditos
  tipica: calculateStudyHours(3, 'intermedia', 'mixta'),
  
  // Matemáticas avanzadas (difícil, teórica)
  matematicas: calculateStudyHours(4, 'avanzada', 'teorica'),
  
  // Laboratorio de programación (práctica)
  laboratorio: calculateStudyHours(2, 'intermedia', 'practica'),
  
  // Introducción básica
  introduccion: calculateStudyHours(3, 'basica', 'mixta'),
  
  // Proyecto final (muy intenso)
  proyecto: calculateStudyHours(6, 'avanzada', 'practica')
}
