import { mutation, query } from "./_generated/server";

// Listar todas las tablas con datos
export const listarTablas = query({
  args: {},
  handler: async (ctx) => {
    const resultados = {};
    
    // Verificar tablas nuevas (en castellano)
    try {
      const usuarios = await ctx.db.query("usuarios").collect();
      resultados.usuarios = usuarios.length;
    } catch (e) {
      resultados.usuarios = "No existe";
    }
    
    try {
      const asignaturas = await ctx.db.query("asignaturas").collect();
      resultados.asignaturas = asignaturas.length;
    } catch (e) {
      resultados.asignaturas = "No existe";
    }
    
    try {
      const entregas = await ctx.db.query("entregas").collect();
      resultados.entregas = entregas.length;
    } catch (e) {
      resultados.entregas = "No existe";
    }
    
    try {
      const notas = await ctx.db.query("notas").collect();
      resultados.notas = notas.length;
    } catch (e) {
      resultados.notas = "No existe";
    }
    
    // Verificar tablas viejas (en inglés) - estas las queremos eliminar
    try {
      const users = await ctx.db.query("users").collect();
      resultados.users_VIEJA = users.length;
    } catch (e) {
      resultados.users_VIEJA = "No existe";
    }
    
    try {
      const subjects = await ctx.db.query("subjects").collect();
      resultados.subjects_VIEJA = subjects.length;
    } catch (e) {
      resultados.subjects_VIEJA = "No existe";
    }
    
    try {
      const assignments = await ctx.db.query("assignments").collect();
      resultados.assignments_VIEJA = assignments.length;
    } catch (e) {
      resultados.assignments_VIEJA = "No existe";
    }
    
    try {
      const notes = await ctx.db.query("notes").collect();
      resultados.notes_VIEJA = notes.length;
    } catch (e) {
      resultados.notes_VIEJA = "No existe";
    }
    
    try {
      const resources = await ctx.db.query("resources").collect();
      resultados.resources_VIEJA = resources.length;
    } catch (e) {
      resultados.resources_VIEJA = "No existe";
    }
    
    try {
      const schedules = await ctx.db.query("schedules").collect();
      resultados.schedules_VIEJA = schedules.length;
    } catch (e) {
      resultados.schedules_VIEJA = "No existe";
    }
    
    try {
      const studySessions = await ctx.db.query("studySessions").collect();
      resultados.studySessions_VIEJA = studySessions.length;
    } catch (e) {
      resultados.studySessions_VIEJA = "No existe";
    }
    
    try {
      const exercises = await ctx.db.query("exercises").collect();
      resultados.exercises_VIEJA = exercises.length;
    } catch (e) {
      resultados.exercises_VIEJA = "No existe";
    }
    
    try {
      const reminders = await ctx.db.query("reminders").collect();
      resultados.reminders_VIEJA = reminders.length;
    } catch (e) {
      resultados.reminders_VIEJA = "No existe";
    }
    
    try {
      const goals = await ctx.db.query("goals").collect();
      resultados.goals_VIEJA = goals.length;
    } catch (e) {
      resultados.goals_VIEJA = "No existe";
    }
    
    return resultados;
  },
});

// Eliminar TODOS los datos de las tablas viejas
export const limpiarTablasViejas = mutation({
  args: {},
  handler: async (ctx) => {
    const resultados = {};
    let totalEliminados = 0;
    
    // Eliminar todos los datos de tablas viejas
    const tablasViejas = ["users", "subjects", "assignments", "notes", "resources", "schedules", "studySessions", "exercises", "reminders", "goals"];
    
    for (const tabla of tablasViejas) {
      try {
        const registros = await ctx.db.query(tabla as any).collect();
        for (const registro of registros) {
          await ctx.db.delete(registro._id);
          totalEliminados++;
        }
        resultados[tabla] = `${registros.length} registros eliminados`;
      } catch (e) {
        resultados[tabla] = "Tabla no existe o ya está vacía";
      }
    }
    
    return {
      ...resultados,
      totalEliminados,
      mensaje: `Se eliminaron ${totalEliminados} registros de las tablas viejas`
    };
  },
});
