/**
 * Genera un código de asignatura automáticamente basado en el nombre
 * @param {string} nombre - Nombre completo de la asignatura
 * @param {Array} existingCodes - Códigos existentes para evitar duplicados
 * @returns {string} - Código generado único
 */
export const generateSubjectCode = (nombre, existingCodes = []) => {
  if (!nombre || typeof nombre !== 'string') {
    return ''
  }

  // Limpiar y normalizar el nombre
  const cleanName = nombre
    .toLowerCase()
    .trim()
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s]/g, '') // Solo letras, números y espacios

  // Dividir en palabras y filtrar palabras vacías o muy cortas
  const words = cleanName
    .split(/\s+/)
    .filter(word => word.length > 0)

  let code = ''

  if (words.length === 0) {
    code = 'SUB' // Código por defecto
  } else if (words.length === 1) {
    // Una sola palabra: tomar las primeras 3-4 letras
    const word = words[0]
    if (word.length <= 3) {
      code = word.toUpperCase()
    } else {
      code = word.substring(0, 3).toUpperCase()
    }
  } else if (words.length === 2) {
    // Dos palabras: 2-3 letras de cada una
    const [first, second] = words
    if (first.length <= 2 && second.length <= 2) {
      code = (first + second).toUpperCase()
    } else {
      const firstPart = first.substring(0, Math.min(3, first.length))
      const secondPart = second.substring(0, Math.min(3, second.length))
      code = (firstPart + secondPart).toUpperCase()
      
      // Si es muy largo, recortar
      if (code.length > 6) {
        code = code.substring(0, 6)
      }
    }
  } else {
    // Múltiples palabras: primeras letras de cada palabra importante
    const importantWords = words.filter(word => 
      !['de', 'del', 'la', 'el', 'en', 'con', 'para', 'por', 'a', 'y', 'o', 'un', 'una', 'al'].includes(word)
    )
    
    if (importantWords.length === 0) {
      // Si todas son palabras comunes, usar todas
      code = words.map(word => word.charAt(0)).join('').toUpperCase()
    } else if (importantWords.length <= 4) {
      // Usar primeras letras de palabras importantes
      code = importantWords.map(word => word.charAt(0)).join('').toUpperCase()
    } else {
      // Demasiadas palabras: usar las 4 primeras importantes
      code = importantWords.slice(0, 4).map(word => word.charAt(0)).join('').toUpperCase()
    }
  }

  // Asegurar que tenga al menos 3 caracteres
  if (code.length < 3) {
    code = code.padEnd(3, '0')
  }

  // Verificar duplicados y agregar número si es necesario
  let finalCode = code
  let counter = 1
  
  while (existingCodes.includes(finalCode)) {
    if (code.length <= 4) {
      finalCode = code + counter.toString().padStart(2, '0')
    } else {
      // Si el código es largo, reemplazar los últimos caracteres con el número
      finalCode = code.substring(0, 4) + counter.toString().padStart(2, '0')
    }
    counter++
    
    // Evitar bucle infinito
    if (counter > 99) {
      finalCode = 'SUB' + Date.now().toString().slice(-3)
      break
    }
  }

  return finalCode
}

/**
 * Ejemplos de uso:
 * generateSubjectCode("Matemáticas Avanzadas") → "MATAVA" o "MA"
 * generateSubjectCode("Programación Orientada a Objetos") → "POO"
 * generateSubjectCode("Física") → "FIS"
 * generateSubjectCode("Introducción a la Ingeniería de Software") → "IIDS" o "IIS"
 * generateSubjectCode("Base de Datos") → "BD" o "BDD"
 */

/**
 * Versión más simple para casos específicos
 * @param {string} nombre - Nombre de la asignatura
 * @returns {string} - Código corto (2-4 letras)
 */
export const generateShortCode = (nombre) => {
  if (!nombre) return ''
  
  const words = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !['del', 'de', 'la', 'el', 'en', 'con', 'para', 'por'].includes(word))

  if (words.length === 0) return 'SUB'
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase()
  if (words.length === 2) return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
  
  return words.slice(0, 3).map(word => word.charAt(0)).join('').toUpperCase()
}

/**
 * Generar código con patrón específico (letras + números)
 * @param {string} nombre - Nombre de la asignatura
 * @param {number} year - Año del curso (opcional)
 * @param {number} semester - Semestre (opcional)
 * @returns {string} - Código con formato específico
 */
export const generateFormattedCode = (nombre, year = null, semester = null) => {
  const baseCode = generateShortCode(nombre)
  
  if (year && semester) {
    const yearStr = year.toString().slice(-2) // Últimos 2 dígitos del año
    return `${baseCode}${yearStr}${semester}`
  } else if (year) {
    const yearStr = year.toString().slice(-2)
    return `${baseCode}${yearStr}`
  }
  
  return baseCode
}
