<script setup>
import { ref } from 'vue'
import { 
  HomeIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  PencilIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                ✨ Repasa+
              </h1>
            </NuxtLink>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="nav-link">
              <HomeIcon class="w-5 h-5 mr-2" />
              Inicio
            </NuxtLink>
            <NuxtLink to="/calendario" class="nav-link">
              <CalendarIcon class="w-5 h-5 mr-2" />
              Calendario
            </NuxtLink>
            <NuxtLink to="/asignaturas" class="nav-link">
              <BookOpenIcon class="w-5 h-5 mr-2" />
              Asignaturas
            </NuxtLink>
            <NuxtLink to="/ejercicios" class="nav-link">
              <PencilIcon class="w-5 h-5 mr-2" />
              Ejercicios
            </NuxtLink>
            <NuxtLink to="/progreso" class="nav-link">
              <ChartBarIcon class="w-5 h-5 mr-2" />
              Progreso
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn">
              <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
              <XMarkIcon v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t">
          <NuxtLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <HomeIcon class="w-5 h-5 mr-3" />
            Inicio
          </NuxtLink>
          <NuxtLink to="/calendario" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <CalendarIcon class="w-5 h-5 mr-3" />
            Calendario
          </NuxtLink>
          <NuxtLink to="/asignaturas" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <BookOpenIcon class="w-5 h-5 mr-3" />
            Asignaturas
          </NuxtLink>
          <NuxtLink to="/ejercicios" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <PencilIcon class="w-5 h-5 mr-3" />
            Ejercicios
          </NuxtLink>
          <NuxtLink to="/progreso" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <ChartBarIcon class="w-5 h-5 mr-3" />
            Progreso
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot name="header"/>
      <slot name="main"/>
      <slot name="footer"/>
    </main>
  </div>
</template>

<style>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
  transition: all 200ms;
}

.nav-link:hover {
  color: rgb(37 99 235);
  background-color: rgb(243 244 246);
}

.dark .nav-link {
  color: rgb(209 213 219);
}

.dark .nav-link:hover {
  color: rgb(96 165 250);
  background-color: rgb(55 65 81);
}

.nav-link.router-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
}

.dark .nav-link.router-link-active {
  color: rgb(96 165 250);
  background-color: rgba(30 58 138, 0.2);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgb(55 65 81);
  transition: all 200ms;
  width: 100%;
}

.mobile-nav-link:hover {
  color: rgb(37 99 235);
  background-color: rgb(243 244 246);
}

.dark .mobile-nav-link {
  color: rgb(209 213 219);
}

.dark .mobile-nav-link:hover {
  color: rgb(96 165 250);
  background-color: rgb(55 65 81);
}

.mobile-nav-link.router-link-active {
  color: rgb(37 99 235);
  background-color: rgb(239 246 255);
}

.dark .mobile-nav-link.router-link-active {
  color: rgb(96 165 250);
  background-color: rgba(30 58 138, 0.2);
}

.mobile-menu-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: rgb(75 85 99);
  transition: all 200ms;
}

.mobile-menu-btn:hover {
  color: rgb(17 24 39);
  background-color: rgb(243 244 246);
}

.dark .mobile-menu-btn {
  color: rgb(156 163 175);
}

.dark .mobile-menu-btn:hover {
  color: rgb(255 255 255);
  background-color: rgb(55 65 81);
}

.mobile-menu-btn:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgb(59 130 246);
}
</style>