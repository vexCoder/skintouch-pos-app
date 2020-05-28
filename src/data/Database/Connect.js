import { encrypt, decrypt } from "../../tools/Snippets";

const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");

const low = require("lowdb");
const FileAsync = window.require("lowdb/adapters/FileAsync");
// const CryptoJS = require("crypto-js");

const isDev = window.require("electron-is-dev");
const encryption = {
  serialize: (data) => encrypt(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decrypt(data)),
};

const path = ipcRenderer.sendSync("get-app-data-path");

const adapter = !isDev
  ? new FileAsync(`${path}/db.json`, encryption)
  : new FileAsync(`${path}/db.json`);

// const encrypt = (data, key) => CryptoJS.AES.encrypt(data, secretKey);
// const decrypt = (data, key) => {
//   var bytes  = CryptoJS.AES.decrypt(data, secretKey);
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// }

const db = low(adapter);

// fs.truncate(`${path}/db.json`, 0, function () {
//   console.log("done");
// }); // DELETE AFTER

db.then((db) => {
  return db
    .defaults({
      theme: "light",
      version: 0,
      mapping: {
        product: [],
        supplier: [],
        category: [],
        coupon: [],
        receipt: [],
        accounts: [],
      },
      product: [],
      supplier: [],
      category: [],
      coupon: [],
      receipt: [],
      accounts: [],
      queue: [],
      favorites: [],
      bandwidth: 0,
      percentBandwidth: 0,
      tax: 0.12,
      stock: 0,
      token: null,
    })
    .write();
});

export default db;
