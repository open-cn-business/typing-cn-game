<script lang="ts">
import {defineComponent, defineEmits, getCurrentInstance, onMounted, ref} from 'vue';
import {PinYinTypingBlock} from "@/components/core/PinYinTypingBlock";

const emits = defineEmits(['finished', 'typeError', 'typeSuccess']);

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
    let typingBlock: PinYinTypingBlock;
    let ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement;
    const createPinYinTypingBlock = (ping: string, word: string):PinYinTypingBlock => {
      const block = new PinYinTypingBlock(ping, word);
      block.setFinishedEvent(() => {
        const eventData = {};
        emit('finished', eventData);
      });
      block.setTypeSuccessEvent((key) => {
        const eventData = {key};
        emit('typeSuccess', eventData);
      });
      block.setTypeErrorEvent((expect: string, actual: string) => {
        const eventData = {expect, actual};
        emit('typeError', eventData);
      });
      return block;
    };

    let x = 0, y = 0;
    onMounted(() => {
      typingBlock = createPinYinTypingBlock(props.pinyin, props.word);
      canvas = (instance?.refs.canvas as HTMLCanvasElement);
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(typingBlock.canvas, x, y);
      }
    });

    function append(char: string) {
      typingBlock.append(char);
      ctx.clearRect(x, y, typingBlock.canvas.width, typingBlock.canvas.height);
      ctx.drawImage(typingBlock.canvas, x, y);
    }

    function render(word: string = props.word, pinyin: string = props.pinyin, xPo?: number, yPo?: number) {
      ctx.clearRect(x, y, typingBlock.canvas.width, typingBlock.canvas.height);
      typingBlock = createPinYinTypingBlock(pinyin, word);
      if (xPo && yPo) {
        ctx.drawImage(typingBlock.canvas, xPo, yPo);
        x = xPo;
        y = yPo;
      }else {
        x = Math.random() * (canvas.width - typingBlock.canvas.width);
        y = Math.random() * (canvas.height - typingBlock.canvas.height);
        ctx.drawImage(typingBlock.canvas, x, y);
      }
    }

    return {render, append};
  }
});
</script>
<template>
  <div class="container">
    <canvas ref="canvas" width="900" height="500"></canvas>
  </div>
</template>
<style>
.container {
  background-color: transparent;
  border: 1px solid black;
}

</style>