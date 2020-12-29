//场景初始化
function REinitSys(strWorkerjsPath,uWidth,uHeight,strCommonUrl,strUserName,strPassWord){
  g_re_em_window_width = uWidth; 
  g_re_em_window_height = uHeight;
  var bool =Module.RealBIMWeb.CreateEmuMgr(strWorkerjsPath,"BlackHole",uWidth, uHeight, 
                                  false, 500, "", strCommonUrl, "/ModuleDir/TempFile/", "/WebCache0001/", 
                                  strUserName, strPassWord);
  return bool;
}

//获取当前js版本
function REgetJsVersion(){
  var ver =Module.RealBIMWeb.GetRealEngineVersion();
  return ver;
}

//设置渲染时引擎最大允许的内存占用空间(以MB为单位)
function REsetMaxResMemMB(val){
  Module.RealBIMWeb.SetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK, val);
}
//获取渲染时引擎最大允许的内存占用空间(以MB为单位)
function REgetMaxResMemMB(){
  var val =Module.RealBIMWeb.GetMaxResMemMB(Module.RE_ResourceMgr_MEM.HUGEMBLOCK);
  return val;
}
//设置渲染时引擎建议分配的内存空间(以MB为单位)
function REsetExpectMaxInstMemMB(val){
  Module.RealBIMWeb.SetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
}
//获取渲染时引擎建议分配的内存空间(以MB为单位)
function REgetExpectMaxInstMemMB(){
  var val =Module.RealBIMWeb.GetExpectMaxInstMemMB(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
  return val;
}
//设置模型每帧最大渲染面数
function REsetExpectMaxInstDrawFaceNum(val){
  Module.RealBIMWeb.SetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL, val);
}
//获取模型每帧最大渲染面数
function REgetExpectMaxInstDrawFaceNum(){
  var val =Module.RealBIMWeb.GetExpectMaxInstDrawFaceNum(Module.RE_SceneMgr_INST_QUOTA.HUGEMODEL);
  return val;
}
//设置页面调度等级
function REsetPageLoadLev(val){
  Module.RealBIMWeb.SetPageLoadLev(val);
}
//获取页面调度等级
function REgetPageLoadLev(){
  var val =Module.RealBIMWeb.GetPageLoadLev();
  return val;
}
//设置每帧允许的最大资源加载总数
function REsetTotalResMaxLoadNum(val){
  if(val==0){
    Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0);
  }else if(val==1){
    Module.RealBIMWeb.SetTotalResMaxLoadNumPerFrame(0xffffffff);
  }
}
//获取每帧允许的最大资源加载总数
function REgetTotalResMaxLoadNum(){
  var val =Module.RealBIMWeb.GetTotalResMaxLoadNumPerFrame();
  return val;
}
//刷新场景数据
function RErefreshMainData(bLoadNewData){
  Module.RealBIMWeb.RefreshMainData(bLoadNewData);
}


//场景加载
function REloadMainSce(strUrlRes,strProjName,uVerInfo){
  var bool =Module.RealBIMWeb.LoadMainSce(strUrlRes, 
                                  "!(DefaultResRootDir)"+strProjName+"/total.xml", 
                                  "!(RealBIMTempFileCache)/cam001.camera", false);
  if(uVerInfo==""){
    ver ={m_sVer0:0x7fffffff, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:0, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
  }else{
    ver ={m_sVer0:uVerInfo, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:0, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
  }
  console.log(ver);
  var verbool =Module.RealBIMWeb.SetSceVersionInfo(ver);
  return bool&&verbool;
}
//多个场景加载
//加载多个场景时，必须以第一个为主场景，加载主场景时会把前边的场景清空
// projInfo = [
//             {
//               "projName":"proj01",
//               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
//               "projResName":"res_test1",
//               "useNewVer":true,
//               "verInfo":0,
//               "useTransInfo":false,
//               "transInfo":"",
//               "loadDist"1000:,>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，绝对值>1e20表示永不卸载
//               "unLoadDist":5000
//             },{
//               "projName":"proj02",
//               "urlRes":"https://www.bjblackhole.cn:8009/default.aspx?dir=url_res03&path=",
//               "projResName":"res_test2",
//               "useNewVer":true,
//               "verInfo":0,
//               "useTransInfo":false,
//               "transInfo":"",
//               "loadDist":-10,不能等于0，1e30默认加载且不卸载
//               "unLoadDist":-50
//             }
//            ]
function REloadMainSce_projs(projInfo){
  var _defMainProjResRoot = ""; var _defMainProjCamFile = ""; 
  var _deftransinfo = [[1,1,1],[0,0,0,1],[0,0,0]];
  var _l = projInfo.length; 
  var _isMainProj = false;
  var _useCamPost = false;
  var _loadDist = 1e30;
  var _unLoadDist = 1e30;
  for(var i=0; i<_l; ++i){
    var intprojid = Module.RealBIMWeb.ConvGolStrID2IntID(projInfo[i].projName);
    var _ver = {m_sVer0:0x7fffffff, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:intprojid, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
    _isMainProj = ((i==0)? true : false); //如果是从单项目变成多项目，需注释掉此行代码，结合加载单项目的接口一起使用即可
    if(!projInfo[i].useNewVer){
      _verInfo = projInfo[i].verInfo;
      _ver = {m_sVer0:_verInfo, m_sVer1:-1, m_uVer0GolIDBias_L32:0, m_uVer0GolIDBias_H32:intprojid, m_uVer1GolIDBias_L32:0, m_uVer1GolIDBias_H32:0};
    }
    if(projInfo[i].useTransInfo){
      _deftransinfo = projInfo[i].transInfo;
    }
    if((typeof projInfo[i].loadDist != 'undefined')&&(projInfo[i].loadDist!=0)){
      _loadDist = projInfo[i].loadDist;
    }
    if((typeof projInfo[i].unLoadDist != 'undefined')&&(projInfo[i].unLoadDist!=0)){
      _unLoadDist = projInfo[i].unLoadDist;
    }
    Module.RealBIMWeb.LoadMainSceExt(projInfo[i].projName, _isMainProj, projInfo[i].urlRes+projInfo[i].projResName+"/total.xml",
                                     _deftransinfo[0], _deftransinfo[1], _deftransinfo[2], _loadDist, _unLoadDist,
                                     _defMainProjResRoot, _defMainProjCamFile, _useCamPost);
    var verbool =Module.RealBIMWeb.SetSceVersionInfoExt(projInfo[i].projName,_ver);
  }
}

// 项目集设置单项目的位置偏移
function REsetMainSceTransform(projName,transInfo){
  return Module.RealBIMWeb.SetMainSceTransform(projName,transInfo);
}
// 项目集获取设置的单项目的位置偏移信息
function REgetMainSceTransform(projName){
  return Module.RealBIMWeb.GetMainSceTransform(projName);
}
//设置项目的自动加载/卸载距离阈值
//strProjName：表示要处理的项目名称，为空串则表示处理所有项目
//vDist：<x,y>分别表示项目资源的自动加载/卸载距离阈值(>0表示绝对距离，<0表示距离阈值相对于项目包围盒尺寸的倍数，=0表示默认加载方式)
function REsetMainSceAutoLoadDist(projName,loadDist,unLoadDist){
  var _loaddist = (loadDist==0)?1e30:loadDist;
  var _unloaddist = (unLoadDist==0)?1e30:unLoadDist;
  var distinfo=[_loaddist,_unloaddist];
  Module.RealBIMWeb.SetMainSceAutoLoadDist(projName,distinfo);
}
// 获取单项目的自动加载/卸载距离阈值
function REgetMainSceAutoLoadDist(projName){
  return Module.RealBIMWeb.GetMainSceAutoLoadDist(projName);
}

// 获取当前加载的所有项目名称
function REgetAllMainSceNames(){
  var temparr =Module.RealBIMWeb.GetAllMainSceNames();
  var namearr = [];
  for(i =0; i<temparr.size(); ++i){
    namearr.push(temparr.get(i));
  }
  return namearr;
}
//卸载一个场景
function REunloadMainSce(projName){
  Module.RealBIMWeb.UnLoadMainSce(projName);
}
// 卸载所有场景
function REunloadAllMainSce(){
  var temparr =Module.RealBIMWeb.GetAllMainSceNames();
  for(i =0; i<temparr.size(); ++i){
    var tempprojname = temparr.get(i);
    Module.RealBIMWeb.UnLoadMainSce(tempprojname);
  }
}
//退出引擎界面
function REreleaseEngine(){
  Module.RealBIMWeb.ReleaseEmuMgr();
}

//相机定位到构件ID集合
function REfocusCamTo(objArr,backDepth){
  var _s = objArr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = objArr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.FocusCamToSubElems("DefaultProj","",elemIds.byteLength,elemIds.byteOffset,backDepth); //backdepth表示相机后退的强度，可设置
}
//相机定位到构件ID集合_多项目
// projIdInfo = [
//               {"projName":"test1","objarr":[1,2,3]},
//               {"projName":"test2","objarr":[1,2,3]}
//              ]
function REfocusCamTo_projs(projIdInfo,backDepth){
  var obj_s = 0;
  var _offset=0;
  for(var i=0;i<projIdInfo.length;++i){
    obj_s += projIdInfo[i].objarr.length;
  }
  var _s01 = (obj_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(var i=0;i<projIdInfo.length;++i){
    var projname = projIdInfo[i].projName;
    var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
    var tempobjarr = projIdInfo[i].objarr;
    for(var j=0;j<tempobjarr.length;++j){
      var eleid = tempobjarr[j];
      elemIds.set([eleid,projid],_offset);
      _offset+=2;
    }
  }
  Module.RealBIMWeb.FocusCamToSubElems("","",elemIds.byteLength,elemIds.byteOffset,backDepth); //backdepth表示相机后退的强度，可设置
}
//相机定位到场景节点
function REfocusCamToSce(sceName,backDepth){
  Module.RealBIMWeb.FocusCamToSubElems("",sceName,0,0,backDepth); //backdepth表示相机后退的强度，可设置
}

//相机方位相关
function RElocateCamToDir(dirInfo){
  if(dirInfo=="default"){
    Module.RealBIMWeb.RestoreCamLocation();
  }else if(dirInfo=="top"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.TOP);
  }else if(dirInfo=="bottom"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.BOTTOM);
  }else if(dirInfo=="left"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.LEFT);
  }else if(dirInfo=="right"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.RIGHT);
  }else if(dirInfo=="front"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.FRONT);
  }else if(dirInfo=="back"){
    Module.RealBIMWeb.ResetCamToTotalSce(Module.RE_CAM_DIR.BACK);
  }
}

