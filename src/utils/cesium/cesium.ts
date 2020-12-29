const Cesium = window.Cesium

class CesiumJs {
  constructor (configuration: CesiumConfiguration) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NjUzMDNhYi1mYmJiLTRiZWItYjFiNi02M2E0NDNmZTA4NWQiLCJpZCI6NDAwMzQsImlhdCI6MTYwODE5NzExMn0.n_dyLELdM4N_zQ5EmDmd5SibRtTXs-Gzx0765kYTC5c'
    this.viewer = new Cesium.Viewer(configuration.container, {
      terrainProvider: Cesium.createWorldTerrain()
    })

    const buildingTileset = this.viewer.scene.primitives.add(Cesium.createOsmBuildings())
  }

  private viewer: Cesium.Viewer
}

export default CesiumJs
