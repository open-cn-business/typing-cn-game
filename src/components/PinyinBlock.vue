<script lang="ts">
import {defineComponent, defineEmits, getCurrentInstance, onMounted, ref} from 'vue';

interface Props {
  pinyin: string;
  word: string;
}

class Letter {
  constructor(public char: string, public color: string) {}
}
class WordCanvasContainer{
  constructor(public canvas: WordCanvas, public x: number, public y: number) {
  }

  reset(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.canvas.canvas, this.x, this.y);
  }

  clear(ctx: CanvasRenderingContext2D){
    ctx.clearRect(this.x, this.y, this.canvas.canvas.width, this.canvas.canvas.height);
  }
}
class WordCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  distance = 20;
  pinyinMarginLeft = 0;

  greenColor = 'hsla(160, 100%, 37%, 1)';


  makeAllGreen(){
    this.letters.forEach((letter, index) => {
      letter.color = this.greenColor;
    });
    this.cnWord.color = this.greenColor;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();
  }
  makeCharGreen(index: number){
    this.letters[index].color = this.greenColor;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();
  }

  makeCharRed(index: number){
    this.letters[index].color = 'red';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();
  }

  private render(){
    this.ctx.font = `${this.fontSize}px 'Comic Sans MS', 'Ma Shan Zheng', sans-serif`;
    this.ctx.textBaseline = 'middle';
    const letterWidth = this.ctx.measureText(this.word).width;
    const wordWidth = this.ctx.measureText(this.cnWord.char).width;
    this.canvas.width = Math.max.apply(null, [letterWidth, wordWidth]);
    this.pinyinMarginLeft = (this.canvas.width - letterWidth) / 2;
    const oneLineHeight = this.fontSize * 1.5;
    this.canvas.height = oneLineHeight * 2 + this.distance;
    this.ctx.font = `${this.fontSize}px 'Comic Sans MS', 'Ma Shan Zheng', sans-serif`;
    this.ctx.textBaseline = 'middle';
    this.letters.forEach((letter, index) => {
      this.ctx.fillStyle = letter.color;
      const xp = this.getLetterXPosition(index);
      const yp = oneLineHeight / 2;
      this.ctx.fillText(letter.char, xp, yp);
    });
    this.ctx.fillStyle = this.cnWord.color;
    this.ctx.fillText(this.cnWord.char, (this.canvas.width - wordWidth) / 2, oneLineHeight + this.distance);
  }

  constructor(public word: string, public letters: Letter[], public fontSize: number, public cnWord: Letter) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.render();
  }

  getLetterXPosition(index: number): number {
    let x = this.pinyinMarginLeft;
    for (let i = 0; i < index; i++) {
      x += this.ctx.measureText(this.letters[i].char).width;
    }
    return x;
  }
}
//
// class WordChunk{
//   canvas: HTMLCanvasElement;
//   ctx: CanvasRenderingContext2D;
//
//   constructor(public letter: Letter[], public word: string) {}
// }

const emits = defineEmits(['finished']);

export default defineComponent({
  name: 'PinYinBlock',
  props: {
    word: {
      type: String,
      default: ''
    },
    pinyin: {
      type: String,
      default: ''
    }
  },
  setup(props, {emit}) {
    const instance = getCurrentInstance();
    let childCanvasArray: WordCanvasContainer[] = [];
    let charArr: string[][] = [];
    let waitForInput = '';
    let currentWordIndex = 0;
    let charIndexInWord = 0;
    let ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement;
    function append(key: string) {
      if (ctx && canvas) {
        const curCanvas = childCanvasArray[currentWordIndex];
        if (!curCanvas) {
          return;
        }
        let curWord = charArr[currentWordIndex];
        curCanvas.clear(ctx);
        if (key == waitForInput) {
          if (curWord.length === (charIndexInWord + 1)){
            // all green
            curCanvas.canvas.makeAllGreen();
            currentWordIndex++;
            charIndexInWord = 0;
            curWord = charArr[currentWordIndex];
            if (currentWordIndex == charArr.length) {
              finishedEvent();
            }else {
              waitForInput = curWord[charIndexInWord];
            }
          }else {
            // char green
            curCanvas.canvas.makeCharGreen(charIndexInWord);
            charIndexInWord++;
            waitForInput = curWord[charIndexInWord];
          }

        }else {
          curCanvas.canvas.makeCharRed(charIndexInWord);
        }
        curCanvas.reset(ctx);
      }
    }

    function render(){
      if (ctx && canvas) {
        childCanvasArray = [];
        currentWordIndex = 0;
        charIndexInWord = 0;
        charArr = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw(ctx, canvas);
      }
    }

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 30;
      const words = props.pinyin.split(' ');
      const words2 = props.word.split('');
      let x = 10;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const cnWord = words2[i];
        const letters = word.split('').map(char => new Letter(char, 'grey'));
        charArr = [...charArr, word.split('')];
        const wordCanvas = new WordCanvas(word, letters, fontSize, {char: cnWord, color: 'grey'});
        childCanvasArray.push(new WordCanvasContainer(wordCanvas, x, 20));
        ctx.drawImage(wordCanvas.canvas, x, 20);
        x += wordCanvas.canvas.width + 20;
      }
      waitForInput = charArr[0][0];

      ctx.font = '30px \'Comic Sans MS\', \'Ma Shan Zheng\', Arial';
      ctx.fillStyle = '#000';
    };

    onMounted(() => {
      canvas = (instance?.refs.canvas as HTMLCanvasElement);
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      // 开始绘制
      draw(ctx, canvas);
    });

    function finishedEvent() {
      const eventData = {};
      emit('finished', eventData);
    }

    return {render, append};
  }
});
</script>
<template>
  <div class="container">
    <canvas ref="canvas" width="400" height="300"></canvas>
  </div>
</template>
<style>
.container {
  background-color: transparent;
  border: 1px solid black;
}

</style>