//获取当前相机方位(四元数)
function REgetCamLocation(){
  var camloc = Module.RealBIMWeb.GetCamLocation();
  return camloc;
}

//调整相机到方位(四元数)
function RElocateCamTo(pos,dir,delTime){
  Module.RealBIMWeb.LocateCamTo(pos,dir,delTime);
}

//获取当前相机方位(欧拉角)
function REgetCamLocation_Dir(){
  var camloc = Module.RealBIMWeb.GetCamLocation_Dir();
  return camloc;
}

//调整相机到方位(欧拉角)
function RElocateCamTo_Dir(pos,dir,delTime){
  Module.RealBIMWeb.LocateCamTo_Dir(pos,dir,delTime);
}

//生成屏幕快照
function REgetScreenPrintImage(){
  return Module.canvas.toDataURL();
}

//颜色转换工具函数
function REclrFix(clr,clrPercent){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  var intclrper = Math.round(clrPercent);
  var newclrper =(intclrper>15 ? (intclrper.toString(16)) : ("0"+intclrper.toString(16))); 
  var clrinfo ="0x"+newclrper+newclr; 
  var clr = parseInt(clrinfo);
  return clr;
}

//透明度转换工具函数
function REalphaFix(alpha,alphaPercent){
  var intalphainfo =Math.round(alpha);
  var intalphaper =Math.round(alphaPercent);
  var newalphainfo =(intalphainfo>15 ? (intalphainfo.toString(16)) : ("0"+intalphainfo.toString(16)));
  var newalphaper =(intalphaper>15 ? (intalphaper.toString(16)) : ("0"+intalphaper.toString(16)));
  var alphainfo ="0x"+newalphaper+newalphainfo+"ffff"; 
  var alpha = parseInt(alphainfo); 
  return alpha;
}

//发光和PBR转换工具函数
function REpbrFix(emis,emisRatio,smooth,metal,smmeRatio){
  var intemis =Math.round(emis);
  var intemisratio =Math.round(emisRatio);
  var intsmoothtemp =Math.round(smooth);
  var intmetaltemp =Math.round(metal);
  var intsmmeratio =Math.round(smmeRatio);
  var intsmooth = Math.round(intsmoothtemp/255*63);
  var intmetal = Math.round(intmetaltemp/255*3);
  var pbrtemp = intemis+intemisratio*256+intsmooth*65536+intmetal*4194304+intsmmeratio*268435456;
  var pbr = Math.round(pbrtemp);
  return pbr;
}

//改变构件集合颜色(永久)
function REsetElemClr(objArr,newClr,newclrPercent,newAlpha,newAlphaPercent){
  var clr = REclrFix(newClr,newclrPercent); 
  var alpha = REalphaFix(newAlpha,newAlphaPercent);
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("DefaultProj","", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,0,alpha,clr], i*4);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("DefaultProj","", clrs.byteLength, clrs.byteOffset);
  }
}
//多项目改变构件集合颜色(永久)
function REsetElemClr_projs(projName,objArr,newClr,newclrPercent,newAlpha,newAlphaPercent){
  var clr = REclrFix(newClr,newclrPercent); 
  var alpha = REalphaFix(newAlpha,newAlphaPercent);
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(projName==""){
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("","", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objArr[i];
        clrs.set([eleid,projid,alpha,clr], i*4);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
    }
  }
}
//恢复构件集合颜色(永久)
function REresetElemClr(objArr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var _s = objArr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("DefaultProj","", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objArr[i];
      clrs.set([eleid,0,alpha,clr], i*4);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("DefaultProj","" ,clrs.byteLength, clrs.byteOffset);
  }
}
//多项目恢复构件集合颜色(永久)
function REresetElemClr_projs(projName,objArr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
  var _s = objArr.length;
  if(projName==""){
    var _l = (16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("","", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*16).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objArr[i];
        clrs.set([eleid,projid,alpha,clr], i*4);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos(projName,"", clrs.byteLength, clrs.byteOffset);
    }
  }
}

//改变构件集合颜色(永久,增强版)
function REsetElemClrExt(objarr,newclr,newclr_ratio,newalpha,newalpha_ratio,
                          newemis,newemis_ratio,newsmooth,newmetal,newsmme_ratio){
  var clr = REclrFix(newclr,newclr_ratio); 
  var alpha = REalphaFix(newalpha,newalpha_ratio);
  var pbr = REpbrFix(newemis,newemis_ratio,newsmooth,newmetal,newsmme_ratio);
  var _s = objarr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("DefaultProj","", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      clrs.set([eleid,0,alpha,0,clr,pbr], i*6);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("DefaultProj","", clrs.byteLength, clrs.byteOffset);
  }
}

//多项目改变构件集合颜色(永久,增强版)
function REsetElemClrExt_projs(projname,objarr,newclr,newclr_ratio,newalpha,newalpha_ratio,
                          newemis,newemis_ratio,newsmooth,newmetal,newsmme_ratio){
  var clr = REclrFix(newclr,newclr_ratio); 
  var alpha = REalphaFix(newalpha,newalpha_ratio);
  var pbr = REpbrFix(newemis,newemis_ratio,newsmooth,newmetal,newsmme_ratio);
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
  var _s = objarr.length;
  if(projname==""){
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("","", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,0,clr,pbr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname,"", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objarr[i];
        clrs.set([eleid,projid,alpha,0,clr,pbr], i*6);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname,"", clrs.byteLength, clrs.byteOffset);
    }
  }
}

