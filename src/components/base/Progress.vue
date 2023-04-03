<template>
  <div class="progress-bar">
    <div class="progress-bar-inner" :style="{ width: progressBarWidth }"></div>
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  currentValue: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  maxValue: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  }
})

const progressBarWidth = computed(() => `${(props.currentValue / props.maxValue) * 100}%`)
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 1rem;
  border-radius: 0.5rem;
  background-color: #eee;
  position: relative;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  background-color: #007aff;
  position: absolute;
  top: 0;
  left: 0;
}
.progress-bar {
  position: relative;
  overflow: hidden;
}

.progress-bar:after {
  content: "";
  display: block;
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s ease-out;
  pointer-events: none;
}

.progress-bar:hover:after {
  opacity: 1;
  transform: scale(1);
}

</style>
