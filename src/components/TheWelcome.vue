<script setup lang="ts">

import {ref} from "vue";
import PinYinBlock from "@/components/PinyinBlock.vue";
type pinyinCtx = InstanceType<typeof PinYinBlock>;

const pinyin = ref('xin xin xiang rong');
const word = ref('欣欣向荣');

const childRef = ref<pinyinCtx | null>(null);
function handleClick() {
  console.log('Button clicked!');
  childRef.value?.render();
}

</script>

<template>
  <div>
    <p>拼音: {{ pinyin }}</p>
    <input v-model="pinyin" placeholder="xin xin xiang rong" />
    <p>汉字: {{ word }}</p>
    <input v-model="word" placeholder="欣欣向荣" />
    <button @click="handleClick">Generate</button>

    <pin-yin-block :pinyin="pinyin" :word="word" ref="childRef"/>
  </div>
</template>