//恢复构件集合颜色(永久,增强版)
function REresetElemClrExt(objarr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var pbr = 0x00000000;
  var _s = objarr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("DefaultProj", "", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      clrs.set([eleid,0,alpha,0,clr,pbr], i*6);
    }
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("DefaultProj", "", clrs.byteLength, clrs.byteOffset);
  }
}
//多项目恢复构件集合颜色(永久,增强版)
function REresetElemClrExt_projs(projname,objarr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var pbr = 0x00000000;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
  var _s = objarr.length;
  if(projname==""){
    var _l = (24).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    clrs.set([0,0,alpha,0,clr,pbr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt("", "", 0xffffffff, clrs.byteOffset);
  }else{
    if(_s ==0){  //如果构件ID集合为空，则默认为改变所有构件的信息
      var _l = (24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_l); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      clrs.set([0,projid,alpha,0,clr,pbr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname, "", 0xffffffff, clrs.byteOffset);
    }else{
      var _s01 = (_s*24).toString();
      Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
      for(i =0; i<_s; ++i)
      {
        var eleid = objarr[i];
        clrs.set([eleid,projid,alpha,0,clr,pbr], i*6);
      }
      Module.RealBIMWeb.SetHugeObjSubElemClrInfosExt(projname, "", clrs.byteLength, clrs.byteOffset);
    }
  }
}

//根据id判断一个构件是否被设为透明
function REisElemHide(elemid){
  Module.RealBIMWeb.ReAllocHeapViews("16"); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
  clrs.set([elemid,0,0x00000000,0x00000000], 0); 
  var retarray =Module.RealBIMWeb.GetHugeObjSubElemClrInfos("DefaultProj", "", clrs.byteLength, clrs.byteOffset);
  var alphainfo = retarray[2].toString(16);
  var isusenewalpha = alphainfo.substring(6,8); 
  var newalpha = alphainfo.substring(2,4); 
  var newalphapercent = alphainfo.substring(0,2); 
  var temp01 = parseInt(isusenewalpha,16);
  var temp02 = parseInt(newalpha,16)
  var temp03 = parseInt(newalphapercent,16)
  if(temp01>0 && temp02==0 && temp03==255){
    return true;
  }else{
    return false;
  }
}

//设置场景节点颜色
function REsetSceClr(scearr,newclr,newclrpercent,newalpha,newalphapercent){
  var clr = REclrFix(newclr,newclrpercent); 
  var alpha = REalphaFix(newalpha,newalphapercent);
  var _s = scearr.length;
  if(_s ==0){  //如果场景ID集合为空，则默认为改变所有场景的信息
    Module.RealBIMWeb.ReAllocHeapViews("16"); clrs =Module.RealBIMWeb.GetHeapView_U32(0); clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("", "", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = scearr[i];
      clrs.set([0,0,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos("", eleid, 0xffffffff, clrs.byteOffset);
    }
  }
}
//恢复场景节点颜色
function REresetSceClr(scearr){
  var clr = 0x000000ff;
  var alpha = 0x0080ffff;
  var _s = scearr.length;
  if(_s ==0){  //如果场景ID集合为空，则默认为改变所有场景的信息
    Module.RealBIMWeb.ReAllocHeapViews("16"); clrs =Module.RealBIMWeb.GetHeapView_U32(0); clrs.set([0,0,alpha,clr], 0);
    Module.RealBIMWeb.SetHugeObjSubElemClrInfos("", "", 0xffffffff, clrs.byteOffset);
  }else{
    var _s01 = (_s*16).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); clrs =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = scearr[i];
      clrs.set([0,0,alpha,clr], 0);
      Module.RealBIMWeb.SetHugeObjSubElemClrInfos("", eleid, 0xffffffff, clrs.byteOffset);
    }
  }
}

//获取当前构件的渲染状态
function REgetSysRenderState(){
  var renderdata = new Uint8Array(Module.RealBIMWeb.GetSysRenderState());
  return renderdata;
}
//设置构件的渲染状态
function REsetSysRenderState(renderdata){
  var strrenderdata = renderdata.byteLength.toString();
  Module.RealBIMWeb.ReAllocHeapViews(strrenderdata); data =Module.RealBIMWeb.GetHeapView_U8(0);
  data.set(renderdata,0);
  Module.RealBIMWeb.SetSysRenderState(data.byteLength,data.byteOffset);
}

//设置构件的探测掩码
function REsetElemsProbeMask(objarr,bool){
  var _s = objarr.length;
  if(_s ==0){  //如果构件ID集合为空，则默认为设置所有构件
    Module.RealBIMWeb.SetHugeObjSubElemProbeMasks("DefaultProj","",0xffffffff,0,bool);
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      elemIds.set([eleid,0], i*2);
    }
    Module.RealBIMWeb.SetHugeObjSubElemProbeMasks("DefaultProj","",elemIds.byteLength,elemIds.byteOffset,bool);
  }
}

//锚点设置相关
// 批量添加锚点
function REaddAnchors(ancinfo){
  var tempanchors =new Module.RE_Vector_ANCHOR();
  for(i=0;i<ancinfo.length;++i){
    var _uselod = false; var _linepos = [0,0]; var _lineclr = 0x00000000; var _size = 0; var _selfASDist = -1; var _selfVisDist = -1; 
    if(typeof ancinfo[i].useLod != 'undefined'){
      _uselod = ancinfo[i].useLod;
    }
    if(typeof ancinfo[i].linepos != 'undefined'){
      _linepos = ancinfo[i].linepos;
    }
    if(typeof ancinfo[i].lineclr != 'undefined'){
      _lineclr = ancinfo[i].lineclr;
    }
    if(typeof ancinfo[i].ancsize != 'undefined'){
      _size = ancinfo[i].ancsize;
    }
    if(typeof ancinfo[i].selfautoscaledist != 'undefined'){
      _selfASDist = ancinfo[i].selfautoscaledist;
    }
    if(typeof ancinfo[i].selfvisdist != 'undefined'){
      _selfVisDist = ancinfo[i].selfvisdist;
    }
    var tempobj ={
     m_strName: ancinfo[i].ancname, 
     m_vPos: ancinfo[i].pos, 
     m_bUseLOD: _uselod,
     m_vLineEnd: _linepos,
     m_uLineClr: _lineclr,
     m_fSize: _size,
     m_fSelfASDist: _selfASDist,
     m_fSelfVisDist: _selfVisDist,
     m_cTexRegion: {
       m_strTexPath: ancinfo[i].picpath,
       m_qTexRect: [-ancinfo[i].picwidth/2+_linepos[0], 0+_linepos[1], ancinfo[i].picwidth/2+_linepos[0], ancinfo[i].picheight+_linepos[1]],
       m_uTexClrMult: 0xffffffff,
       m_vMinTexUV: [0.0, 0.0],
       m_vMaxTexUV: [1.0, 1.0],
       m_uFrameNumU: 1,
       m_uFrameNumV: 1,
       m_uFrameStrideU: 30,
       m_uFrameStrideV: 30,
       m_fFrameFreq: 0.0,
     },
     m_cTextRegion: {
       m_strGolFontID: "RealBIMFont001",
       m_bTextWeight: false,
       m_strText: ancinfo[i].textinfo,
       m_uTextClr: 0xffffffff,
       m_uTextBorderClr: 0x80000000,
       m_qTextRect: [ancinfo[i].picwidth/2+_linepos[0], _linepos[1], ancinfo[i].picwidth/2+1+_linepos[0], 1+_linepos[1]],
       m_uTextFmtFlag: (0x1/*TEXT_FMT_BOTTOM*/ | 0x8/*TEXT_FMT_LEFT*/ | 0x40/*TEXT_FMT_NOCLIP*/),
     }
    };
    tempanchors.push_back(tempobj);
  }
  var bool =Module.RealBIMWeb.AddAnchors(tempanchors);
  return bool;
}
//批量删除锚点
function REdelAnchors(arrancname){
  var tempanchors = new Module.RE_Vector_WStr();
  for(i=0;i<arrancname.length;++i){
    tempanchors.push_back(arrancname[i]);
  }
  var bool =Module.RealBIMWeb.DelAnchors(tempanchors);
  return bool;
}
//删除全部锚点
function REdelAllAnchors(){
  Module.RealBIMWeb.DelAllAnchors();
}
//获取系统中所有锚点总数
function REgetAnchorNum(){
  var ancnum =Module.RealBIMWeb.GetAnchorNum();
  return ancnum;
}
//获取某个锚点的信息
function REgetAnchorData(ancname){
  var ancdata =Module.RealBIMWeb.GetAnchor(ancname);
  return ancdata;
}
//获取系统中所有锚点信息
function REgetAllAnchorsData(){
  var allancdata =Module.RealBIMWeb.GetAllAnchors();
  return allancdata;
}

// 批量添加闪烁锚点
function REaddAnimAnchors(ancinfo){
  var tempanchors =new Module.RE_Vector_ANCHOR();
  for(i=0;i<ancinfo.length;++i){
    var tempobj ={
     m_strName: ancinfo[i].ancname, 
     m_vPos: ancinfo[i].pos, 
     m_cTexRegion: {
       m_strTexPath: ancinfo[i].picpath,
       m_qTexRect: [-ancinfo[i].picwidth/2, 0, ancinfo[i].picwidth/2, ancinfo[i].picheight],
       m_uTexClrMult: 0xffffffff,
       m_vMinTexUV: [0.0, 0.0],
       m_vMaxTexUV: [1.0/ancinfo[i].picnum, 1.0],
       m_uFrameNumU: ancinfo[i].picnum,
       m_uFrameNumV: 1,
       m_uFrameStrideU: ancinfo[i].picwidth,
       m_uFrameStrideV: ancinfo[i].picheight,
       m_fFrameFreq: ancinfo[i].playframe,
     },
     m_cTextRegion: {
       m_strGolFontID: "RealBIMFont001",
       m_bTextWeight: false,
       m_strText: ancinfo[i].textinfo,
       m_uTextClr: 0xffffffff,
       m_uTextBorderClr: 0x80000000,
       m_qTextRect: [0, 0, 1, 1],
       m_uTextFmtFlag: (0x1/*TEXT_FMT_BOTTOM*/ | 0x8/*TEXT_FMT_LEFT*/ | 0x40/*TEXT_FMT_NOCLIP*/),
     }
    };
    tempanchors.push_back(tempobj);
  }
  Module.RealBIMWeb.AddAnchors(tempanchors);
}
//停止闪烁
function REstopAncAnim(ancname){
  var bool =Module.RealBIMWeb.SetShpObjInfo(ancname, {m_uRGBBlendInfo:0x00ffffff, m_uAlpha:0, m_uAlphaAmp:0, m_uForceAnimFrame:0, m_uProbeMask:1});
  return bool;
}
//设置系统中锚点是否允许被场景遮挡
function REsetAnchorContactSce(bool){
  Module.RealBIMWeb.SetAnchorContactSce(bool);
}
//获取系统中锚点是否允许被场景遮挡
function REgetAnchorContactSce(){
  return Module.RealBIMWeb.GetAnchorContactSce();
}
//设置聚合锚点
//lodlevel:表示聚合层级，范围1~10,默认为1，表示不聚合
//useCustomBV:是否用锚点的预估总包围盒，默认为false
//customBV:锚点的预估总包围盒，当useCustomBV为false时，此参数无效，填空数组即可，默认为场景的总包围盒
//mergedist:聚合的半径，单位为像素，例如为300px，则表示当局部范围内锚点数量大于最小聚合个数minMergeNum，
//          并且全部锚点投影到屏幕空间距离小于聚合的半径mergedist时，才发生聚合
//minMergeNum:最小的聚合个数，取值为正整数，例如为10，即10个或以上的标签会发生聚合
//strMergeTexPath:聚合锚点使用的图片路径
//texWidth:聚合锚点使用的图片宽度
//texHeight:聚合锚点使用的图片高度
function REsetAnchorLODInfo(lodLevel,useCustomBV,customBV,mergedist,minMergeNum,strMergeTexPath,texWidth,texHeight){
  var _customBV = [[0,0,0],[0,0,0]];
  var _texrect = [-texWidth/2,0,texWidth/2,texHeight];
  if(useCustomBV){
    _customBV=customBV;
  }
  Module.RealBIMWeb.SetAnchorLODInfo(lodLevel,useCustomBV,_customBV,mergedist,minMergeNum,strMergeTexPath,_texrect);
}
//设置系统中锚点的自动缩放距离
function REsetAnchorAutoScaleDist(dDist){
  Module.RealBIMWeb.SetAnchorAutoScaleDist(dDist);
}
//获取系统中锚点的自动缩放距离
function REgetAnchorAutoScaleDist(){
  return Module.RealBIMWeb.GetAnchorAutoScaleDist();
}
//设置系统中锚点的最远可视距离
function REsetAnchorVisDist(dDist){
  Module.RealBIMWeb.SetAnchorVisDist(dDist);
}
//获取系统中锚点的最远可视距离
function REgetAnchorVisDist(){
  return Module.RealBIMWeb.GetAnchorVisDist();
}
//聚焦相机到指定的锚点
//strName：表示锚点的标识名
//dBackwardAmp：表示相机在锚点中心处向后退的强度
//        >=0.0 表示相机的后退距离相对于锚点覆盖范围的比例(若锚点覆盖范围无效则视为绝对后退距离)
//        <0.0 表示相机的后退距离的绝对值的负
function REfocusCamToAnchor(strAncName,dBackwardAmp){
  Module.RealBIMWeb.FocusCamToAnchor(strAncName,dBackwardAmp);
}


//标签相关
//生成一个标签内部对象
// TEXT_FMT_BOTTOM     =(1<<0)_0x1,  //表示文字底部对齐
// TEXT_FMT_VCENTER    =(1<<1)_0x2,  //表示文字竖向居中(优先级高于TEXT_FMT_BOTTOM)
// TEXT_FMT_TOP      =(1<<2)_0x4,  //表示文字顶部对齐(优先级高于TEXT_FMT_VCENTER)
// TEXT_FMT_LEFT     =(1<<3)_0x8,  //表示文字左对齐
// TEXT_FMT_HCENTER    =(1<<4)_0x10,  //表示文字横向居中(优先级高于TEXT_FMT_LEFT)
// TEXT_FMT_RIGHT      =(1<<5)_0x20,  //表示文字右对齐(优先级高于TEXT_FMT_HCENTER)
// TEXT_FMT_NOCLIP     =(1<<6)_0x40,  //表示不裁剪掉文字超出给定矩形区域外的部分
// TEXT_FMT_SINGLELINE   =(1<<7)_0x80,  //表示所有文字全部显示在一横行上，忽略所有的换行符以及TEXT_FMT_WORDBREAK属性
// TEXT_FMT_WORDBREAK    =(1<<8)_0x100,  //若当前字符有一部分在给定矩形区域外的话，则强制换行显示该字符，避免字符横向超出矩形区域外
function REgenATag(taginfo){
  var temptexregions =new Module.RE_Vector_SHP_TEX();
  var temptextregions =new Module.RE_Vector_SHP_TEXT();
  var _l = taginfo.info.length;
  var _h = 26; var _s = 3;
  for(i=0;i<_l;++i){
    temptexregions.push_back({
       m_strTexPath: taginfo.info[i].picpath,
       m_qTexRect: [-50, _h*(_l-i-1)+_s, -30, _h*(_l-i)-_s], 
       m_uTexClrMult: 0xffffffff,
       m_vMinTexUV: [0.0, 0.0],
       m_vMaxTexUV: [1.0, 1.0],
       m_uFrameNumU: 1,
       m_uFrameNumV: 1,
       m_uFrameStrideU: 0,
       m_uFrameStrideV: 0,
       m_fFrameFreq: 0.0,
     })  //纹理矩形区域在2维像素裁剪空间(Y轴向上递增)下相对于定位点的覆盖区域<左，下，右，上>
  }
  for(i=0;i<_l;++i){
    temptextregions.push_back({
       m_strGolFontID: "RealBIMFont001",
       m_bTextWeight: false,
       m_strText: taginfo.info[i].textinfo,
       m_uTextClr: 0xffffffff,
       m_uTextBorderClr: 0x80000000,
       m_qTextRect: [0, _h*(_l-i-1)+_s, 30, _h*(_l-i)-_s],
       m_uTextFmtFlag: ((1<<1)/*TEXT_FMT_VCENTER*/ | (1<<3)/*TEXT_FMT_LEFT*/ | (1<<6)/*TEXT_FMT_NOCLIP*/),
     });
  }
  var tempobj ={
   m_strName: taginfo.tagname, 
   m_vPos: taginfo.pos, 
   m_vBgMinSize: [150, 10],
   m_vBgPadding: [5, 5],
   m_uBgAlignX: 1,
   m_uBgAlignY: 1,
   m_vArrowOrigin: [0, 10],
   m_uBgColor: 0x80000000,
   m_arrTexContents: temptexregions,
   m_arrTextContents: temptextregions,
  };
  return tempobj;
}
// 批量添加标签
function REaddTags(taginfos){
  var temptags =new Module.RE_Vector_TAG();
  for(var i =0; i<taginfos.length; ++i){
    temptags.push_back(REgenATag(taginfos[i]));
  }
  var bool =Module.RealBIMWeb.AddTags(temptags);
  return bool;
}
//批量删除标签
function REdelTags(arrtagname){
  var temptags = new Module.RE_Vector_WStr();
  for(i=0;i<arrtagname.length;++i){
    temptags.push_back(arrtagname[i]);
  }
  var bool =Module.RealBIMWeb.DelTags(temptags);
  return bool;
}
//删除全部标签
function REdelAllTags(){
  Module.RealBIMWeb.DelAllTags();
}
//获取系统中所有标签总数
function REgetTagNum(){
  var tagnum =Module.RealBIMWeb.GetTagNum();
  return tagnum;
}
//获取某个标签的信息
function REgetTagData(tagname){
  var tagdata =Module.RealBIMWeb.GetTag(tagname);
  return tagdata;
}
//获取系统中所有标签信息
function REgetAllTagsData(){
  var alltagdata =Module.RealBIMWeb.GetAllTags();
  return alltagdata;
}
//设置系统中标签是否允许被场景遮挡
function REsetTagContactSce(bool){
  Module.RealBIMWeb.SetTagContactSce(bool);
}
//获取系统中标签是否允许被场景遮挡
function REgetTagContactSce(){
  return Module.RealBIMWeb.GetTagContactSce();
}
//设置系统中标签的自动缩放距离
function REsetTagAutoScaleDist(dDist){
  Module.RealBIMWeb.SetTagAutoScaleDist(dDist);
}
//获取系统中标签的自动缩放距离
function REgetTagAutoScaleDist(){
  return Module.RealBIMWeb.GetTagAutoScaleDist();
}
//设置系统中标签的最远可视距离
function REsetTagVisDist(dDist){
  Module.RealBIMWeb.SetTagVisDist(dDist);
}
//获取系统中标签的最远可视距离
function REgetTagVisDist(){
  return Module.RealBIMWeb.GetTagVisDist();
}

// 标注相关
//开始添加标注
function REaddMarkBegin(){
  var bool =Module.RealBIMWeb.BeginAddMark();  //进入创建标注的状态
  return bool;
}
//添加标注文字
function REaddMarkText(textdata){
  Module.RealBIMWeb.SetMarkText(textdata);
}
//获取当前标注信息
function REgetMarkData(){
  var markdata = new Uint8Array(Module.RealBIMWeb.GetMarkInfo());
  return markdata;
}
//结束添加标注
function REaddMarkEnd(){
  var bool =Module.RealBIMWeb.EndAddMark();
  return bool;  
}
//查看之前保存的标注信息，参数为之前保存的字符串
function REshowMark(markdata){
  var strmarkdata = markdata.byteLength.toString();
  Module.RealBIMWeb.ReAllocHeapViews(strmarkdata); data =Module.RealBIMWeb.GetHeapView_U8(0);
  data.set(markdata,0);
  Module.RealBIMWeb.ShowMarkInfo(data.byteLength,data.byteOffset);
}

// 电子围栏相关
//进入电子围栏编辑状态
function REeditFenceBegin(){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
}
function REaddFenceBegin(){
  var bool =Module.RealBIMWeb.BeginAddFence(); //开始添加电子围栏，进入电子围栏编辑状态后可添加多个电子围栏
  return bool;
}
function REaddFenceEnd(){
  var bool =Module.RealBIMWeb.EndAddFence();  //结束当前电子围栏的添加，如果没有退出电子围栏编辑状态，可继续添加下一个
  return bool;
}
function REeditFenceEnd(){
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
}
// 设置添加电子围栏时的小提示图标
function REsetFenceEditPic(strpicpath){
  var temptexregions={
    m_strTexPath: strpicpath,
    m_qTexRect: [-32, 0, 0, 32],
    m_uTexClrMult: 0xffffffff,
    m_vMinTexUV: [0.0, 0.0],
    m_vMaxTexUV: [1.0, 1.0],
    m_uFrameNumU: 1,
    m_uFrameNumV: 1,
    m_uFrameStrideU: 32,
    m_uFrameStrideV: 32,
    m_fFrameFreq: 0.0
  };
  Module.RealBIMWeb.SetFencePotUniformIcon(temptexregions);
}
//获取当前所有电子围栏的顶点信息
function REgetFencePot(){
  var fenceinfo = Module.RealBIMWeb.GetSceFenceInfos();
  return fenceinfo;
}
//根据电子围栏的顶点和线的名称返回围栏的名称
function REgetFenceName(childname){
  var fencedata = Module.RealBIMWeb.GetShpObjExtInfo(shpproberet_norm.m_strSelShpObjName);
  if((fencedata.m_eType.value==3)||(fencedata.m_eType.value==4)){
    var fencename = fencedata.m_strParent;
    return fencename;
  }
}
//设置电子围栏的顶点信息
function REaddFenceByPot(fenceinfo){
  Module.RealBIMWeb.ExitFenceEditMode(); //必须退出编辑电子围栏的状态，才可设置所有围栏的信息
  for(i=0;i<fenceinfo.length;++i){
    fenceinfo[i].m_uClr = REclrFix(fenceinfo[i].m_uClr,fenceinfo[i].m_uAlpha);
    delete fenceinfo[i].m_uAlpha;
  }
  var tempfencepots = new Module.RE_Vector_FENCE_POT();
  for(i=0;i<fenceinfo.length;++i){
    tempfencepots.push_back(fenceinfo[i]);
  }
  var bool =Module.RealBIMWeb.SetSceFenceInfos(tempfencepots);
  return bool;
}
//删除一个围栏顶点
function REdelFencePot(fencepotname){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
  var bool =Module.RealBIMWeb.DelFencePot(fencepotname);
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
  return bool;
}
//删除一个围栏
function REdelFence(fencename){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
  var bool =Module.RealBIMWeb.DelFence(fencename);
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
  return bool;
}
//删除全部围栏
function REdelAllFences(){
  Module.RealBIMWeb.EnterFenceEditMode(); //进入编辑电子围栏的状态
  var bool =Module.RealBIMWeb.DelAllFences();
  Module.RealBIMWeb.ExitFenceEditMode(); //退出编辑电子围栏的状态
  return bool;
}

// 选择集合相关（选择集包含鼠标选中的构件ID集合，鼠标点击空白处，选择集自动清空）
// 设置选择集的颜色、透明度、探测掩码（即是否可以被选中）
// clr: 表示新的颜色
// clrpercent: 表示新的颜色所占的权重，255表示100%,0表示0%
// alpha: 表示新的透明度，255表示不透明，80表示半透明，0表示全透明
// alphapercent: 表示新的透明度所占的权重，255表示100%，0表示0%
// probemask : 0：表示选择集中的构件不可被选中，为1则表示可以被选中；
function REsetSelElemsAttr(clr,clrpercent,alpha,alphapercent,probemask){
  var tempclr01 = clr.substring(0,2); var clr01 = (parseInt(tempclr01,16)/255);
  var tempclr02 = clr.substring(2,4); var clr02 = (parseInt(tempclr02,16)/255);
  var tempclr03 = clr.substring(4,6); var clr03 = (parseInt(tempclr03,16)/255);
  var clrper = (clrpercent/255);
  var alphadata = (alpha/255);
  var alphaper = (alphapercent/255);
  var bool =Module.RealBIMWeb.SetSelElemsAttr({m_qClrBlend : [clr01,clr02,clr03,clrper], m_vAlphaBlend : [alphadata,alphaper], m_uProbeMask : probemask});
  return bool;
}
// 获取当前选择集的属性信息
function REgetSelElemsAttr(){
  var curattr =Module.RealBIMWeb.GetSelElemsAttr();
  return curattr;
}
// 获取当前选择集的构件ID集合,以数组形式返回，两两一组代表一个id的高32位和低32位
function REgetSelElemIDs(){
  var tempselids =new Uint32Array(Module.RealBIMWeb.GetSelElemIDs());
  var projidarr =[];
  if(tempselids.length<2){
    // alert("当前选择集为空");
    return;
  }
  var curprojid = tempselids[1];
  var curprojelemarr = [];
  for(var i=0;i<tempselids.length;i+=2){
    if(tempselids[i+1]==curprojid){
      curprojelemarr.push(tempselids[i]);
    }else{
      if(curprojelemarr.length>0){
        var curprojinfo={};
        curprojinfo["projName"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
        curprojinfo["objArr"] = curprojelemarr;
        projidarr.push(curprojinfo);
        curprojelemarr=[];
      }
      curprojid=tempselids[i+1];
      curprojelemarr.push(tempselids[i]);
    }
  }
  if(curprojelemarr.length>0){
    var curprojinfo={};
    curprojinfo["projName"] = Module.RealBIMWeb.ConvGolIntID2StrID(curprojid);
    curprojinfo["objArr"] = curprojelemarr;
    projidarr.push(curprojinfo);
    curprojelemarr=[];
  }
  return projidarr;
}
// 往当前选择集合添加构件，参数为要添加的构件id集合
function REaddToSelElemIDs(objarr){
  var _s = objarr.length;
  if(_s ==0){
    // Module.RealBIMWeb.AddToSelElemIDs(0xffffffff,elemIds.byteOffset); //添加全部构件,目前暂不支持
    alert("不支持将所有构件添加到选择集！");
    return;
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      elemIds.set([eleid,0], i*2);
    }
    Module.RealBIMWeb.AddToSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//从当前选择集合删除构件，参数为要删除的构件id集合
function REremoveFromSelElemIDs(objarr){
  var _s = objarr.length;
  if(_s ==0){
    Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff,0); //删除全部构件
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      elemIds.set([eleid,0], i*2);
    }
    Module.RealBIMWeb.RemoveFromSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//获取元素集合的总包围盒信息
function REgetTotalBoxByElemIDs(objarr){
  var _s = objarr.length;
  var tempbv;
  if(_s ==0){
    tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("DefaultProj","",0xffffffff,0); //获取所有构件的包围盒信息
  }else{
    var temparr=[];
    for(var i=0;i<_s;++i){
      temparr.push(objarr[i]);
      temparr.push(0);
    }
    var selids = new Uint32Array(temparr);
    var tempids;
    Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
    tempbv =Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("DefaultProj","", tempids.byteLength, tempids.byteOffset);
  }
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]);  //Xmin
  aabbarr.push(tempbv[1][0]);  //Xmax
  aabbarr.push(tempbv[0][1]);  //Ymin
  aabbarr.push(tempbv[1][1]);  //Ymax
  aabbarr.push(tempbv[0][2]);  //Zmin
  aabbarr.push(tempbv[1][2]);  //Zmax
  return aabbarr;
}
//根据场景组id获取总包围盒信息
function REgetTotalBoxBySceID(sceid){
  var _s = sceid.length;
  var tempbv;
  if(_s ==0){
    tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("DefaultProj","",0xffffffff,0); //获取所有构件的包围盒信息
  }else{
    tempbv =Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("DefaultProj",sceid,0xffffffff,0);
  }
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]);  //Xmin
  aabbarr.push(tempbv[1][0]);  //Xmax
  aabbarr.push(tempbv[0][1]);  //Ymin
  aabbarr.push(tempbv[1][1]);  //Ymax
  aabbarr.push(tempbv[0][2]);  //Zmin
  aabbarr.push(tempbv[1][2]);  //Zmax
  return aabbarr;
}
// 往当前选择集合添加构件，多项目接口
function REaddToSelElemIDs_projs(projname,objarr){
  var _s = objarr.length;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
  if((projname=="") || (_s==0)){
    // Module.RealBIMWeb.AddToSelElemIDs(0xffffffff,elemIds.byteOffset); //添加全部构件,目前暂不支持
    alert("不支持将整个项目的构件添加到选择集！");
    return;
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.AddToSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//从当前选择集合删除构件，多项目接口
function REremoveFromSelElemIDs_projs(projname,objarr){
  var _s = objarr.length;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
  if(_s ==0){
    Module.RealBIMWeb.RemoveFromSelElemIDs(0xffffffff,0); //删除全部构件
  }else{
    var _s01 = (_s*8).toString();
    Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
    for(i =0; i<_s; ++i)
    {
      var eleid = objarr[i];
      elemIds.set([eleid,projid], i*2);
    }
    Module.RealBIMWeb.RemoveFromSelElemIDs(elemIds.byteLength,elemIds.byteOffset);
  }
}
//获取元素集合的总包围盒信息
function REgetTotalBoxByElemIDs_projs(projname,objarr){
  var _s = objarr.length;
  var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projname);
  var tempbv;
  if(projname==""){
      tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV("","",0xffffffff,0); //获取所有构件的包围盒信息
  }else{
    if(_s ==0){
      tempbv = Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(projname,"",0xffffffff,0); //获取所有构件的包围盒信息
    }else{
      var temparr=[];
      for(var i=0;i<_s;++i){
        temparr.push(objarr[i]);
        temparr.push(projid);
      }
      var selids = new Uint32Array(temparr);
      var tempids;
      Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
      tempbv =Module.RealBIMWeb.GetHugeObjSubElemsTotalBV(projname,"", tempids.byteLength, tempids.byteOffset);
    }
  }
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]);  //Xmin
  aabbarr.push(tempbv[1][0]);  //Xmax
  aabbarr.push(tempbv[0][1]);  //Ymin
  aabbarr.push(tempbv[1][1]);  //Ymax
  aabbarr.push(tempbv[0][2]);  //Zmin
  aabbarr.push(tempbv[1][2]);  //Zmax
  return aabbarr;
}

