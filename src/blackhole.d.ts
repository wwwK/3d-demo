declare interface Window {
  BlackHoleInstance: BlackHole;
  Module: Module;
  /**
   * 进行引擎的初始化
   */
  REinitSys: (
    strWorkerjsPath: string,
    uWidth: string | number,
    uHeight: string | number,
    strCommonUrl: string,
    strUserName: string,
    strPassWord: string
  ) => {};
  g_re_em_window_width: number;
  g_re_em_window_height: number;
  GLctx: any;
  REloadMainSce_projs: (projInfo: BlackHoleProjInfo[]) => {};
  REsetMaxResMemMB: (memory: number) => {};
  REsetExpectMaxInstMemMB: (memory: number) => {};
  REsetExpectMaxInstDrawFaceNum: (drawFace: number) => {};
  REsetPageLoadLev: (level: number = 2) => {};
  REsetMainSceAutoLoadDist: (projName: string, loadDist: number, unLoadDist: number) => {};
  REsetEngineWorldCRS: Function;
  REaddGeoCoord: Function;
}

interface Module {
  canvas: HTMLCanvasElement;
}

interface BlackHoleConfiguration {
  container: string;
  commonUrl?: string;
  modelUrl?: string;
  loadingId?: string;
}

interface BlackHoleProjInfo {
  projName: string;
  urlRes: string;
  projResName: string;
  useNewVer: boolean = true;
  verInfo?: string | number;
  useTransInfo: boolean = false;
  transInfo?: number[][];
  loadDist?: number;
  unLoadDist?: number;
}
