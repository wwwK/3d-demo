// 初始化的时候必须先获取canvas实例对象，然后才可调用引擎相关接口
var Module = {
  canvas: (function() {
    var canvas = document.getElementById('canvas');
    return canvas;
  })()
}
// 页面加载时添加相关监听事件
window.onload = function(event){
  document.addEventListener("RealEngineReady", RealBIMInitSys);
  document.addEventListener("RealBIMInitSys", RealBIMLoadMainSce);
  document.addEventListener("RealBIMLoadMainSce", MainSceDown);
  document.addEventListener("RealEngineRenderReady", showCanvas);
  document.addEventListener("RealBIMSelModel",function(e){console.log(e.detail.button)});
  document.addEventListener("RealBIMUIEvent", function(e){console.log(e.detail.btnname,e.detail.btnstate)});
  document.addEventListener("RealBIMLoadProgress", function(e){LoadingProgress(e.detail.progress,e.detail.info);});
  if((typeof g_re_em_window_width != 'undefined') && (typeof g_re_em_window_height != 'undefined')){
    console.log("(typeof g_re_em_window_width != 'undefined') && (typeof g_re_em_window_height != 'undefined')");
    RealBIMInitSys();
  }
}
//图形窗口改变时，需实时传递给引擎，否则模型会变形
window.onresize = function(event){
  g_re_em_window_width = window.innerWidth; 
  g_re_em_window_height = window.innerHeight;
}
// 刷新页面时需要卸载GPU内存
window.onbeforeunload = function(event){ 
  if(typeof GLctx != 'undefined'){
    if(GLctx.getExtension('WEBGL_lose_context') != null){
      GLctx.getExtension('WEBGL_lose_context').loseContext();
    }
  }  
};
window.onunload = function(event){   
  if(typeof GLctx != 'undefined'){
    if(GLctx.getExtension('WEBGL_lose_context') != null){
      GLctx.getExtension('WEBGL_lose_context').loseContext();
    }
  } 
};
//场景初始化，需正确传递相关参数
function RealBIMInitSys(){
  console.log("Listen RealEngineReady!");
  document.getElementById('loading').style.display="block";
  var workerjspath = "javascript/RealBIMWeb_Worker.js";
  var width = window.innerWidth; var height = window.innerHeight;
  var commonurl = "http://bingjiang.f3322.net:8008/default.aspx?dir=url_res02&path=res_gol001";
  var username = "admin"; var password = "xiyangyang"; 
  REinitSys(workerjspath,width,height,commonurl,username,password);
}
//canvas图形窗口默认黑色背景，页面初始设置为不显示，图形窗口开始渲染模型再显示
function showCanvas(){
  console.log("addEventListener RealEngineRenderReady!");
  document.getElementById('canvas').style.display="block";
  Module.canvas.focus();
}
//初始化完成后，同时加载两个项目，第一个设置了偏移值
function RealBIMLoadMainSce(){
  console.log("Listen RealBIMInitSys!");
  var projInfo = [
            {
              "projName":"pro01",
              "urlRes":"http://bingjiang.f3322.net:8008/default.aspx?dir=url_res02&path=",
              "projResName":"res_jifang",
              "useNewVer":true,
              "verInfo":0,
              "useTransInfo":true,
              "transInfo":[[1,1,1],[0,0,0,1],[200,0,0]],
              loadDist: 100,
              unloadDist: 500
            },{
              "projName":"pro02",
              "urlRes":"http://bingjiang.f3322.net:8008/default.aspx?dir=url_res02&path=",
              "projResName":"res_nanhuiskp",
              "useNewVer":true,
              "verInfo":0,
              "useTransInfo":false,
              "transInfo":"",
              loadDist: 1000,
              unloadDist: 5000
            },
            {
              "projName":"image",
              "urlRes":"http://bingjiang.f3322.net:8008/default.aspx?dir=url_res02&path=",
              "projResName":"eb4ff6cb57814d78aa2980b3f75a9cc1",
              "useNewVer":true,
              "verInfo":0,
              "useTransInfo":false,
              "transInfo":"",
              loadDist: 1000,
              unloadDist: 5000
            }
         ];
  REloadMainSce_projs(projInfo);
  // 设置全局渲染性能控制参数
  REsetMaxResMemMB(5500);
  REsetExpectMaxInstMemMB(4500);
  REsetExpectMaxInstDrawFaceNum(50000000);
  REsetPageLoadLev(2);
}
//场景模型加载完成，此时可浏览完整模型，所有和模型相关的操作只能在场景加载完成后执行
function MainSceDown(){
  console.log("Listen RealBIMLoadMainSce!");
  projUnverSceToHeight();
}

