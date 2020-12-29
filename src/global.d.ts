// import CesiumJs from "./utils/cesium/cesium";

declare interface Window {
  CesiumConfiguration: CesiumConfiguration;
  Cesium: Cesium;
  cesiumInstance: CesiumJs;
}

interface CesiumConfiguration {
  container: string = "";
}