<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <div
          class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center"
        >
          <span class="text-xl font-bold text-white">R+</span>
        </div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          {{ isLoginMode ? "Inicia sesión" : "Crea tu cuenta" }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ isLoginMode ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?" }}
          <button
            @click="toggleMode"
            class="font-medium text-blue-600 hover:text-blue-500 ml-1"
          >
            {{ isLoginMode ? "Regístrate aquí" : "Inicia sesión aquí" }}
          </button>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Campo Nombre (solo en registro) -->
          <div v-if="!isLoginMode">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre completo
            </label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Tu nombre completo"
            />
          </div>

          <!-- Campo Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="tu@email.com"
            />
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            />
          </div>

          <!-- Campo Confirmar Contraseña (solo en registro) -->
          <div v-if="!isLoginMode">
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Mostrar errores -->
        <div
          v-if="authStore.error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
        >
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                {{ authStore.error }}
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.isLoading" class="mr-2">
              <!-- Loading spinner -->
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{
              authStore.isLoading
                ? "Cargando..."
                : isLoginMode
                ? "Iniciar sesión"
                : "Crear cuenta"
            }}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <div class="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Al {{ isLoginMode ? "iniciar sesión" : "registrarte" }} aceptas
            nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Configurar la página como pública
definePageMeta({
  auth: false,
});

// Configurar SEO
useHead({
  title: "Login - Repasa+",
  meta: [
    {
      name: "description",
      content:
        "Inicia sesión en Repasa+ para gestionar tus estudios universitarios",
    },
  ],
});

const authStore = useAuthStore();
const isLoginMode = ref(true);

// Formulario reactivo
const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Métodos
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  authStore.clearError();
  // Limpiar formulario
  form.value = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
};

const validateForm = () => {
  if (!form.value.email || !form.value.password) {
    return "Todos los campos son obligatorios";
  }

  if (form.value.password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }

  if (!isLoginMode.value) {
    if (!form.value.name) {
      return "El nombre es obligatorio";
    }
    if (form.value.password !== form.value.confirmPassword) {
      return "Las contraseñas no coinciden";
    }
  }

  return null;
};

const handleSubmit = async () => {
  const error = validateForm();
  if (error) {
    authStore.error = error;
    return;
  }

  authStore.clearError();

  let result;
  if (isLoginMode.value) {
    result = await authStore.login(form.value.email, form.value.password);
  } else {
    result = await authStore.register(
      form.value.name,
      form.value.email,
      form.value.password
    );
  }

  if (result.success) {
    await navigateTo("/");
  }
};

// Store inicializado por el plugin
// onMounted(() => {
//   // Solo inicializar si no hay errores
//   try {
//     authStore.init();
//   } catch (error) {
//     console.error('Error initializing auth store:', error);
//   }
// });
</script>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