//鼠标探测相关
//获取当前选中点相关参数
function REgetCurProbeRet(){
  var proberet = Module.RealBIMWeb.GetCurProbeRet(Module.RE_PROBE_TYPE.POT);
  var projid = proberet.m_uSelActorSubID_H32;
  var projname = Module.RealBIMWeb.ConvGolIntID2StrID(projid);
  proberet["m_strProjName"] = projname;
  delete proberet.m_uSelActorSubID_H32;
  return proberet;
}
//获取当前拾取到的矢量(锚点、标签)相关信息
function REgetCurShpProbeRet(){
  var shpproberet_norm =Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.NORM);
  return shpproberet_norm;
}
//获取当前拾取到的UI相关信息(不常用)
function REgetCurUIShpProbeRet(){
  var shpproberet_ortho =Module.RealBIMWeb.GetCurShpProbeRet(Module.RE_SHP_PROBE_TYPE.ORTHO);
  return shpproberet_ortho;
}

//获取剖切后的构件ID
function REgetClipID(deletecrosspart){
  var data = Module.RealBIMWeb.GetClippedElementIds(deletecrosspart);
  return data;
}
//获取剖面信息
function REgetClipData(){
  var data = Module.RealBIMWeb.GetSceneClippingInfo();
  return data;
}
//设置剖面信息
function REsetClipData(clipdata){
  var bool = Module.RealBIMWeb.SetSceneClippingInfo(clipdata);
  return bool;
}
//退出剖切
function REexitClip(){
  Module.RealBIMWeb.EndSceneClipping();
}
//判断是否处于剖切浏览模式
function REisSceCliping(){
  var bool = Module.RealBIMWeb.IsSceneClippingBrowsing();
  return bool;
}

