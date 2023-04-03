<script setup lang="ts">

import AudioButton from "@/components/base/AudioButton.vue";
</script>

<template>
  <div class="greetings">
    <h1 class="green" style="font-family: 'Comic Sans MS', 'Ma Shan Zheng', sans-serif">打字游戏</h1>
    <h5 class="green" style="font-family: 'Comic Sans MS', 'Ma Shan Zheng', sans-serif;">Typing Game</h5>
    <AudioButton class="mar" delay="100" audio-url="/typing-cn-game/music/menuClick.mp3" text="开始游戏" url="./game"/>
  </div>
</template>

<style scoped>
.mar{
  margin-top: 50px;
}


h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.greetings h1,
.greetings h3,h5 {
  text-align: center;
}


</style>
