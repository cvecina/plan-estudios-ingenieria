# ✨ Repasa+ - Tu Compañero de Estudios

Una aplicación web moderna para organizar y gestionar tu carrera universitaria en Ingeniería Informática. Diseñada para ser tu compañero perfecto durante todos los años de estudio.

## ✨ Características Principales

### 🎯 Dashboard Principal
- **Vista general** de tu progreso académico
- **Estadísticas** en tiempo real (asignaturas, entregas, horas de estudio)
- **Actividad reciente** y próximos pasos
- **Acceso rápido** a todas las funcionalidades

### 📅 Sistema de Calendario
- **Planificación** de entregas y exámenes
- **Vista mensual y semanal** adaptable
- **Recordatorios** automáticos
- **Organización por asignaturas** con códigos de color

### 📖 Gestión de Asignaturas
- **Información completa** de cada materia (profesor, créditos, descripción)
- **Seguimiento de progreso** individual
- **Gestión de entregas** y tareas
- **Sistema de notas** y apuntes
- **Recursos** y enlaces útiles
- **Horarios** de clases y laboratorios

### ✏️ Sistema de Ejercicios
- **Banco de ejercicios** organizados por materia
- **Niveles de dificultad** (fácil, intermedio, difícil)
- **Seguimiento de progreso** y puntuaciones
- **Soluciones** y explicaciones
- **Filtros** por estado y asignatura