//倾斜摄影单体化相关接口
//设置倾斜摄影压平数据，参数为固定格式json字符串
function REsetUnverProjectData(unverprojectiondata){
  var jsonStr = JSON.stringify(unverprojectiondata);
  Module.RealBIMWeb.ParseUnverprojectInfo(jsonStr);
}
//取消拍平区域，参数为要取消的拍平区域id集合
function REremoveUnverProjectData(elemarr){
  var _s = elemarr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemarr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.RemoveUnverprojectToSelection(elemIds.byteLength,elemIds.byteOffset);
}
//设置拍平区域，参数为要取消的拍平区域id集合
function REresetUnverProjectData(elemarr){
  var _s = elemarr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemarr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.AddUnverprojectToSelection(elemIds.byteLength,elemIds.byteOffset);
}
//设置倾斜摄影单体化数据，参数为固定格式json字符串
function REsetUnverElemData(unverelemdata){
  var jsonStr = JSON.stringify(unverelemdata);
  Module.RealBIMWeb.ParseUnverelemInfo(jsonStr);
}
//高亮倾斜摄影单体化区域，参数为要查看的单体化id集合
function REshowUnverElemData(elemarr){
  var _s = elemarr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemarr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.HighlightUnverelem(elemIds.byteLength,elemIds.byteOffset);
}
//取消高亮倾斜摄影单体化区域，参数为要隐藏的单体化id集合
function REhideUnverElemData(elemarr){
  var _s = elemarr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemarr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.CancelHighlightUnverelem(elemIds.byteLength,elemIds.byteOffset);
}
//向选择集添加单体化区域，参数为要添加的单体化id集合
function REaddToSelUElemIDs(elemarr){
  var _s = elemarr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemarr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.AddUnverelemsToSelection(elemIds.byteLength,elemIds.byteOffset);
}
//从选择集移除单体化区域，参数为要移除的单体化id集合
function REremoveFromSelUElemIDs(elemarr){
  var _s = elemarr.length;
  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = elemarr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.RemoveUnverelemsToSelection(elemIds.byteLength,elemIds.byteOffset);
}
//获取单体化选择集ID
function REgetUnverElemIDs(){
  var selids =new Uint32Array(Module.RealBIMWeb.GetSelectedUnverelemId());
  return selids;
}
//设置单体化区域选中颜色
//cn::u32 m_UnverelmSelectionColor = 0xff00ffff;
// clr ="FF0000"; //颜色
// alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
function REsetUnverElemClr(clr,alpha){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  var intalphainfo =Math.round(alpha);
  var newalphainfo =(intalphainfo>15 ? (intalphainfo.toString(16)) : ("0"+intalphainfo.toString(16)));
  var clrinfo ="0x"+newalphainfo+newclr; 
  var clr = parseInt(clrinfo);
  Module.RealBIMWeb.SetUnverelemSelectionColor(clr);
}

