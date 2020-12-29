<template>
  <div id='cesiumContainer'></div>
</template>

<script lang="ts">
import CesiumJs from '@/utils/cesium/cesium'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Cesium',

  setup () {
    console.log('this is component setup')
  },

  mounted () {
    console.log('this is componnet mounted')
    window.cesiumInstance = new CesiumJs(
      {
        container: 'cesiumContainer'
      }
    )
  }
})
</script>
