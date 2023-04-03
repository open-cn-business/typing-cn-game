<script lang="ts">
import {defineComponent, defineEmits, getCurrentInstance, onMounted, ref} from 'vue';
import {PinYinTypingBlock} from "@/components/core/PinYinTypingBlock";

const emits = defineEmits(['finished', 'typeError']);

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

    onMounted(() => {
      typingBlock = new PinYinTypingBlock(props.pinyin, props.word);
      typingBlock.setFinishedEvent(() => {
        const eventData = {};
        emit('finished', eventData);
      });
      typingBlock.setTypeErrorEvent((expect: string, actual: string) => {
        const eventData = {expect, actual};
        emit('typeError', eventData);
      });
      console.log('zzq see ', typingBlock.canvas.toDataURL());
      canvas = (instance?.refs.canvas as HTMLCanvasElement);
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(typingBlock.canvas, 0, 0);
        console.log('zzq see ', typingBlock.canvas);
      }
    });

    function append(char: string) {
      typingBlock.append(char);
      ctx.drawImage(typingBlock.canvas, 0, 0);
    }

    function render() {
      ctx.clearRect( 0, 0, typingBlock.canvas.width, typingBlock.canvas.height);
      typingBlock = new PinYinTypingBlock(props.pinyin, props.word);
      ctx.drawImage(typingBlock.canvas, 0, 0);
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