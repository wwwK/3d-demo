<template>
  <div class="blackhole-index">
    <BlackHoleView></BlackHoleView>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import BlackHoleView from '@/components/blackHole/index.vue'

export default defineComponent({
  name: 'BlackHole',
  components: {
    BlackHoleView
  }
})
</script>
