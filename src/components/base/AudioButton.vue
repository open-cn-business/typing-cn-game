<template>
  <div>
    <a href="#" class="start-game-link" @click.prevent="delayedRedirect">
      <span style="font-family: 'Ma Shan Zheng'">{{ text }}</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { defineProps } from 'vue'
const props = defineProps<{
  text: string,
  url: string,
  audioUrl: string,
  delay: number
}>()

const router = useRouter();

function delayedRedirect() {
  play();
  setTimeout(() => {
    router.push(props.url);
  }, props.delay);
}
function play() {
  new Audio(props.audioUrl).play();
}

</script>
<style>
.start-game-link {
  display: inline-block;
  padding: 3px 20px;
  border: 2px solid #fff;
  border-radius: 5px;
  text-decoration: none;
  font-size: 20px;
  color: #DAA520;
  background-color: transparent;
  transition: all 0.3s ease-in-out;
  margin-top: 15px;
}

.start-game-link:hover {
  background-color: #fff;
  color: #000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>