<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {onMounted} from "vue";

onMounted(() => {
  console.log('component load')
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
