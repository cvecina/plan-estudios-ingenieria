// Ejemplos y pruebas para la función generateSubjectCode
import { generateSubjectCode, generateShortCode, generateFormattedCode } from './generateSubjectCode.js'

console.log('=== PRUEBAS DE GENERACIÓN DE CÓDIGOS DE ASIGNATURA ===\n')

// Pruebas básicas
console.log('📚 Pruebas básicas:')
console.log('Matemáticas Avanzadas ->', generateSubjectCode('Matemáticas Avanzadas'))
console.log('Programación Orientada a Objetos ->', generateSubjectCode('Programación Orientada a Objetos'))
console.log('Física ->', generateSubjectCode('Física'))
console.log('Introducción a la Ingeniería de Software ->', generateSubjectCode('Introducción a la Ingeniería de Software'))
console.log('Base de Datos ->', generateSubjectCode('Base de Datos'))
console.log('Álgebra Lineal ->', generateSubjectCode('Álgebra Lineal'))
console.log('Cálculo Diferencial e Integral ->', generateSubjectCode('Cálculo Diferencial e Integral'))
console.log('Estructuras de Datos y Algoritmos ->', generateSubjectCode('Estructuras de Datos y Algoritmos'))

console.log('\n🔤 Pruebas con caracteres especiales:')
console.log('Diseño de Interfaces Gráficas ->', generateSubjectCode('Diseño de Interfaces Gráficas'))
console.log('Análisis y Diseño de Sistemas ->', generateSubjectCode('Análisis y Diseño de Sistemas'))
console.log('Redes de Computadoras ->', generateSubjectCode('Redes de Computadoras'))

console.log('\n🔄 Pruebas con duplicados:')
const existingCodes = ['MAT', 'FIS', 'PROG']
console.log('Matemáticas (con MAT existente) ->', generateSubjectCode('Matemáticas', existingCodes))
console.log('Física (con FIS existente) ->', generateSubjectCode('Física', existingCodes))
console.log('Programación (con PROG existente) ->', generateSubjectCode('Programación', existingCodes))

console.log('\n📝 Códigos cortos:')
console.log('Matemáticas ->', generateShortCode('Matemáticas'))
console.log('Programación Orientada a Objetos ->', generateShortCode('Programación Orientada a Objetos'))
console.log('Base de Datos ->', generateShortCode('Base de Datos'))

console.log('\n📅 Códigos con formato (año/semestre):')
console.log('Matemáticas 2024 S1 ->', generateFormattedCode('Matemáticas', 2024, 1))
console.log('Programación 2024 S2 ->', generateFormattedCode('Programación', 2024, 2))
console.log('Física 2024 ->', generateFormattedCode('Física', 2024))

console.log('\n🧪 Casos especiales:')
console.log('Texto vacío ->', generateSubjectCode(''))
console.log('Solo espacios ->', generateSubjectCode('   '))
console.log('Una letra ->', generateSubjectCode('A'))
console.log('Números ->', generateSubjectCode('Matemáticas 101'))
console.log('Palabras muy cortas ->', generateSubjectCode('La de el en'))

// Ejemplos específicos de ingeniería
console.log('\n🏗️ Ejemplos específicos de ingeniería:')
const asignaturasIngenieria = [
  'Iniciación a las matemáticas para la ingeniería',
  'Fundamentos de Programación',
  'Sistemas Operativos',
  'Arquitectura de Computadores',
  'Ingeniería de Software',
  'Teoría de la Computación',
  'Inteligencia Artificial',
  'Desarrollo Web',
  'Bases de Datos Avanzadas',
  'Seguridad Informática',
  'Computación Gráfica',
  'Redes y Comunicaciones'
]

asignaturasIngenieria.forEach(asignatura => {
  console.log(`${asignatura} -> ${generateSubjectCode(asignatura)}`)
})

console.log('\n✅ Pruebas completadas!')