//天空盒相关
//设置天空盒的启用状态
function REsetSkyEnable(bool){
  Module.RealBIMWeb.SetSkyEnable(bool);
}
//获取天空盒的启用状态
function REgetSkyEnable(){
  var bool = Module.RealBIMWeb.GetSkyEnable();
  return bool;
  var namearr = ["sce01","sce02"];
}
//设置天空盒的背景颜色
function REsetBackColor(clr){
  var tempclr01 = clr.substring(0,2); var clr01 = (parseInt(tempclr01,16)/255);
  var tempclr02 = clr.substring(2,4); var clr02 = (parseInt(tempclr02,16)/255);
  var tempclr03 = clr.substring(4,6); var clr03 = (parseInt(tempclr03,16)/255);
  var clrarr=[clr01,clr02,clr03];
  Module.RealBIMWeb.SetBackColor(clrarr);
}
//获取天空盒的背景颜色
function REgetBackColor(){
  var color= Module.RealBIMWeb.GetBackColor();
  return color;
}

//获取场景所有地形和倾斜摄影的节点id
function REgetAllUnVerHugeGroupIDs(){
  var arr1 =Module.RealBIMWeb.GetAllUnVerHugeGroupNames();
  var namearr = [];
  for(i =0; i<arr1.size(); ++i){
    namearr.push(arr1.get(i));
  }
  return namearr;
}
//设置地形的透明度
function REsetUnVerHugeGroupAlpha(projname,scename,alpha){
  Module.RealBIMWeb.SetUnVerHugeGroupClrInfo(projname,scename, {m_uDestAlpha:alpha,m_uDestAlphaAmp:255,m_uDestRGBBlendInfo:0x00000000});
}
//获取当前设置的地形的透明度
function REgetUnVerHugeGroupAlpha(projname,scename){
  var alpha = Module.RealBIMWeb.GetUnVerHugeGroupClrInfo(projname,scename);
  return alpha.m_uDestAlpha;
}

//设置引擎UI按钮面板是否可见
function REsetUIPanelVisible(bool){
  Module.RealBIMWeb.SetUIPanelVisible(bool);
}
//设置引擎右上方ViewCube是否可见
function REsetViewCubeVisible(bool){
  Module.RealBIMWeb.SetViewCubeVisibility(bool);
}

//重置所有元素的显示状态
function REresetUserOperation(){
  Module.RealBIMWeb.ResetUserOperation(0);
}

//获取场景所有地形和倾斜摄影的节点id
function REgetAllHugeGroupIDs(){
  arr1 =Module.RealBIMWeb.GetAllHugeObjNames();
  var namearr = [];
  for(i =0; i<arr1.size(); ++i){
    namearr.push(arr1.get(i));
  }
  return namearr;
}
//获取当前场景的所有可见元素id
function REgetEleIDsBySceID(sceid,visibalonly){
  var tempelemids =new Uint32Array(Module.RealBIMWeb.GetHugeObjSubElemIDs("DefaultProj",sceid,visibalonly));

  var elemids = [];
  for(i =0; i<tempelemids.length; i+=2){
    elemids.push(tempelemids[i]);
  }
  return elemids;
}

//正交投影下开始添加剖切线顶点
function REclipWithTwoPoint(clipdir){
  if(clipdir == "horizontal"){
    return Module.RealBIMWeb.OrthographicBeginAddClippingVertex(Module.RE_CLIP_DIR.HORIZONTAL);
  }else if(clipdir == "vertical"){
    return Module.RealBIMWeb.OrthographicBeginAddClippingVertex(Module.RE_CLIP_DIR.VERTICAL);
  }
}
//正交投影下退出剖切状态
function REexitClipWithTwoPoint(){
  Module.RealBIMWeb.OrthographicEndSceneClipping();
}
//进入单面剖切状态
function REbeginSingleClip(){
  Module.RealBIMWeb.OnSingleSurfaceClipClicked();
}
//设置剖切完成后是否自动聚焦到剖切面
function REisAutoFocusWithClip(bool){
  Module.RealBIMWeb.setTargetToClipPlane(bool);
}

//进入计算任意点到围栏最短距离的操作状态
function REbeginShowDis(){
  return Module.RealBIMWeb.EnterPotAndFenceDistMeasureState();
}
//退出计算任意点到围栏最短距离的操作状态
function REendShowDis(){
  Module.RealBIMWeb.ExitPotAndFenceDistMeasureState();
}
//在屏幕上显示两个点之间的距离
function REshowDistWithTwoPoint(point1,point2,text){
  Module.RealBIMWeb.DrawHoriMeasureData(point1,point2,text);
}
//清除屏幕上的两点之间信息的信息
function REclearDistWithTwoPoint(){
  Module.RealBIMWeb.ClearHoriMeasureData();
}

//获取相机自动动画启用状态
function REgetAutoCamAnimEnable(){
  return Module.RealBIMWeb.GetAutoCamAnimEnable();
}
//设置相机自动动画参数
function REsetAutoCamAnimParams(pot,speed,bool){
  var val = 2*3.1415/speed;
  Module.RealBIMWeb.SetAutoCamAnimParams(pot,val);
  Module.RealBIMWeb.SetAutoCamAnimEnable(bool);
}

//地理坐标信息相关
//增加一套地理信息坐标系
//strName：表示地理坐标系的标识名
//ProjType:'w'表示Web墨卡托投影，'c'表示经纬度投影
//arrRgn:资源覆盖总范围    
//arrTopTileInfo:加载的顶层块信息<x,y,z> x,y:lon,lat分块编号 ，z:Lod等级
//uStartLOD:切片服务的起始层级
function REaddGeoCoord(strName,strProjType,arrRgn,arrTopTileInfo,uStartLOD){
  return Module.RealBIMWeb.AddGeoCoord(strName,strProjType,arrRgn,arrTopTileInfo,uStartLOD);
}
//地理坐标信息相关
//增加一套自定义坐标系
function REaddCustomCoord(name,refpointarr,targetpointarr){
  var ref01 = refpointarr[0];var ref02 = refpointarr[1];var ref03 = refpointarr[2];var ref04 = refpointarr[3];
  var target01 = targetpointarr[0];var target02 = targetpointarr[1];var target03 = targetpointarr[2];var target04 = targetpointarr[3];
  return Module.RealBIMWeb.AddCustomCoord(name,ref01,ref02,ref03,ref04,target01,target02,target03,target04);
}
//删除一套地理信息坐标
function REdelGeoCoordInfo(name){
  return Module.RealBIMWeb.DelGeoCoordInfo(name);
}

// 轴网和标高相关
// 加载轴网和标高数据
function RErequestGridAndLevelData(urlRes,projName){
  var miscdataurl = urlRes+projName+"/miscs/GridAndLevelData.json";
  Module.RealBIMWeb.RequestProjectMiscData(miscdataurl);
}
//隐藏或显示轴网、标高
function REshowGridAndLevelBySceID(visible,sceArr){
  var tempsceids = new Module.RE_Vector_Str();
  for(i=0;i<sceArr.length;++i){
    tempsceids.push_back(sceArr[i]);
  }
  var bool =Module.RealBIMWeb.SetProjectMiscDataVisible(visible,tempsceids);
  return bool;
}
//设置轴网颜色
// clr ="FF0000"; //颜色
// alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
function REsetGridColor(clr,alpha){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  var intalphainfo =Math.round(alpha);
  var newalphainfo =(intalphainfo>15 ? (intalphainfo.toString(16)) : ("0"+intalphainfo.toString(16)));
  var clrinfo ="0x"+newalphainfo+newclr; 
  var clr = parseInt(clrinfo);
  Module.RealBIMWeb.SetAxisColor(clr);
}
//设置标高颜色
// clr ="FF0000"; //颜色
// alpha =25;  //透明度，255表示不透明，80表示半透明，0表示全透明
function REsetLevelColor(clr,alpha){
  var newclr01 = clr.substring(0,2); 
  var newclr02 = clr.substring(2,4); 
  var newclr03 = clr.substring(4,6); 
  var newclr = newclr03+newclr02+newclr01; 
  var intalphainfo =Math.round(alpha);
  var newalphainfo =(intalphainfo>15 ? (intalphainfo.toString(16)) : ("0"+intalphainfo.toString(16)));
  var clrinfo ="0x"+newalphainfo+newclr; 
  var clr = parseInt(clrinfo);
  Module.RealBIMWeb.SetLevelColor(clr);
}
//相机定位到某一个场景节点的某一个标高
function RElocateCamToLevelBySceID(sceID,levelGuid,useOffset,bootom,top){
  var offsetArr = [bootom,top];
  var bool = Module.RealBIMWeb.ClipAndTargetToLevel(sceID,levelGuid,useOffset,offsetArr);
  return bool;
}
//根据标高的id创建剖切面
function REcreatSectionByLevelID(sceID,levelGuid,offset){
  var bool = Module.RealBIMWeb.SingleSurfaceClipByLevelData(sceID,levelGuid,offset);
  return bool;
}
function REgetHeightByLevelID(sceID,levelGuid){
  return Module.RealBIMWeb.GetLevelHeight(sceID,levelGuid);
}
//测量轴网的距离（根据轴网id计算）
function REgetGridDistance(sceID,gridGuid0,gridGuid1){
  var griddist = Module.RealBIMWeb.MeasureGridDistance(sceID,gridGuid0,gridGuid1);
  return griddist;
}
//测量轴网的距离（根据鼠标选中的轴网计算）
function REbeginMesureGridDistance(){
  Module.RealBIMWeb.BeginMeasureGridDistance();
}
//设置轴网是否可选中
function REsetGridProbeEnable(bool){
  Module.RealBIMWeb.SetGridProbeEnable(bool);
}
//设置标高是否可选中
function REsetLevelProbeEnable(bool){
  Module.RealBIMWeb.SetLevelProbeEnable(bool);
}
//设置轴网和标高是否可被遮挡
function REsetMiscDataDepthTest(bool){
  Module.RealBIMWeb.SetMiscDataDepthTest(bool);
}

