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

<script>
import BlackHole from '@/utils/blackHole/blackHole.ts'
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'

export default defineComponent({
  name: 'BlackHoleView',

  setup () {
    onMounted(() => {
      const configuration = {
        container: 'BlackHole'
      }
      window.BlackHoleInstance = new BlackHole(configuration)
      // constructorBlackhole(configuration)
    })

    onBeforeUnmount(() => {
      // window.BlackHoleInstance.destroyEngine()
    })
  }
})
</script>