// 以下为加载进度条的示例代码，仅供参考
/*旋转进度条@param percent需要转动的百分比*/
function processBarRotate(percent){
    var processBarHalfMove = '.processBarHalfMove';
    var processBarHalfLeft = '.processBarHalfLeft';
    var processBarHalfRight = '.processBarHalfRight';
    //---按角度转动
    function barRotate(angle){
        $(processBarHalfMove).css('transform', 'rotate(' + angle + 'deg)');
    }
    var angle = 3.6 * percent + 90;
    //小于50度，直接转到目标角度
    if ( percent <= 50 ){
        barRotate(angle);
    }
    //大于50度，则先转到一半，等事件结束
    else{
        barRotate(angle); //完成剩余的角度
        $(processBarHalfLeft).addClass('not-display');
        $(processBarHalfRight).removeClass('not-display');
    }
}
function LoadingProgress(percent,info){
  processBarRotate(percent);
  document.getElementById('processpercent').innerText=percent;
  document.getElementById('loadinginfo').innerText=info;
  if(percent==100){
    document.getElementById('loading').style.display="none";
  }
}

// 添加带牵引线的锚点
function maodian(){
  var ancinfo =[
                {
                  "ancname":"anc01", 
                  "pos":[548.182, -96.179, 22.964],
                  "picpath":"http://bingjiang.f3322.net:8008/test/css/img/tag.png",
                  "textinfo":"未拆迁",
                  "picwidth":32,
                  "picheight":32,
                  "uselod":true,
                  "linepos":[0,100],
                  "lineclr":0xff0000ff,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
                  "ancsize":60
                },{
                  "ancname":"anc02", 
                  "pos":[602.8, -76.481, 30.164],
                  "picpath":"http://bingjiang.f3322.net:8008/test/css/img/tag.png",
                  "textinfo":"已拆迁",
                  "picwidth":32,
                  "picheight":32,
                  "uselod":true,
                  "linepos":[0,50],
                  "lineclr":0xff00ff00,  //十六进制，顺序为ABGR(RGBA倒过来，表示透明度A和颜色BGR)
                  "ancsize":60
                 }
               ];
  REaddAnchors(ancinfo);
}
// 设置锚点聚合,锚点数量多的时候效果比较明显
function anchortest(){
  var lodLevel = 4;
  var useCustomBV = false;
  var customBV = [];
  var mergedist = 300;
  var minMergeNum = 10;
  var strMergeTexPath = "http://bingjiang.f3322.net:8008/test/css/img/anclod.png";
  var texWidth = 64;
  var texHeight = 64;
  REsetAnchorLODInfo(lodLevel,useCustomBV,customBV,mergedist,minMergeNum,strMergeTexPath,texWidth,texHeight)
}

// 添加文字对象示例
function addText(){
  REcreateCustomTextShp("text01","提示文字",[393,-130,-3.5], "",0xff000000,0xff00ffff,100000);
}
// 添加多段线对象示例
function addLine(){
  REcreateCustomPolyline("line01",[[393,-130,-3.5],[562,-130,-3.5],[620,-130,-3.5]],0xff000000,100000);
}
// 添加矢量面对象示例
function addRgn(){
  RECreateCustomPolyRgn("rgn01",[[467,-1.3,-3.5],[450,-125,-3.5],[645,-127,-3.5]],0xff0000ff,100000);
}

// 设置模型的加载/卸载距离
function setloaddist(){
  REsetMainSceAutoLoadDist("",1000,1200);
}

// 设置地形的高程投影到平面上
function projUnverSceToHeight(){
  // REprojUnVerHugeGroupToHeight("pro02","<hugemodel><test>_unver",2,0);
  // REprojUnVerHugeGroupToHeight("pro01","<hugemodel><test>_unver",2,0);
}
