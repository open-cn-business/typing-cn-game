<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, ref} from 'vue';

interface Props {
  pinyin: string;
  word: string;
}

class Letter {
  constructor(public char: string, public color: string) {}
}

class WordCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  distance = 20;
  pinyinMarginLeft = 0;

  constructor(public word: string, public letters: Letter[], public fontSize: number, public cnWord: string) {
    console.log('write cn word ', cnWord);
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.font = `${this.fontSize}px 'Comic Sans MS', 'Ma Shan Zheng', sans-serif`;
    this.ctx.textBaseline = 'middle';
    const letterWidth = this.ctx.measureText(this.word).width;
    const wordWidth = this.ctx.measureText(this.cnWord).width;
    this.canvas.width = Math.max.apply(null, [letterWidth, wordWidth]);
    this.pinyinMarginLeft = (this.canvas.width - letterWidth) / 2;
    console.log(`${word}.with = ${this.canvas.width}`);
    const oneLineHeight = this.fontSize * 1.5;
    this.canvas.height = oneLineHeight * 2 + this.distance;
    this.ctx.font = `${this.fontSize}px 'Comic Sans MS', 'Ma Shan Zheng', sans-serif`;
    this.ctx.textBaseline = 'middle';
    this.letters.forEach((letter, index) => {
      this.ctx.fillStyle = letter.color;
      const xp = this.getLetterXPosition(index);
      const yp = oneLineHeight / 2;
      console.log(`write ${letter.char} from x is ${xp}`)
      this.ctx.fillText(letter.char, xp, yp);
    });

    this.ctx.fillText(cnWord, (this.canvas.width - wordWidth) / 2, oneLineHeight + this.distance);
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
  setup(props) {
    const instance = getCurrentInstance();
    let ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement;
    function render() {
      console.log('render called');
      if (ctx && canvas) {
        draw(ctx, canvas);
      }
    }

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      console.log('pin yin width', ctx.measureText(props.pinyin).width)
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
        const letters = word.split('').map(char => new Letter(char, '#000'));
        const wordCanvas = new WordCanvas(word, letters, fontSize, cnWord);
        ctx.drawImage(wordCanvas.canvas, x, 20);
        x += wordCanvas.canvas.width + 20;
        console.log(`x = ${x}`);
      }

      ctx.font = '30px \'Comic Sans MS\', \'Ma Shan Zheng\', Arial';
      ctx.fillStyle = '#000';
    };

    onMounted(() => {
      canvas = (instance?.refs.canvas as HTMLCanvasElement);
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      // 开始绘制
      draw(ctx, canvas);
    });

    return {word: props.word, pinyin: props.pinyin, render };
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