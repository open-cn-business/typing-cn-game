<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PinYinBlock',
  setup() {
    const message = ref('this is in canvas');

    function render() {
      console.log('render called');
    }

    return { message, render };
  }
});
</script>
<template>
  <div>
    <p>{{ message }}</p>
  </div>
</template>