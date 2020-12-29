<template>
  <div class="cesium-index">
    <!-- <Cesium></Cesium> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Cesium from '@/components/cesium/index.vue' // @ is an alias to /src

export default defineComponent({
  name: 'CesiumIndex',
  components: {
    // HelloWorld
    // Cesium
  }
})
</script>

<style lang="scss">
@import "@/styles/cesiumIndex.scss"
</style>