//获取系统中的全局元素骨骼总数
function REgetGolElemBoneNum(){
  return Module.RealBIMWeb.GetGolElemBoneNum();
}
//设置场景内构件集合使用的全局骨骼索引
//要绑定到某一个骨骼上的元素ID集合，array类型，为空表示设置场景内的全部构件
//uBoneID：要设置的骨骼索引
function REbindElemToBoneID(uElemArr,uBoneID){
  var _s = uElemArr.length;
  if(_s ==0){
    Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("","", 0xffffffff, 0, uBoneID); //绑定全部构件
  }else{
    var temparr=[];
    for(var i=0;i<_s;++i){
      temparr.push(uElemArr[i]);
      temparr.push(0);
    }
    var selids = new Uint32Array(temparr);
    var tempids;
    Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
    Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("","", tempids.byteLength, tempids.byteOffset, uBoneID);
  }
}
//多项目设置场景内构件集合使用的全局骨骼索引
//projName:项目名称，为空字符串则表示所有项目
//uElemArr:要绑定到某一个骨骼上的元素ID集合，array类型，为空表示设置场景内的全部构件
//uBoneID：要设置的骨骼索引
function REbindElemToBoneID_projs(projName,uElemArr,uBoneID){
  if(projName==""){
    Module.RealBIMWeb.SetHugeObjSubElemBoneIDs("","", 0xffffffff, 0, uBoneID); //绑定全部构件
  }else{
    var projid = Module.RealBIMWeb.ConvGolStrID2IntID(projName);
    var _s = uElemArr.length;
    if(_s ==0){
      Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(projName,"", 0xffffffff, 0, uBoneID); //绑定全部构件
    }else{
      var temparr=[];
      for(var i=0;i<_s;++i){
        temparr.push(uElemArr[i]);
        temparr.push(projid);
      }
      var selids = new Uint32Array(temparr);
      Module.RealBIMWeb.ReAllocHeapViews(selids.byteLength.toString()); 
      var tempids =Module.RealBIMWeb.GetHeapView_U32(0); tempids.set(selids, 0);
      Module.RealBIMWeb.SetHugeObjSubElemBoneIDs(projName,"", tempids.byteLength, tempids.byteOffset, uBoneID);
    }
  }
}
//设置全局元素骨骼的目标方位
//uBoneID：表示骨骼全局ID
//cDestLoc：表示骨骼的目标方位
//dInterval：表示骨骼从当前方位过渡到目标方位所需的时长
//uProcBatch：表示骨骼的方位过渡批次
//bSendPostEvent：表示骨骼方位过渡完毕后是否发送事件消息
function REsetGolElemBoneDestLoc(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent){
  return Module.RealBIMWeb.SetGolElemBoneDestLoc(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent);
}
//设置全局元素骨骼的目标方位扩展版,增加缩放系数
//uBoneID：表示骨骼全局ID
//cDestLoc：表示骨骼的目标方位
//dInterval：表示骨骼从当前方位过渡到目标方位所需的时长
//uProcBatch：表示骨骼的方位过渡批次
//bSendPostEvent：表示骨骼方位过渡完毕后是否发送事件消息
function REsetGolElemBoneDestLocExt(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent){
  return Module.RealBIMWeb.SetGolElemBoneDestLocExt(uBoneID,cDestLoc,dInterval,uProcBatch,bSendPostEvent);
}
//重置所有全局元素骨骼为默认方位
function REresetAllGolElemBones(){
  Module.RealBIMWeb.ResetAllGolElemBones();
}


// 字体设置相关
// 增加一种全局字体
function REaddAGolFont(fontid,height,width,weight){
  var _fontid = fontid.toString();
  var _fontinfo={
    m_bAntialiased: false, 
    m_fItalicRatio: 0, 
    m_sSilhouetteAmp: -64, 
    m_sWeightAmp: weight*64, 
    m_uHeight: height, 
    m_uWidth: width, 
    m_strFontType: "宋体", 
    m_strGolFontID: _fontid
  };
  return Module.RealBIMWeb.AddAGolFont(_fontinfo);
}
// 删除一种全局字体
function REdelAGolFont(fontid){
  var _fontid=fontid.toString();
  return Module.RealBIMWeb.DelAGolFont(_fontid);
}
// 获取全局字体数量
function REgetGolFontNum(){
  return Module.RealBIMWeb.GetGolFontNum();
}
// 获取一种全局字体信息
function REgetAGolFont(fontid){
  var _fontid=fontid.toString();
  return Module.RealBIMWeb.GetAGolFont(_fontid);
}
//获取全部全局字体信息
function REgetAllGolFont(){
  return Module.RealBIMWeb.GetAllGolFonts();
}

//设置阴影开关状态
function REsetShadowState(bool){
  var sinfo = Module.RealBIMWeb.GetSceShadowInfo(); 
  sinfo.m_bShadowEnable = bool;
  Module.RealBIMWeb.SetSceShadowInfo(sinfo);
}
//获取当前阴影开关状态
function REgetShadowState(){
  var shadowinfo = Module.RealBIMWeb.GetSceShadowInfo();
  return shadowinfo.m_bShadowEnable;
}
//设置边缘高光效果的启用状态
function REsetHugeModelBorderEmisEnable(bool){
  Module.RealBIMWeb.SetHugeModelBorderEmisEnable(bool);
}
//获取边缘高光效果的启用状态
function REgetHugeModelBorderEmisEnable(){
  return Module.RealBIMWeb.GetHugeModelBorderEmisEnable();
}
//设置地形边缘高光属性
function REsetUnVerHugeGroupBorderEmis(projname,sceid,amp,range){
  var emis = [amp,range];
  return Module.RealBIMWeb.SetUnVerHugeGroupBorderEmis(projname,sceid,emis);
}
//获取地形边缘高光属性
function REgetUnVerHugeGroupBorderEmis(projname,sceid){
  return Module.RealBIMWeb.GetUnVerHugeGroupBorderEmis(projname,sceid);
}
//设置模型边缘高光属性
function REsetHugeObjBorderEmis(projName,sceid,amp,range){
  var emis = [amp,range];
  return Module.RealBIMWeb.SetHugeObjBorderEmis(projName,sceid,emis);
}
//获取模型边缘高光属性
function REgetHugeObjBorderEmis(projName,sceid){
  return Module.RealBIMWeb.GetHugeObjBorderEmis(projName,sceid);
}


// 添加复杂标签样式2
function REaddCustomTag01(tagname, pos, tag_w1, tag_w2, tag_h1, tag_h2, caption, contents, pics, captionclr, contentsclr, backclr, frameclr) {
    temptags = new Module.RE_Vector_TAG();
    temptexregions = new Module.RE_Vector_SHP_TEX();
    for (i = 0; i < pics.length; ++i) {
        temptexregions.push_back({
            m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
            m_strTexPath: pics[i]["path"], m_qTexRect: pics[i]["rect"], m_uTexClrMult: 0xe0ffffff,
        });
    }
    temptextregions = new Module.RE_Vector_SHP_TEXT();
    temptextregions.push_back({
        m_strGolFontID: "RealBIMFont002", m_bTextWeight: true, m_uTextClr: captionclr, m_uTextBorderClr: 0x00000000,
        m_strText: caption,
        m_qTextRect: [-tag_w1 / 2, 0, tag_w1 / 2, tag_h1],
        m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x10/*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ /*| 0x100TEXT_FMT_WORDBREAK*/),
    });
    for (i = 0; i < contents.length; ++i) {
        temptextregions.push_back({
            m_strGolFontID: "RealBIMFont001", m_bTextWeight: false, m_uTextClr: contentsclr, m_uTextBorderClr: 0x00000000,
            m_strText: contents[i],
            m_qTextRect: [-tag_w1 / 2, -(i + 1) * tag_h2, -tag_w1 / 2 + tag_w2, -i * tag_h2],
            m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x8/*TEXT_FMT_LEFT*/ | 0x40/*TEXT_FMT_NOCLIP*/ | 0x100/*TEXT_FMT_WORDBREAK*/),
        });
    }
    tempobj = {
        m_strName: tagname, m_vPos: pos,
        m_vBgMinSize: [50, 10], m_vBgPadding: [5, 5], m_uBgAlignX: 1, m_uBgAlignY: 1,
        m_vArrowOrigin: [-5, 20], m_uBgColor: backclr,
        m_arrTexContents: temptexregions, m_arrTextContents: temptextregions,
    };

    frameline ={
        m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
        m_strTexPath: "", m_qTexRect: [0, 0, 0, 0], m_uTexClrMult: frameclr,
    };
    var framelinewidth = 2; var framegap = 6;
    frameline["m_qTexRect"] = [-tag_w1/2-framegap, tag_h1, tag_w1/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [-tag_w1/2-framegap, -framelinewidth, tag_w1/2+framegap, 0]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [-tag_w1/2-framegap, -tag_h2*contents.length-framelinewidth, tag_w1/2+framegap, -tag_h2*contents.length]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [-tag_w1/2-framegap, -tag_h2*contents.length-framelinewidth, -tag_w1/2-framegap+framelinewidth, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [tag_w1/2+framegap-framelinewidth, -tag_h2*contents.length-framelinewidth, tag_w1/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);

    temptags.push_back(tempobj);
    Module.RealBIMWeb.AddTags(temptags);
}
// 添加复杂标签样式2
function REaddCustomTag02(tagname, pos, tag_w, tag_h1, tag_h2, caption, contents, captionclr, contentsclr, backclr, frameclr) {
    temptags = new Module.RE_Vector_TAG();
    temptexregions = new Module.RE_Vector_SHP_TEX();
     temptextregions = new Module.RE_Vector_SHP_TEXT();
    temptextregions.push_back({
        m_strGolFontID: "RealBIMFont002", m_bTextWeight: true, m_uTextClr: captionclr, m_uTextBorderClr: 0x00000000,
        m_strText: caption,
        m_qTextRect: [-tag_w / 2, 0, tag_w / 2, tag_h1],
        m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x10/*TEXT_FMT_HCENTER*/ /*| 0x40TEXT_FMT_NOCLIP*/ /*| 0x100TEXT_FMT_WORDBREAK*/),
    });
    for (i = 0; i < contents.length; ++i) {
        sub_w = tag_w / contents[i].length; sub_base = -tag_w / 2;
        for (j = 0; j < contents[i].length; ++j) {
            temptextregions.push_back({
                m_strGolFontID: "RealBIMFont001", m_bTextWeight: false, m_uTextClr: contentsclr, m_uTextBorderClr: 0x00000000,
                m_strText: contents[i][j],
                m_qTextRect: [sub_base, -(i + 1) * tag_h2, sub_base + sub_w, -i * tag_h2],
                m_uTextFmtFlag: (0x2/*TEXT_FMT_VCENTER*/ | 0x8/*TEXT_FMT_LEFT*/ /*| 0x40TEXT_FMT_NOCLIP*/ | 0x100/*TEXT_FMT_WORDBREAK*/),
            });
            sub_base += sub_w;
        }
    }
    tempobj = {
        m_strName: tagname, m_vPos: pos,
        m_vBgMinSize: [50, 10], m_vBgPadding: [5, 5], m_uBgAlignX: 1, m_uBgAlignY: 1,
        m_vArrowOrigin: [-5, 20], m_uBgColor: backclr,
        m_arrTexContents: temptexregions, m_arrTextContents: temptextregions,
    };

    frameline ={
        m_vMinTexUV: [0.0, 0.0], m_vMaxTexUV: [1.0, 1.0], m_uFrameNumU: 1, m_uFrameNumV: 1, m_uFrameStrideU: 0, m_uFrameStrideV: 0, m_fFrameFreq: 0.0,
        m_strTexPath: "", m_qTexRect: [0, 0, 0, 0], m_uTexClrMult: frameclr,
    };
    var framelinewidth = 2; var framegap = 6;
    frameline["m_qTexRect"] = [-tag_w/2-framegap, tag_h1, tag_w/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [-tag_w/2-framegap, -tag_h2*contents.length-framelinewidth, tag_w/2+framegap, -tag_h2*contents.length]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [-tag_w/2-framegap, -tag_h2*contents.length-framelinewidth, -tag_w/2-framegap+framelinewidth, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
    frameline["m_qTexRect"] = [tag_w/2+framegap-framelinewidth, -tag_h2*contents.length-framelinewidth, tag_w/2+framegap, tag_h1+framelinewidth]; temptexregions.push_back(frameline);
    for (i = 0; i < contents.length; ++i) {
        subline_w_hori = (i == 0) ? framelinewidth : framelinewidth / 2; subline_w_vert = framelinewidth / 2;
        frameline["m_qTexRect"] = [-tag_w/2-framegap, -subline_w_hori-i*tag_h2, tag_w/2+framegap, 0-i*tag_h2]; temptexregions.push_back(frameline);
        sub_w = tag_w / contents[i].length; sub_base = -tag_w / 2-2;
        for (j = 0; j + 1 < contents[i].length; ++j) {
            frameline["m_qTexRect"] = [sub_base+sub_w-subline_w_vert, -(i+1) * tag_h2, sub_base+sub_w, -i * tag_h2]; temptexregions.push_back(frameline);
            sub_base += sub_w;
        }
    }

    temptags.push_back(tempobj);
    Module.RealBIMWeb.AddTags(temptags);
}

//获取地形的包围盒信息
function REgetUnVerHugeGroupBoundingBox(strProjName,strSceName){
  var tempbv =Module.RealBIMWeb.GetUnVerHugeGroupBoundingBox(strProjName,strSceName);
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]); aabbarr.push(tempbv[1][0]);  //Xmin、Xmax
  aabbarr.push(tempbv[0][1]); aabbarr.push(tempbv[1][1]);  //Ymin、Ymax
  aabbarr.push(tempbv[0][2]); aabbarr.push(tempbv[1][2]);  //Zmin、Zmax
  return aabbarr;
}
//设置地形场景节点的可见性
function REsetUnVerHugeGroupVisible(strProjName,strSceName,bVisible){
  Module.RealBIMWeb.SetUnVerHugeGroupVisible(strProjName,strSceName,bVisible);
}
//获取地形场景节点的可见性
function REgetUnVerHugeGroupVisible(strProjName,strSceName){
  return Module.RealBIMWeb.GetUnVerHugeGroupVisible(strProjName,strSceName);
}
//设置地形场景节点的深度偏移
//范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
function REsetUnVerHugeGroupDepthBias(strProjName,strSceName,fDepthBias){
  Module.RealBIMWeb.SetUnVerHugeGroupDepthBias(strProjName,strSceName,fDepthBias);
}
//设置地形的仿射变换信息
function REsetUnVerHugeGroupTransform(strProjName,strSceName,arrScale,arrRotate,arrOffset){
  Module.RealBIMWeb.SetUnVerHugeGroupTransform(strProjName,strSceName,arrScale,arrRotate,arrOffset);
}
//刷新地形模型，bLoadNewData：表示刷新主体数据后是否允许重新加载数据
function RErefreshUnVerHugeGroupMainData(strProjName,strSceName,bLoadNewData){
  Module.RealBIMWeb.RefreshUnVerHugeGroupMainData(strProjName,strSceName,bLoadNewData);
}

