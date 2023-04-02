<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import PinYinBlock from "@/components/PinyinBlock.vue";
type pinyinCtx = InstanceType<typeof PinYinBlock>;
type KeydownHandler = (event: KeyboardEvent) => void;

const pinyin = ref('si wu ji dan');
const word = ref('肆无忌惮');

const childRef = ref<pinyinCtx | null>(null);
function handleClick() {
  console.log('Button clicked!');
  childRef.value?.render();
}

const handleKeydown: KeydownHandler = (event) => {
  // 处理键盘输入
  console.log('event', event.key);
  childRef.value?.append(event.key);
}

const onFinished = (data: any) => {
  // 处理键盘输入
  console.log('finished', data);
}


onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <p>拼音: {{ pinyin }}</p>
    <input v-model="pinyin" placeholder="xin xin xiang rong" />
    <p>汉字: {{ word }}</p>
    <input v-model="word" placeholder="欣欣向荣" />
    <button @click="handleClick">Generate</button>

    <pin-yin-block @finished="onFinished" :pinyin="pinyin" :word="word" ref="childRef"/>
  </div>
</template>
