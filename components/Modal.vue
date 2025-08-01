<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button @click="closeModal" class="modal-close-btn">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.dark .modal-container {
  background-color: rgb(31 41 55);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid rgb(229 231 235);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
}

.dark .modal-header {
  border-bottom-color: rgb(75 85 99);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.dark .modal-title {
  color: white;
}

.modal-close-btn {
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: rgb(107 114 128);
  transition: all 200ms;
}

.modal-close-btn:hover {
  color: rgb(55 65 81);
  background-color: rgb(243 244 246);
}

.dark .modal-close-btn {
  color: rgb(156 163 175);
}

.dark .modal-close-btn:hover {
  color: rgb(209 213 219);
  background-color: rgb(55 65 81);
}

.modal-body {
  padding: 0 1.5rem 1.5rem 1.5rem;
}
</style>
