"use strict";

// base.js
/* global COMMONLIBRARY */
var COMMONLIBRARY = COMMONLIBRARY || {};

/* namespace 생성 */
COMMONLIBRARY.createNs = function createNs(ns) {
  let parts = ns.split(".");
  let parent = COMMONLIBRARY;
  let partsLen;
  let i;
  if (parts[0] === "COMMONLIBRARY") parts = parts.slice(1);
  partsLen = parts.length;
  for (i = 0; i < partsLen; i++) {
    if (typeof parent[parts[i]] === "undefined") parent[parts[i]] = {};
    parent = parent[parts[i]];
  }
  return parent;
};

// view.js
COMMONLIBRARY.createNs("view");

COMMONLIBRARY.view = (function () {
  return {
    scaleValueX: 1,
    scaleValueY: 1,
    scale: 1,

    setScale: function () {
      let windowW = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth;
      let windowH = document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight;

      if (Math.floor(window.visualViewport.height) < windowH) {
        if (qs("#wrap").attr("data-view") !== "false") {
          windowW = window.visualViewport.width;
          windowH = window.visualViewport.height;
        }
      }

      // var wrapEl = document.getElementById("wrap");
      let wrapEl = $(SHADOW_WRAP).find("#wrap")[0];
      let _scaleValueX = windowW / wrapEl.clientWidth;
      let _scaleValueY = windowH / wrapEl.clientHeight;
      let _scale = _scaleValueX < _scaleValueY ? _scaleValueX : _scaleValueY;

      this.scaleValueX = _scaleValueX;
      this.scaleValueY = _scaleValueY;
      this.scale = _scale;

      let transCommon = `transform: scale(${_scale},${_scale});`;
      let transMs = `-ms-transform: scale(${_scale},${_scale});`;
      let transWeb = `-webkit-transform: scale(${_scale},${_scale});`;

      let transform = transCommon + transMs + transWeb;

      //wrapEl setScale
      let left = windowW / 2 - (wrapEl.clientWidth / 2) * _scale + "px";
      let top = windowH / 2 - (wrapEl.clientHeight / 2) * _scale + "px";
      let originTxt = "transform-origin: 0% 0%; -ms-transform-origin: 0% 0%; -webkit-transform-origin: 0% 0%;";

      wrapEl.setAttribute("style", transform + originTxt + "left:" + left + ";" + "top:" + top);
    },
  };
})();

// lib.js
/* 선택자*/
const qs = (el) => $(SHADOW_WRAP).find(el);

// common.js
var SHADOW_ROOT;
try {
  SHADOW_ROOT = document.querySelector("remote-html-embed").shadowRoot;
} catch (error) {
  SHADOW_ROOT = document.querySelector("your-component").shadowRoot;
}

var SHADOW_WRAP = SHADOW_ROOT.getElementById("classStyudyContent");

function initCommonScrit() {
  let view = COMMONLIBRARY.view;
  view.setScale();
}

window.addEventListener("resize", COMMONLIBRARY.view.setScale);

const scaleFunc = () => {
  let winW = document.body.clientWidth || window.innerWidth || document.documentElement.clientWidth;
  let winH = document.body.clientHeight || window.innerHeight || document.documentElement.clientHeight;

  if (Math.floor(window.visualViewport.height) < winH) {
    if (qs("#wrap").attr("data-view") !== "false") {
      winW = window.visualViewport.width;
      winH = window.visualViewport.height;
    }
  }

  let wrapEl = $(SHADOW_WRAP).find("#wrap")[0];
  let scaleX = winW / wrapEl.clientWidth;
  let scaleY = winH / wrapEl.clientHeight;
  return scaleX < scaleY ? scaleX : scaleY;
};

const pageFunc = (page1, page2) => {
  qs(page1).css("display", "none");
  qs(page2).css("display", "flex");
  Sound.click();
};

const howPopup = (method) => {
  if (method === "add") qs(".how_popup").addClass("active");
  else if (method === "remove") qs(".how_popup").removeClass("active");
  Sound.click();
};

// 텍스트 가져오기
const getPureText = (el) =>
  [...el.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join("");