### 📊 Seguimiento de Progreso
- **Estadísticas detalladas** de rendimiento
- **Análisis de hábitos** de estudio
- **Objetivos** personalizables con seguimiento
- **Logros** y reconocimientos
- **Tiempo de estudio** por asignatura

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [Nuxt 3](https://nuxt.com/) - Framework Vue.js
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Iconos**: [Heroicons](https://heroicons.com/)
- **Estado**: [Pinia](https://pinia.vuejs.org/) - Store management
- **Internacionalización**: [Nuxt i18n](https://i18n.nuxtjs.org/)
- **Utilidades**: [VueUse](https://vueuse.org/)
- **Fechas**: [Moment.js](https://momentjs.com/)

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos de instalación

1. **Instalar dependencias**
```bash
pnpm install
```

2. **Iniciar servidor de desarrollo**
```bash
pnpm dev
```

3. **Abrir en el navegador**
```
http://localhost:3000
```

### Scripts disponibles

```bash
# Desarrollo
pnpm dev

# Construcción para producción
pnpm build

# Vista previa de producción
pnpm preview

# Generar sitio estático
pnpm generate
```

## 📱 Características de Diseño

### 🌓 Modo Oscuro
- Soporte completo para tema claro y oscuro
- Cambio automático según preferencias del sistema
- Transiciones suaves entre temas

### 📱 Responsive Design
- **Diseño móvil-first** completamente responsive
- **Navegación adaptativa** con menú hamburguesa en móvil
- **Componentes optimizados** para todas las pantallas
- **Interacciones táctiles** mejoradas

## 🗂️ Estructura del Proyecto

```
plan-estudios-ingenieria/
├── assets/               # Recursos estáticos (CSS, imágenes)
├── components/           # Componentes reutilizables
├── layouts/             # Layouts de página
├── pages/               # Rutas de la aplicación
│   ├── index.vue       # Dashboard principal
│   ├── calendario.vue  # Sistema de calendario
│   ├── asignaturas.vue # Gestión de asignaturas
│   ├── ejercicios.vue  # Sistema de ejercicios
│   └── progreso.vue    # Seguimiento de progreso
├── stores/             # Estado global (Pinia)
├── utils/              # Utilidades y helpers
├── locales/            # Archivos de traducción
└── nuxt.config.ts      # Configuración de Nuxt
```

## 🎨 Funcionalidades Destacadas

### Gestión Inteligente de Asignaturas
- Cada asignatura tiene su propio espacio de trabajo
- Sistema de colores para identificación rápida
- Tracking automático de progreso y horas de estudio

### Calendario Interactivo
- Vista mensual y semanal
- Eventos organizados por tipo (entregas, exámenes, clases)
- Recordatorios automáticos

### Sistema de Ejercicios
- Biblioteca personal de ejercicios
- Clasificación por dificultad y materia
- Seguimiento de progreso y puntuaciones

### Dashboard Inteligente
- Resumen visual del progreso académico
- Próximas entregas y eventos importantes
- Estadísticas de estudio en tiempo real

## 📊 Funcionalidades de Datos

### 💾 Persistencia Local
- Los datos se guardan automáticamente en el navegador
- No se requiere conexión a internet para uso básico
- Estado persistente entre sesiones

## 🚀 Próximas Mejoras

- **Integración con Convex** para sincronización en la nube
- **Sistema de notificaciones** push
- **Modo offline** completo
- **Exportación** de datos y reportes
- **Integración** con calendarios externos

---

⭐ **¡Perfecto para estudiantes de Ingeniería Informática!** ⭐

> **Repasa+** - Una herramienta completa para organizar tu carrera universitaria con todas las funcionalidades que necesitas.
      :editar="editarEvento"
      :remove="eliminarEvento"
      :totalData="eventosStore.totalData"
      :limit="eventosStore.limit"
      :isActive="true"
      :offset="eventosStore.offset"
      @cambiarPagina="cambiarPagina($event)"
      @cambiarEstadoUser="checkEstadoCambiar"
    >
      <template #zona__izquierda>
        <Buscador @buscarDatos="buscarDatos" />
      </template>
      <template #zona__derecha>
        <button class="boton__empresa p-2 m-2 rounded" @click="insertEvent">
          Insertar
        </button>
      </template>
    </TablaDefault>

// campos tabla ejemplo
const camposTabla = [
[
            { campo: "id", tipo: "text", visible: false, label: "ID", activo: true },
            { campo: "dias_activo", tipo: "text", contar: true, subformat: "array", visible: true, label: "Días", activo: true },
            { campo: "disabled", tipo: "text", formato: "bool", visible: false, label: "Disabled", activo: true },
            { campo: "periodo", tipo: "text", visible: true, label: "Periodo", activo: true },
            { campo: "segundos", formato: "minutos", tipo: "text", visible: true, label: "Duración", activo: true },
            { campo: "tipo_envio", tipo: "text", visible: true, label: "Envío", activo: true },
            { campo: "createdAt", tipo: "text", formato: "datetime", visible: true, label: "Momento", activo: false },
            { campo: "eventos_por_dia", tipo: "text", contar: true, subformat: "array", visible: true, label: "Eventos por día", activo: true },
            { campo: "festivos", tipo: "text", subformat: "array", contar: true, visible: true, label: "Festivos", activo: true },
        ]
];
```

Como se puede observar, hay un template en medio del form. se puede añadir como #extra un template ya que hay ```<slots>``` dentro.

## Ejemplo de uso Formulario dinámico
Hay props obligatorios:
- titulo
- camposFormulario
- store
- buttonsFormulario

```javascript
 <FormularioDinamico
      titulo="Insertar video"
      :camposFormulario="camposForm"
      :store="videosStore.new"
      :buttonsFormulario="buttonsFormulario"
    >
      <template #extra>
        <VideoUploader />
      </template>
    </FormularioDinamico>

// campos form
const camposForm = [
{
    campo_bbdd: "nombre",
    tipo: "text",
    placeholder: "Nombre",
  },
  {
    campo_bbdd: "descripcion",
    tipo: "text",
    placeholder: "Descripción",
  }
];

// store
// en este caso, al usar pinia, se llama a videosStore.new

// buttonsFormulario

// se pueden pasar actions que sean arrowFunction dentro del mismo componente, o se puede ejecutar directamente.
const buttonsFormulario = [
  { text: "Insertar vídeo", action: insertar },
  { text: "Cerrar", action: () => router.push("/admin/videos") },
];
```

Como se puede observar, hay un template en medio del form. se puede añadir como #extra un template ya que hay ```<slots>``` dentro.

## Roadmap

Here’s a glimpse into the exciting journey ahead for our project:

### Próximamente

- **2024 - general**: 
  - [Acabar readme.md]: Terminar toda la documentación.
  - [Repasar bugs y añadir funciones que faltan]: Revisar y testear.

- **2025**: 
  - [Añadir filtros en servidor]: Poder filtrar datos en servidor y mejorar la paginación.
  - [Añadir hoja de estilos default]: Se espera poder tener en 2025 un estilo homogéneo para toda la base web reutilizable.

We’re excited about what’s coming and will keep you updated as we progress. Your feedback and support are crucial as we build the future!

## Changelog

- **v1.0.0** (07-10-2024): Initial release.

## Contacto

Para cualquier duda:

- **Email**: [cvecinav@gmail.com]

Espero que sirva como introducción al template :)