//设置复杂模型内子元素的深度偏移
//strProjName：表示要处理的项目名称，为空串则表示处理所有项目
//strSceName：表示要处理的场景节点的名称标识，若为空串则表示处理所有的
//objArr：表示要处理的构件id数组，若为空串则表示处理所有的
//fDepthBias:范围(-0.00001~0.00001,默认为0,小于0表示优先渲染，绝对值越大，偏移量越大)
function REsetHugeObjSubElemDepthBias(strProjName,strSceName,objArr,fDepthBias){
  var _s = objArr.length;  var _s01 = (_s*8).toString();
  Module.RealBIMWeb.ReAllocHeapViews(_s01); elemIds =Module.RealBIMWeb.GetHeapView_U32(0);
  for(i =0; i<_s; ++i)
  {
    var eleid = objArr[i];
    elemIds.set([eleid,0], i*2);
  }
  Module.RealBIMWeb.SetHugeObjSubElemDepthBias(strProjName,strSceName,elemIds.byteLength,elemIds.byteOffset,fDepthBias);
}
//获取模型的包围盒信息
function REgetHugeObjBoundingBox(strProjName,strSceName){
  var tempbv =Module.RealBIMWeb.GetHugeObjBoundingBox(strProjName,strSceName);
  var aabbarr = [];
  aabbarr.push(tempbv[0][0]); aabbarr.push(tempbv[1][0]);  //Xmin、Xmax
  aabbarr.push(tempbv[0][1]); aabbarr.push(tempbv[1][1]);  //Ymin、Ymax
  aabbarr.push(tempbv[0][2]); aabbarr.push(tempbv[1][2]);  //Zmin、Zmax
  return aabbarr;
}
//设置模型场景节点的可见性
function REsetHugeObjVisible(strProjName,strSceName,bVisible){
  Module.RealBIMWeb.SetHugeObjVisible(strProjName,strSceName,bVisible);
}
//获取模型场景节点的可见性
function REgetHugeObjVisible(strProjName,strSceName){
  return Module.RealBIMWeb.GetHugeObjVisible(strProjName,strSceName);
}
//设置模型场景节点的仿射变换信息
function REsetHugeObjTransform(strProjName,strSceName,arrScale,arrRotate,arrOffset){
  return Module.RealBIMWeb.SetHugeObjTransform(strProjName,strSceName,arrScale,arrRotate,arrOffset);
}
//刷新模型，bLoadNewData：表示刷新主体数据后是否允许重新加载数据
function RErefreshHugeObjMainData(strProjName,strSceName,bLoadNewData){
  Module.RealBIMWeb.RefreshHugeObjMainData(strProjName,strSceName,bLoadNewData);
}

//将地形场景节点投影到指定高度
//strProjName：表示要处理的项目名称，为空串则表示处理所有项目
//scename：表示要处理的复杂模型组的名称标识，若为空串则表示处理所有的复杂模型组
//heightType,height：  heightType==0：表示复杂模型组禁止投射到固定高度
//            heightType==1：height表示世界空间绝对高度
//            heightType==2：height表示非版本管理复杂模型组自身包围盒的相对高度范围(0~1)
//            heightType==3：height表示整个场景的非版本复杂模型总包围盒的相对高度范围(0~1)
function REprojUnVerHugeGroupToHeight(strProjName,strSceName,uHeightType,fHeight){
  Module.RealBIMWeb.ProjUnVerHugeGroupToHeight(strProjName,strSceName,uHeightType,fHeight);
}

// 创建文字矢量
//strTextName：表示添加的文字对象的id，字符串类型，全局唯一，如有重复则后添加的会替代先添加的文字对象
//strText：文字内容
//arrPos:文字对象的中心点坐标
//strFontName:文字对象的字体样式
//uFontClr:文字的颜色
//uBorderClr:文字的边框颜色
//fDist:文字的可视距离
function REcreateCustomTextShp(strTextName,strText,arrPos,strFontName,uFontClr,uBorderClr,fDist){
  var _fontName = (strFontName=="")?("RealBIMFont001"):(strFontName);
  Module.RealBIMWeb.CreateCustomTextShp(strTextName,strText,arrPos,_fontName,uFontClr,uBorderClr,fDist);
}
// 创建折线矢量
//strLineName：表示添加的折线对象的id，字符串类型，全局唯一，如有重复则后添加的会替代先添加的折线对象
//arrPos:折线对象的顶点坐标数组
//uLineClr:折线对象的颜色
//fDist:折线对象的可视距离
function REcreateCustomPolyline(strLineName,arrPos,uLineClr,fDist){
  var temparrpos =new Module.RE_Vector_vec3();
  for(var i=0;i<arrPos.length;++i){
    temparrpos.push_back(arrPos[i]);
  }
  Module.RealBIMWeb.CreateCustomPolyline(strLineName,temparrpos,uLineClr,fDist);
}
// 创建矢量面
//strRgnName：表示添加的折线对象的id，字符串类型，全局唯一，如有重复则后添加的会替代先添加的折线对象
//arrPos:折线对象的顶点坐标数组
//uRgnClr:折线对象的颜色,十六进制，分别表示ABGR,例如红色半透明是0x800000ff
//fDist:折线对象的可视距离
function RECreateCustomPolyRgn(strRgnName,arrPos,uRgnClr,fDist){
  var temparrpos =new Module.RE_Vector_vec3();
  for(var i=0;i<arrPos.length;++i){
    temparrpos.push_back(arrPos[i]);
  }
  Module.RealBIMWeb.CreateCustomPolyRgn(strRgnName,temparrpos,uRgnClr,fDist);
}

//设置相机位置的世界空间范围
//[[Xmin、Ymin、Zmin],[Xmax、Ymax、Zmax]]
function REsetCamBound(arrCamBound){
  Module.RealBIMWeb.SetCamBound(arrCamBound);
}
//获取相机位置的世界空间范围
function REgetCamBound(){
  return Module.RealBIMWeb.GetCamBound();
}
