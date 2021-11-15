<template>
  <div class="cesium-index">
    <Cesium :value="content"></Cesium>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Cesium from '@/components/cesium/index.vue' // @ is an alias to /src

export default defineComponent({
  name: 'CesiumIndex',
  components: {
    // HelloWorld
    Cesium
  },
  setup () {
    const content = ref('test')
  }
})
</script>

<style lang="scss">
@import "@/styles/cesiumIndex.scss"
</style>
