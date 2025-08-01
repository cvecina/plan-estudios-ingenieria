import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tabla de usuarios
  usuarios: defineTable({
    nombre: v.string(),
    email: v.string(),
    preferencias: v.optional(v.object({
      tema: v.optional(v.string()), // "light" | "dark"
      idioma: v.optional(v.string()), // "es" | "en"
      notificaciones: v.optional(v.boolean()),
    })),
    horasEstudioTotales: v.optional(v.number()),
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_email", ["email"]),

  // Tabla de cursos
  cursos: defineTable({
    usuarioId: v.id("usuarios"),
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    fechaInicio: v.string(),
    fechaFin: v.string(),
    color: v.string(),
    estado: v.string(), // "activo", "completado", "pausado"
    fechaCreacion: v.string(),
  })
    .index("by_usuario", ["usuarioId"]),

  // Tabla de asignaturas
  asignaturas: defineTable({
    usuarioId: v.id("usuarios"),
    cursoId: v.optional(v.id("cursos")), // Opcional para compatibilidad con asignaturas existentes
    nombre: v.string(),
    codigo: v.string(),
    profesor: v.string(),
    creditos: v.number(),
    color: v.string(), // "blue", "green", "purple", etc.
    descripcion: v.optional(v.string()),
    progreso: v.number(), // 0-100
    horasEstudio: v.optional(v.number()),
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_usuario_codigo", ["usuarioId", "codigo"]),

  // Tabla de entregas/tareas/exámenes
  entregas: defineTable({
    usuarioId: v.id("usuarios"),
    asignaturaId: v.id("asignaturas"),
    titulo: v.string(),
    descripcion: v.optional(v.string()),
    tipo: v.string(), // "tarea", "examen", "practica", "proyecto"
    fechaEntrega: v.number(),
    prioridad: v.string(), // "baja", "media", "alta"
    estado: v.string(), // "pendiente", "en_progreso", "completada", "vencida"
    puntuacion: v.optional(v.number()),
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_asignatura", ["asignaturaId"])
    .index("by_usuario_estado", ["usuarioId", "estado"])
    .index("by_fecha_entrega", ["fechaEntrega"]),

  // Tabla de notas/apuntes
  notas: defineTable({
    usuarioId: v.id("usuarios"),
    asignaturaId: v.id("asignaturas"),
    titulo: v.string(),
    contenido: v.string(),
    etiquetas: v.optional(v.array(v.string())),
    esPublica: v.optional(v.boolean()),
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_asignatura", ["asignaturaId"])
    .index("by_usuario_asignatura", ["usuarioId", "asignaturaId"]),

  // Tabla de ejercicios
  ejercicios: defineTable({
    usuarioId: v.id("usuarios"),
    asignaturaId: v.id("asignaturas"),
    titulo: v.string(),
    descripcion: v.optional(v.string()),
    contenido: v.string(),
    solucion: v.optional(v.string()),
    dificultad: v.string(), // "facil", "medio", "dificil"
    tiempoEstimado: v.number(), // en minutos
    estado: v.string(), // "pendiente", "completado"
    puntuacion: v.optional(v.number()),
    totalPreguntas: v.optional(v.number()),
    preguntasCompletadas: v.optional(v.number()),
    esFavorito: v.optional(v.boolean()),
    fechaCreacion: v.number(),
    fechaUltimoIntento: v.optional(v.number()),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_asignatura", ["asignaturaId"])
    .index("by_usuario_estado", ["usuarioId", "estado"])
    .index("by_dificultad", ["dificultad"]),

  // Tabla de eventos del calendario
  eventos: defineTable({
    usuarioId: v.id("usuarios"),
    asignaturaId: v.optional(v.id("asignaturas")),
    titulo: v.string(),
    descripcion: v.optional(v.string()),
    fechaInicio: v.number(),
    fechaFin: v.optional(v.number()),
    tipo: v.string(), // "entrega", "examen", "clase", "estudio", "otro"
    ubicacion: v.optional(v.string()),
    recordatorio: v.optional(v.number()), // minutos antes del evento
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_fecha", ["fechaInicio"])
    .index("by_usuario_tipo", ["usuarioId", "tipo"])
    .index("by_asignatura", ["asignaturaId"]),

  // Tabla de objetivos/metas
  objetivos: defineTable({
    usuarioId: v.id("usuarios"),
    titulo: v.string(),
    descripcion: v.optional(v.string()),
    fechaVencimiento: v.optional(v.number()),
    estado: v.string(), // "activo", "completado", "pausado", "cancelado"
    progreso: v.number(), // 0-100
    categoria: v.optional(v.string()), // "estudio", "ejercicios", "entregas", "general"
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_usuario_estado", ["usuarioId", "estado"]),

  // Tabla de sesiones de estudio
  sesionesEstudio: defineTable({
    usuarioId: v.id("usuarios"),
    asignaturaId: v.optional(v.id("asignaturas")),
    duracion: v.number(), // en minutos
    fechaInicio: v.number(),
    fechaFin: v.number(),
    notas: v.optional(v.string()),
    productividad: v.optional(v.number()), // 1-5
    fechaCreacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_asignatura", ["asignaturaId"])
    .index("by_fecha", ["fechaInicio"]),

  // Tabla de recursos/materiales
  recursos: defineTable({
    usuarioId: v.id("usuarios"),
    asignaturaId: v.id("asignaturas"),
    titulo: v.string(),
    descripcion: v.optional(v.string()),
    tipo: v.string(), // "enlace", "archivo", "video", "libro", "otro"
    url: v.optional(v.string()),
    etiquetas: v.optional(v.array(v.string())),
    esFavorito: v.optional(v.boolean()),
    fechaCreacion: v.number(),
    fechaActualizacion: v.number(),
  })
    .index("by_usuario", ["usuarioId"])
    .index("by_asignatura", ["asignaturaId"])
    .index("by_tipo", ["tipo"]),
});
