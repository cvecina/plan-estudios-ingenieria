<script setup>
import moment from "moment";
import "moment/dist/locale/es";
moment.locale("es");

// Inicializar store de estudios
const studiesStore = useStudiesStore()
onMounted(() => {
  studiesStore.initializeData()
})
</script>

<template>
  <NuxtLayout>
    <template #header></template>
    <template #main>
      <Toast />
      <NuxtPage />
    </template>
    <template #footer></template>
  </NuxtLayout>
</template>
