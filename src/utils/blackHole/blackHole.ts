class BlackHole {
  // constructor(configuration: BlackHoleConfiguration);

  constructor (configuration: BlackHoleConfiguration) {
    window.Module = {
      canvas: (function () {
        const canvas = document.getElementById(configuration.container) as HTMLCanvasElement
        return canvas
      })()
    }

    this.configuration = configuration

    this.initEngine()

    this.createScript('/lib/BlackHole/RealBIMWeb.js', 'RealBIMWeb')
    this.createScript('/lib/BlackHole/ReUtility.js', 'ReUtility')

    // 图形窗口改变时，需实时传递给引擎，否则模型会变形
    window.onresize = () => {
      /* eslint-disable */
      window.g_re_em_window_width = window.innerWidth
      window.g_re_em_window_height = window.innerHeight
      /* eslint-disable */
    }

    // 刷新页面时需要卸载GPU内存
    window.onbeforeunload = (event: Event) => {
      if (typeof window.GLctx !== 'undefined') {
        if (window.GLctx.getExtension('WEBGL_lose_context') !== null) {
          window.GLctx.getExtension('WEBGL_lose_context').loseContext()
        }
      }
    }

    window.onunload = (event: Event) => {
      if (typeof window.GLctx !== 'undefined') {
        if (window.GLctx.getExtension('WEBGL_lose_context') !== null) {
          window.GLctx.getExtension('WEBGL_lose_context').loseContext()
        }
      }
    }
  }

  /**
   * 初始化引擎的配置
   */
  private configuration: BlackHoleConfiguration

  public destroyEngine = () => {
    if (typeof window.GLctx !== 'undefined') {
      if (window.GLctx.getExtension('WEBGL_lose_context') !== null) {
        window.GLctx.getExtension('WEBGL_lose_context').loseContext()
      }
    }
    this.removeScript('RealBIMWeb')
    this.removeScript('ReUtility')
    window.location.reload();
  }

  private createScript (src: string, id: string) {
    const script = document.createElement('script')
    script.setAttribute('async', 'async')
    script.src = src
    script.setAttribute('id', id)
    const body = document.querySelector('body') as HTMLBodyElement
    body.append(script)
  }

  private removeScript (id: string) {
    const element = document.getElementById(id)
    element && document.removeChild(element)
  }

  private initEngine () {
    document.addEventListener('RealEngineReady', this.RealBIMInitSys)
    document.addEventListener('RealBIMInitSys', this.RealBIMLoadMainSce)
    document.addEventListener('RealBIMLoadMainSce', this.MainSceDown)
    document.addEventListener('RealEngineRenderReady', this.showCanvas)

    if ((typeof window.g_re_em_window_width !== 'undefined') && (typeof window.g_re_em_window_height !== 'undefined')) {
      // console.log('(typeof g_re_em_window_width != 'undefined') && (typeof g_re_em_window_height != 'undefined')')
      this.RealBIMInitSys()
    }
  }

  private RealBIMInitSys = () => {
    const workerjspath = 'lib/blackHole/RealBIMWeb_Worker.js'
    const width = window.innerWidth
    const height = window.innerHeight
    const commonurl = this.configuration.commonUrl || "http://rdcimen.hdec.com:8089/default.aspx?dir=url_res02&path=res_gol001";
    const username = 'rongdongpq'
    const password = 'ecidi2020'
    window.REinitSys(workerjspath, width, height, commonurl, username, password)
  }

  // 引擎初始化完成
  private RealBIMLoadMainSce = () => {
    const crs116 =
      'PROJCS["CGCS2000_3_Degree_GK_CM_116E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",116.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]';
    window.REsetEngineWorldCRS(crs116)
    window.REaddGeoCoord("WGS84","EPSG:4326")
    const projInfo: BlackHoleProjInfo[] = [
      // {
      //   projName: 'pro01',
      //   urlRes: 'http://10.218.50.236:17000/AutoConvertNew/EngineRes/RequestEngineRes?dir=url_res02&path=',
      //   projResName: 'res_jifang',
      //   useNewVer: true,
      //   verInfo: 0,
      //   useTransInfo: true,
      //   transInfo: [[1, 1, 1], [0, 0, 0, 1], [200, 0, 0]],
      //   loadDist: 100,
      //   unLoadDist: 500
      // },
      // {
      //   projName: 'pro02',
      //   urlRes: 'http://10.218.50.236:17000/AutoConvertNew/EngineRes/RequestEngineRes?dir=url_res02&path=',
      //   projResName: 'eb4ff6cb57814d78aa2980b3f75a9cc1',
      //   useNewVer: true,
      //   verInfo: 0,
      //   useTransInfo: false,
      //   // loadDist: 1000,
      //   // unLoadDist: 5000
      // },
      {
        projName: 'pro01',
        urlRes: 'http://10.218.50.236:17000/AutoConvertNew/EngineRes/RequestEngineRes?dir=url_res02&path=',
        projResName: '0303ae932371417a9ae5c8200a0dc986',
        useNewVer: true,
        verInfo: 0,
        useTransInfo: false,
        // loadDist: 10,
        // unLoadDist: 500
      }
    ]
    window.REloadMainSce_projs(projInfo)
    // 设置全局渲染性能控制参数
    window.REsetMaxResMemMB(5500)
    window.REsetExpectMaxInstMemMB(4500)
    window.REsetExpectMaxInstDrawFaceNum(50000000)
    window.REsetPageLoadLev(2)
  }

  // 场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
  private MainSceDown = () => {
    // window.REsetMainSceAutoLoadDist('image', 1000, 5000)
  }

  // canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
  private showCanvas = () => {
    window.Module.canvas.style.display = 'block'
    window.Module.canvas.focus()
  }
}

export default BlackHole
