<template>
  <div id='cesiumContainer'></div>
</template>

<script lang="ts">
import CesiumJs from '@/utils/cesium/cesium'
import { defineComponent, onMounted } from 'vue'
import { getKeyData } from '@/utils/utils'

export default defineComponent({
  name: 'Cesium',

  props: {
    value: {
      default: ''
    }
  },

  setup (context, props) {
    onMounted(() => {
      window.cesiumInstance = new CesiumJs(
        {
          container: 'cesiumContainer'
        }
      )
      const nu = getKeyData(3, [3, 1, 3, 3, 5, 4, 5])
      console.log('this is 3 st nu', nu)
    })
  }
})
</script>
