/*
 * @Author: Songjq
 * @Date: 2021-12-19 20:31:39
 * @Desscription: 获取浏览器信息
 */
export function GetCurrentBrowser() {
  let ua = navigator.userAgent.toLocaleLowerCase();
  let browserType = null;
  if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
    browserType = "IE";
  } else if (ua.match(/firefox/) != null) {
    browserType = "Firefox";
  } else if (ua.match(/ucbrowser/) != null) {
    browserType = "UC";
  } else if (ua.match(/opera/) != null || ua.match(/opr/) != null) {
    browserType = "Opera";
  } else if (ua.match(/bidubrowser/) != null) {
    browserType = "Baidu";
  } else if (ua.match(/metasr/) != null) {
    browserType = "Sougou";
  } else if (
    ua.match(/tencenttraveler/) != null ||
    ua.match(/qqbrowse/) != null
  ) {
    browserType = "QQ";
  } else if (ua.match(/maxthon/) != null) {
    browserType = "Maxthon";
  } else if (ua.match(/chrome/) != null) {
    var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
    if (is360) {
      browserType = "360";
    } else {
      browserType = "Chrome";
    }
  } else if (ua.match(/safari/) != null) {
    browserType = "Safari";
  } else {
    browserType = "Others";
  }
  return browserType;
}

function _mime(option, value) {
  var mimeTypes = navigator.mimeTypes;
  for (var mt in mimeTypes) {
    if (mimeTypes[mt][option] === value) {
      return true;
    }
  }
  return false;
}
