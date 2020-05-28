import React from "react";
import { Config } from "./Config";
import _ from "lodash";
import { red, yellow, green, lime, blue } from "@ant-design/colors";
import { v4 } from "uuid";

const CryptoJS = require("crypto-js");
const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");

export function encrypt(data) {
  return CryptoJS.AES.encrypt(data, Config.secretKey);
}

export function decrypt(data) {
  var bytes = CryptoJS.AES.decrypt(data, Config.secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function removeProperty(object, remove) {
  var newObj = {};
  _(Object.keys(object))
    .filter((key) => _.includes(remove, key))
    .forEach((val) => {
      _.assign(newObj, { [val]: object[val] });
    });
  return newObj;
}

export const log = Config.logging
  ? {
      d: console.log.bind(
        console,
        `%c %s `,
        `color:white; background-color: #73d13d`
      ),
      e: console.log.bind(
        console,
        `%c %s `,
        `color:white; background-color: #ff4d4f`
      ),
      w: console.log.bind(
        console,
        `%c %s `,
        `color:white; background-color: #ffec3d`
      ),
      n: console.log.bind(
        console,
        `%c %s `,
        `color:white; background-color: #40a9ff`
      ),
    }
  : { d: () => {}, e: () => {}, w: () => {}, n: () => {} };

export function convert2Map(array) {
  const map = new Map();
  array.forEach((el) => {
    map.set(el.uid, el);
  });
  return map;
}

export function findByType(children, name) {
  const result = [];
  /* This is the array of result since Article can have multiple times the same sub-component */
  const type = [name];
  /* We can store the actual name of the component through the displayName or name property of our sub-component */
  React.Children.forEach(children, (child) => {
    const childType =
      child && child.type && (child.type.displayName || child.type.name);
    if (type.includes(childType)) {
      result.push(child);
    }
  });
  /* Then we go through each React children, if one of matches the name of the sub-component we’re looking for we put it in the result array */
  return result[0];
}

export function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

export function stripHeader(url) {
  var base64Data = url.replace(/^data:image\/png;base64,/, "");
  return base64Data;
}

export function fitToContainer(canvas) {
  // Make it visually fill the positioned parent
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  // ...then set the internal size to match
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

export function base64_encode(src, callback, strip = true) {
  if (!fs.existsSync(src)) {
    callback(null);
    return;
  }
  var img = new Image();
  img.onload = function () {
    console.log(src);
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL("image/png");
    callback(strip ? stripHeader(dataURL) : dataURL);
  };
  img.src = src;
}

export function saveImageToDisk(base64, path) {
  try {
    const path = ipcRenderer.sendSync("get-app-data-path");
    var buf = new Buffer(base64, "base64");
    fs.writeFileSync(path, buf);
  } catch (error) {
    log.e("Server", error);
  }
}

export function deleteImageInDisk(name) {
  try {
    const path = ipcRenderer.sendSync("get-app-data-path");
    fs.unlinkSync(`${path}/image/${name}.png`);
  } catch (error) {
    log.e("Server", error);
  }
}
