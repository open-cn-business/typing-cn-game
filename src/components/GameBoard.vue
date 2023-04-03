<script setup lang="ts">

import {onMounted, onUnmounted, ref} from "vue";
import PinYinBlock from "@/components/PinyinBlock.vue";
import Progress from "@/components/base/Progress.vue";
import type {WordMetaData} from "@/components/core/WordMetaData";
type pinyinCtx = InstanceType<typeof PinYinBlock>;
type KeydownHandler = (event: KeyboardEvent) => void;
let metaData: WordMetaData[] = []
const randomBetween = (a: number, b: number) => {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
const setDic = () => {
  const indices = new Set<number>();
  score.value = 0;
  max.value = 0;
  curIndex = 0;
  curWord.value = 0;
  fetch(`/typing-cn-game/assets/dict-${randomBetween(0, 2)}.json`)
      .then(response => response.json())
      .then(data => {
        while (indices.size < randomBetween(75, 150)) {
          const index = Math.floor(Math.random() * (data.length - 1));
          indices.add(index);
        }
        metaData = [];
        Array.from(indices).forEach((index: number) => {
          metaData.push({pinyin: data[index].pinyin, word: data[index].word, other: data[index]});
        });
        showRestart.value = false;

        max.value = metaData.length;
        curIndex = 0;
        curWord.value = 1;
        childRef.value?.render(metaData[curIndex].word, metaData[curIndex].pinyin);
        wordDefine.value = metaData[curIndex].other.explanation;
        wordFrom.value = metaData[curIndex].other.derivation;
      });
}
const pinyin = ref('');
const word = ref('');
const score = ref(0);
const max = ref(metaData.length);
const curWord = ref(1);
const wordDefine = ref('');
const wordFrom = ref('');
const showRestart = ref(false);
let curIndex = 0;
// const audioContext = new AudioContext();
const typingGood = new Audio('/typing-cn-game/music/typingGood.mp3');
// audioContext.createMediaElementSource(typingGood).connect(audioContext.destination);
const typingBad = new Audio('/typing-cn-game/music/typingBad.mp3');

const childRef = ref<pinyinCtx | null>(null);
const audioRef = ref<HTMLAudioElement>();
function handleClick() {
  console.log('Button clicked!');
}

const handleKeydown: KeydownHandler = (event) => {
  // 处理键盘输入
  console.log('event', event.key);
  if (event.key.length > 1) {
    return;
  }
  const ascii = event.key.charAt(0).charCodeAt(0);
  const isLetter = event.key == ',' || (ascii >= 65 && ascii <= 90) || (ascii >= 97 && ascii <= 122);
  if (!isLetter) {
    return;
  }
  if(typingGood.paused){
    typingGood.play();
  } else{
    typingGood.pause();
    typingGood.play();
  }
  childRef.value?.append(event.key.toLowerCase());
}

const onFinished = (data: any) => {
  // 处理键盘输入
  console.log('finished', data);
  score.value += 3 * metaData[curIndex].word.length;
  curIndex++;
  if (curIndex == metaData.length) {
    showRestart.value = true;
    return;
  }
  curWord.value = curIndex + 1;
  childRef.value?.render(metaData[curIndex].word, metaData[curIndex].pinyin);
  console.log('zzq see', metaData[curIndex].other);
  wordDefine.value = metaData[curIndex].other.explanation;
  wordFrom.value = metaData[curIndex].other.derivation;
}

const onTypeError = (data: any) => {
  typingBad.play();
};

const onTypeSuccess = (data: any) => {
  console.log('success', data.key);
  typingGood.play();
};


onMounted(() => {
  setDic();
  setTimeout(() => {
    document.addEventListener('click', () => {
      audioRef.value?.play();
    }, { once: false })
  }, 1000);
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="con">
    <div class="top-bar">
      <div>
        <h1 style="font-family: 'Ma Shan Zheng';">分数: {{score}}</h1>
      </div>
      <div style="flex: 1"></div>
      <div v-if="showRestart" class="again" @click="setDic">
        再来一次
      </div>
      <div>
        <h2 style="font-family: 'Ma Shan Zheng';margin-top: 6px">{{curWord}} / {{metaData.length}}</h2>
      </div>
    </div>
    <Progress class="progress" :current-value="curWord" :max-value="max"></Progress>
    <audio autoplay loop ref="audioRef" src="/typing-cn-game/music/gameMusic.mp3"></audio>
    <pin-yin-block
        @finished="onFinished"
        @typeSuccess="onTypeSuccess"
        @type-error="onTypeError"
        :pinyin="pinyin"
        :word="word"
        ref="childRef"
    />
    <h2 style="color: hsla(160, 100%, 37%, 1);" class="cnFont">释义：{{wordDefine}}</h2>
    <div class="cnFont">出处：{{wordFrom}}</div>
  </div>
</template>
<style>
.top-bar {
  margin-top: 30px;
  display: flex;
  flex-direction: row;;
}
.con {
  margin-left: 50px;
  margin-right: 50px;
}
.progress {
  margin-top: 10px;
  margin-bottom: 10px;
}
.cnFont{
  font-family: 'Ma Shan Zheng';
}
.again {
  color: #000;
  font-family: 'Ma Shan Zheng';
  border: 2px solid hsla(160, 100%, 37%, 1);
  padding: 2px;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #888;
  height: 30px;
  margin-top: 5px;
  margin-right: 16px;
  cursor: pointer;
  transform: all 0.3s;

}

.again:hover {
  border: hsla(160, 100%, 47%, 1);
  color: #000;
}
</style>
