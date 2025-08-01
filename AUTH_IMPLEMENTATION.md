# 🔐 Sistema de Autenticación - Repasa+

## 📋 Resumen de Implementación

Se ha implementado un **sistema completo de autenticación** que separa todos los datos por usuario. Los usuarios ahora deben registrarse/iniciar sesión para acceder a la aplicación.

## 🚀 Características Implementadas

### ✅ **Autenticación**
- **Login y Registro**: Páginas completas con validación
- **Sesiones persistentes**: Los datos del usuario se guardan en localStorage
- **Middleware de protección**: Redirección automática a login si no está autenticado
- **Logout**: Funcionalidad completa con limpieza de sesión

### ✅ **Separación por Usuario**
- **Todas las queries filtran por usuario**: Asignaturas, cursos, entregas, notas
- **Datos aislados**: Cada usuario solo ve sus propios datos
- **ID de usuario dinámico**: Se usa el usuario autenticado en todas las operaciones

### ✅ **UI/UX Mejorada**
- **Información del usuario en la navegación**: Nombre y email visible
- **Menú desplegable con logout**: Fácil acceso al cierre de sesión
- **Loading screen**: Pantalla de carga mientras se inicializa la app
- **Diseño responsive**: Login/registro funcionan en móvil y desktop

---

## 📁 Archivos Creados/Modificados

### 🆕 **Archivos Nuevos**
```
middleware/auth.global.ts          # Middleware de autenticación global
stores/auth.store.js               # Store de Pinia para manejo de autenticación
pages/login.vue                    # Página de login con modo toggle login/registro
pages/register.vue                 # Página de registro independiente
components/AppLoading.vue          # Componente de loading
plugins/auth.client.ts             # Plugin para inicializar auth en cliente
```

### 🔄 **Archivos Modificados**
```
layouts/default.vue                # + Menu usuario, + Logout
app.vue                            # + Loading screen, + Inicialización auth
composables/useConvexData.ts       # + getCurrentUserId()

# Todas las páginas actualizadas para usar usuario autenticado:
pages/index.vue                    # Dashboard principal
pages/asignaturas/index.vue        # Lista de asignaturas
pages/asignaturas/[id].vue         # Detalle de asignatura
pages/cursos/index.vue             # Lista de cursos
pages/cursos/[id].vue              # Detalle de curso
pages/notas/[id].vue               # Editor de notas
```

---

## 🔧 Cómo Funciona

### **1. Flujo de Autenticación**
```
Usuario no autenticado → /login → Login/Registro → Dashboard (/)
Usuario autenticado → Acceso directo a cualquier página
```

### **2. Separación de Datos**
- **Antes**: `usuarioId: DEFAULT_USER_ID` (usuario fijo)
- **Ahora**: `usuarioId: getCurrentUserId()` (usuario dinámico)

### **3. Persistencia**
- **localStorage**: `auth_token` y `user_data`
- **Inicialización automática**: Al cargar la app se recupera la sesión

---

## 🎯 Uso Para el Usuario

### **Primer Uso**
1. Ir a `http://localhost:3004`
2. Se redirige automáticamente a `/login`
3. **Crear cuenta nueva** o **iniciar sesión**
4. Acceso completo a la aplicación

### **Funcionalidades**
- **Crear asignaturas, cursos, notas**: Todo separado por usuario
- **Datos privados**: Cada usuario solo ve sus propios datos
- **Sesión persistente**: Al cerrar y abrir el navegador, sigue logueado
- **Logout**: Botón en la navegación para cerrar sesión

---

## 🔮 Próximos Pasos Sugeridos

### **🔐 Autenticación Real con Convex**
```javascript
// TODO: Reemplazar simulación con Convex Auth
// En stores/auth.store.js líneas 42 y 79
await convex.mutation('auth:login', { email, password })
await convex.mutation('auth:register', { name, email, password })
```

### **👥 Manejo de Usuarios en Convex**
- Crear tabla `users` en el schema
- Implementar mutations de auth reales
- Hash de contraseñas con bcrypt

### **🔒 Seguridad Adicional**
- Tokens JWT reales
- Refresh tokens
- Rate limiting
- Validación de email

### **✨ Mejoras de UX**
- Recordar sesión por X días
- Recuperación de contraseña
- Perfil de usuario editable
- Avatar/foto de perfil

---

## 🚨 Importante

**Estado Actual**: Sistema funcional con **simulación de autenticación**
- Las credenciales se validan localmente
- Los datos se guardan en localStorage
- **Ideal para desarrollo y testing**

**Para Producción**: Integrar con sistema de auth real (Convex Auth, Auth0, etc.)

---

## 🎉 ¡Listo para Usar!

La aplicación ahora tiene **login completo** y **separación por usuario**. Cada usuario tendrá su propio espacio de trabajo privado con sus asignaturas, cursos y progreso personal.

**Servidor**: `http://localhost:3004`
**Login**: Se redirige automáticamente
**Registro**: Disponible desde la página de login
