<template>
  <div class="blackhole-view">
    <canvas
      id="BlackHole"
      ref="BlackHole"
      oncontextmenu="event.preventDefault()"
      tabindex="1"
      class="emscripten"
    ></canvas>
  </div>
</template>

<script lang="ts">
import BlackHole from '@/utils/blackHole/blackHole'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BlackHoleView',

  mounted () {
    const configuration = {
      container: 'BlackHole'
    }
    window.BlackHoleInstance = new BlackHole(configuration)
  },

  beforeUnmount () {
    window.BlackHoleInstance.destroyEngine()
  }
})
</script>
