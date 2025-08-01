import { mutation } from "./_generated/server";

export const llenarDatosEjemplo = mutation({
  args: {},
  handler: async (ctx) => {
    // Verificar si ya existen datos
    const usuariosExistentes = await ctx.db.query("usuarios").first();
    if (usuariosExistentes) {
      return "Los datos ya existen";
    }

    const ahora = Date.now();

    // Crear usuario de ejemplo
    const usuarioId = await ctx.db.insert("usuarios", {
      nombre: "Estudiante de Prueba",
      email: "estudiante@ejemplo.com",
      preferencias: {
        tema: "light",
        idioma: "es",
        notificaciones: true,
      },
      horasEstudioTotales: 73,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    // Crear asignaturas de ejemplo
    const asignatura1Id = await ctx.db.insert("asignaturas", {
      usuarioId: usuarioId,
      nombre: "Programación I",
      codigo: "PROG001",
      profesor: "Dr. García",
      creditos: 6,
      color: "blue",
      descripcion: "Introducción a la programación con Python. Conceptos fundamentales, estructuras de datos básicas y paradigmas de programación.",
      progreso: 65,
      horasEstudio: 35,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    const asignatura2Id = await ctx.db.insert("asignaturas", {
      usuarioId: usuarioId,
      nombre: "Matemáticas I",
      codigo: "MATH001",
      profesor: "Dra. López",
      creditos: 6,
      color: "green",
      descripcion: "Cálculo diferencial e integral. Fundamentos matemáticos para la ingeniería.",
      progreso: 45,
      horasEstudio: 30,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    const asignatura3Id = await ctx.db.insert("asignaturas", {
      usuarioId: usuarioId,
      nombre: "Física I",
      codigo: "PHYS001",
      profesor: "Dr. Martínez",
      creditos: 6,
      color: "purple",
      descripcion: "Mecánica clásica, ondas y termodinámica. Fundamentos físicos aplicados a la ingeniería.",
      progreso: 30,
      horasEstudio: 18,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    // Crear entregas de ejemplo
    await ctx.db.insert("entregas", {
      usuarioId: usuarioId,
      asignaturaId: asignatura1Id,
      titulo: "Práctica 1: Variables y Tipos",
      descripcion: "Ejercicios básicos de variables y tipos de datos en Python",
      tipo: "practica",
      fechaEntrega: new Date("2025-08-15").getTime(),
      prioridad: "media",
      estado: "completada",
      puntuacion: 8.5,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    await ctx.db.insert("entregas", {
      usuarioId: usuarioId,
      asignaturaId: asignatura1Id,
      titulo: "Práctica 2: Estructuras de Control",
      descripcion: "Implementación de bucles y condicionales",
      tipo: "practica",
      fechaEntrega: new Date("2025-08-22").getTime(),
      prioridad: "media",
      estado: "pendiente",
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    await ctx.db.insert("entregas", {
      usuarioId: usuarioId,
      asignaturaId: asignatura2Id,
      titulo: "Ejercicios de Derivadas",
      descripcion: "Práctica de derivadas y sus aplicaciones",
      tipo: "tarea",
      fechaEntrega: new Date("2025-08-20").getTime(),
      prioridad: "alta",
      estado: "pendiente",
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    // Crear notas de ejemplo
    await ctx.db.insert("notas", {
      usuarioId: usuarioId,
      asignaturaId: asignatura1Id,
      titulo: "Apuntes Clase 1",
      contenido: "Variables en Python:\n- int: números enteros\n- float: números decimales\n- str: cadenas de texto\n- bool: verdadero/falso\n\nOperadores básicos:\n- Aritméticos: +, -, *, /, //, %, **\n- Comparación: ==, !=, <, >, <=, >=\n- Lógicos: and, or, not",
      etiquetas: ["python", "variables", "tipos"],
      esPublica: false,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    await ctx.db.insert("notas", {
      usuarioId: usuarioId,
      asignaturaId: asignatura2Id,
      titulo: "Fórmulas de Derivadas",
      contenido: "Reglas básicas de derivación:\n\n1. Regla de la potencia: d/dx(x^n) = n*x^(n-1)\n2. Regla de la suma: d/dx(f+g) = f' + g'\n3. Regla del producto: d/dx(f*g) = f'*g + f*g'\n4. Regla del cociente: d/dx(f/g) = (f'*g - f*g')/g²\n5. Regla de la cadena: d/dx(f(g(x))) = f'(g(x))*g'(x)",
      etiquetas: ["matemáticas", "derivadas", "fórmulas"],
      esPublica: false,
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    // Crear ejercicios de ejemplo
    await ctx.db.insert("ejercicios", {
      usuarioId: usuarioId,
      asignaturaId: asignatura1Id,
      titulo: "Ejercicios de Bucles",
      descripcion: "Practica el uso de bucles for y while en Python",
      contenido: "1. Crear un programa que imprima los números del 1 al 100\n2. Calcular la suma de números pares entre 1 y 50\n3. Crear un programa que pida números hasta que se ingrese 0",
      solucion: "# Solución 1\nfor i in range(1, 101):\n    print(i)\n\n# Solución 2\nsuma = sum(i for i in range(2, 51, 2))\nprint(suma)\n\n# Solución 3\nwhile True:\n    num = int(input('Ingresa un número (0 para salir): '))\n    if num == 0:\n        break\n    print(f'Ingresaste: {num}')",
      dificultad: "medio",
      tiempoEstimado: 45,
      estado: "completado",
      puntuacion: 85,
      totalPreguntas: 3,
      preguntasCompletadas: 3,
      esFavorito: true,
      fechaCreacion: ahora,
      fechaUltimoIntento: ahora - 86400000, // hace 1 día
    });

    await ctx.db.insert("ejercicios", {
      usuarioId: usuarioId,
      asignaturaId: asignatura2Id,
      titulo: "Derivadas Básicas",
      descripcion: "Ejercicios fundamentales de derivación",
      contenido: "Calcula las derivadas de las siguientes funciones:\n1. f(x) = 3x² + 2x - 1\n2. f(x) = sin(x) + cos(x)\n3. f(x) = e^x * ln(x)",
      solucion: "1. f'(x) = 6x + 2\n2. f'(x) = cos(x) - sin(x)\n3. f'(x) = e^x * ln(x) + e^x/x",
      dificultad: "facil",
      tiempoEstimado: 30,
      estado: "pendiente",
      totalPreguntas: 3,
      preguntasCompletadas: 0,
      esFavorito: false,
      fechaCreacion: ahora,
    });

    // Crear eventos del calendario
    await ctx.db.insert("eventos", {
      usuarioId: usuarioId,
      asignaturaId: asignatura1Id,
      titulo: "Entrega Práctica 1",
      descripcion: "Primera práctica de programación",
      fechaInicio: new Date("2025-08-15T23:59").getTime(),
      tipo: "entrega",
      recordatorio: 1440, // 24 horas antes
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    await ctx.db.insert("eventos", {
      usuarioId: usuarioId,
      asignaturaId: asignatura2Id,
      titulo: "Examen Parcial",
      descripcion: "Parcial de derivadas e integrales",
      fechaInicio: new Date("2025-08-20T10:00").getTime(),
      fechaFin: new Date("2025-08-20T12:00").getTime(),
      tipo: "examen",
      ubicacion: "Aula 101",
      recordatorio: 720, // 12 horas antes
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    // Crear objetivos
    await ctx.db.insert("objetivos", {
      usuarioId: usuarioId,
      titulo: "Completar todas las prácticas de Programación",
      descripcion: "Entregar las 12 prácticas del cuatrimestre",
      fechaVencimiento: new Date("2025-12-15").getTime(),
      estado: "activo",
      progreso: 67,
      categoria: "entregas",
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    await ctx.db.insert("objetivos", {
      usuarioId: usuarioId,
      titulo: "Estudiar 100 horas este cuatrimestre",
      descripcion: "Meta de tiempo de estudio para el cuatrimestre",
      fechaVencimiento: new Date("2025-12-20").getTime(),
      estado: "activo",
      progreso: 73,
      categoria: "estudio",
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    });

    return `Datos de ejemplo creados correctamente. Usuario ID: ${usuarioId}`;
  },
});
