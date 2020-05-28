import db from "./Database/Connect";
import { FetchStateEnum, ServerTableEnum } from "../tools/Enum";
import { Config } from "../tools/Config";
import { log, stripHeader, base64_encode, decrypt } from "../tools/Snippets";
import moment from "moment";
import { v4 } from "uuid";
import _ from "lodash";
import Accounts from "./Model/Accounts";
import { object } from "prop-types";

const fetch = require("node-fetch");
const EventEmitter = require("events");
const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");

class DataManager extends EventEmitter {
  constructor() {
    super();
    this.fetching = false;
    this.running = false;
    this.requestSize = 0;
  }

  stateKeys = [
    "running",
    "fetching",
    "idle",
    "syncing",
    "queue",
    "offline",
    "error",
  ];

  initialize = async (wait = 1000) => {
    this.db = await db;
    this.wait = wait;
    this.requestSize = await this.getDatabyKey("bandwidth");
    return new Promise((resolve, reject) => {
      resolve({ data: this.db.value() });
    });
  };

  start = () => {
    this.switchState("running");
    this.interval();
    this.runQueue();
  };

  stop = () => {
    this.switchState("idling");
  };

  interval = async () => {
    // console.log(this.getState());

    this.emit("state-change", {
      state: this.getState(),
    });

    try {
      this.offline = await !this.checkConnection();
      this.version = await fetch(
        `${Config.endpoint}/${ServerTableEnum.Version}`
      ).then((res) => res.json());
      // this.totalEstimateBandwidth(this.version);
      const checkVersion = await this.compareVersion(this.version);
      const queue = await this.db.get("queue").value();
      if (checkVersion && queue.length <= 0) {
        this.syncFetchResults().then(({ server, local, ids }) => {
          this.getKeys().forEach((k) => {
            let postMerge = Promise.all(
              server[k].map(async (v) => await this.postProcess(k, v, server))
            );
            postMerge.then((res) =>
              this.saveSync(k, [...local[k], ...res], ids[k])
            );
          });
        });
      }
    } catch (err) {
      log.e("Data Manager", `Error ${err}`);
    }

    if (!this.running) return;
    setTimeout(this.interval, this.wait);
  };

  syncFetchResults = async () => {
    const token = await this.getDatabyKey("token");
    const version = await this.db.get("version").value();
    const local = {};
    const server = {};
    const ids = {};
    const merge = {};
    for (let i = 0; i < this.getKeys().length; i++) {
      const key = this.getKeys()[i];
      const localCount = this.countLocalDb(key);
      const fetched = await this.serverRead(key, localCount, version);
      _.assign(server, {
        [key]: await Promise.all(
          fetched.results
            ? fetched.results.map(async (v) => {
                const nid = await this.convertUIDtoMember(key, v.uid);
                let id = nid;
                if (nid === -1) {
                  id = await this.generateUniqueID(key);
                  await this.db
                    .get(`mapping.${key}`)
                    .push({ uid: v.uid, member: id })
                    .write();
                }
                const obj = { ...v, uid: id };
                return {
                  ...this.preProcess(key, obj),
                };
              })
            : []
        ),
      });
      _.assign(ids, {
        [key]: await Promise.all(
          fetched.ids.map(async (id) => await this.convertUIDtoMember(key, id))
        ),
      });
      _.assign(local, { [key]: await this.localRead(key) });
    }
    return { server, local, ids };
  };

  preProcess = (key, val) => {
    switch (key) {
      case "product":
      default:
        return val;
    }
  };

  postProcess = async (key, val, fromServer = true) => {
    switch (key) {
      case "product": {
        const imageName = `${val.uid}.png`;
        const path = ipcRenderer.sendSync("get-app-data-path");
        const ipath = `${path}/image/${imageName}`;
        if (fromServer && val.image && !fs.existsSync(ipath)) {
          var buf = new Buffer(val.image, "base64");
          fs.writeFileSync(ipath, buf);
        }
        const cid = fromServer
          ? await this.convertUIDtoMember("category", val.category)
          : await this.convertMembertoUID("category", val.category);
        const sid = fromServer
          ? await this.convertUIDtoMember("supplier", val.supplier)
          : await this.convertMembertoUID("supplier", val.supplier);
        let obj = {
          ...val,
          image: fromServer ? imageName : val.image,
          category: cid ? cid : null,
          supplier: sid ? sid : null,
        };
        if (!val.category) delete obj.category;
        if (!val.supplier) delete obj.supplier;
        if (!val.image) delete obj.image;
        return obj;
      }
      case "coupon": {
        let items = val.items;
        let obj = items
          ? {
              items: await Promise.all(
                items.map(async (v) => {
                  const cid = fromServer
                    ? await this.convertUIDtoMember("coupon", v.couponUID)
                    : await this.convertMembertoUID("coupon", v.couponUID);
                  const pid = fromServer
                    ? await this.convertUIDtoMember("product", v.itemUID)
                    : await this.convertMembertoUID("product", v.itemUID);
                  return { ...v, itemUID: pid, couponUID: cid };
                })
              ),
            }
          : {};
        return { ...val, ...obj };
      }
      case "receipt": {
        let items = val.items;
        const cid = fromServer
          ? await this.convertUIDtoMember("coupon", val.couponUID)
          : await this.convertMembertoUID("coupon", val.couponUID);
        const uid = fromServer
          ? await this.convertUIDtoMember("accounts", val.userUID)
          : await this.convertMembertoUID("accounts", val.userUID);
        items = items
          ? await Promise.all(
              items.map(async (v) => {
                const pid = fromServer
                  ? await this.convertUIDtoMember("product", v.itemUID)
                  : await this.convertMembertoUID("product", v.itemUID);
                const rid = fromServer
                  ? await this.convertUIDtoMember("receipt", v.receiptUID)
                  : await this.convertMembertoUID("receipt", v.receiptUID);
                return { ...v, itemUID: pid, receiptUID: rid };
              })
            )
          : [];
        return { ...val, items, couponUID: cid, userUID: uid };
      }
      default:
        return val;
    }
  };

  saveSync = (key, data, ids) => {
    let map = new Map();
    for (let i = 0; i < data.length; i++) {
      const e = data[i];
      map.set(e.uid, e);
    } // MERGE
    let m = Array.from(map.entries(), ([k, v]) => v);
    if (ids.length > 0) {
      m = m.filter((v) => _.includes(ids, v.uid));
    }
    const sync = m.map((val) => ({
      ...val,
      sync: true,
    }));
    this.localSet(key, sync);
    this.emit("data-change", {
      data: { [key]: sync },
    });
    this.localSave({ version: this.version });
    this.emit("version-change", {
      version: this.version, // this.version
    });
  };

  convertUIDtoMember = async (key, uid) => {
    if (!uid) return null;
    const ids = await this.db.get("mapping").value();
    const keys = ids[key];
    const f = keys.findIndex((o) => o.uid === uid);
    return f !== -1 ? ids[key][f].member : -1;
  };

  convertMembertoUID = async (key, uid) => {
    if (!uid) return null;
    const ids = await this.db.get("mapping").value();
    const keys = ids[key];
    const f = keys.find((o) => o.member === uid);
    return f ? f.uid : -1;
  };

  serverRead = async (key, count, lastModified = 0) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response, json, results;
    let url = `${Config.endpoint}/${key}/${lastModified}/count/${count}`;
    try {
      if (await this.checkConnection()) {
        log.n("Requested GET", url);
        response = await fetch(url, options).then((response) =>
          response.json().then((data) => ({
            data: data.data,
            ids: data.ids,
            status: response.status,
          }))
        );
      }

      if (response.status === 404) {
        throw new Error(
          `Read Error: Status ${response.status} -> Error in connection`
        );
      }

      json = results = response.data;

      log.n("Server", `Read Success : ${response.status}`);
    } catch (error) {
      log.e("Server", error);
    }
    const ids = response && response.hasOwnProperty("ids") ? response.ids : [];
    return { results, ids };
  };

  totalEstimateBandwidth = (res) => {
    const byte2GB = 1073741823.9999983;

    this.requestSize =
      this.requestSize +
      Buffer.byteLength(JSON.stringify(res, "utf8")) / byte2GB;

    this.percentBandwidth = (this.requestSize / 3) * 100;

    this.db.set("bandwidth", this.requestSize).write();
    this.db.set("percentBandwidth", +this.percentBandwidth.toFixed(9)).write();
  };

  countLocalDb = (key) => {
    return this.db.get(key).value().length;
  };

  getKeys = () => {
    return ["accounts", "category", "supplier", "product", "coupon", "receipt"];
  };

  compareVersion = async (version) => {
    return (await this.db.get("version").value()) !== version;
  };

  checkConnection = async () => {
    try {
      const connection = await fetch(
        `${Config.endpoint}/${ServerTableEnum.Version}`
      );
      return true;
    } catch (error) {
      return false;
    }
  };

  runQueue = async () => {
    let queue;
    await new Promise(async (resolve, reject) => {
      queue = this.db.get("queue").value();
      if (queue.length <= 0) {
        resolve();
        return;
      }
      let q = queue[0];
      switch (q.method) {
        case "insert": {
          let response = await this.serverInsert(q.key, q.value, true);
          if (response.status === 201) {
            queue.splice(0, 1);
            this.db.set("queue", queue).write();
            // this.db
            //   .get(q.key)
            //   .find({ uid: q.ref })
            //   .assign({ uid: response.value.uid })
            //   .write();
          }
          break;
        }
        case "update": {
          let response = await this.serverUpdate(q.key, q.value, q.ref, true);
          if (response.status === 200) {
            queue.splice(0, 1);
            this.db.set("queue", queue).write();
          }
          break;
        }
        case "delete": {
          let response = await this.serverDelete(q.key, q.ref, true);
          if (response.status === 200) {
            queue.splice(0, 1);
            this.db.set("queue", queue).write();
          }
          break;
        }
        default:
          break;
      }
      resolve();
    });
    setTimeout(this.runQueue, this.wait);
  };

  addToQueue = (key, ref, method, value) => {
    let queue = this.db.get("queue").value();
    this.db
      .set("queue", [
        ...queue,
        {
          key,
          ref,
          method,
          value,
        },
      ])
      .write();
  };

  generateUniqueID = async (key) => {
    const ids = (await this.getDatabyKey(key)).map((val) => val.uid);
    var newID;
    do {
      newID = v4();
    } while (_.includes(ids, newID));
    return newID;
  };

  serverInsert = async (key, value, isQueue = false) => {
    let original = value;
    value = await this.postProcess(key, value, false);
    let response;
    try {
      let queue = await this.db.get("queue").value();
      if (queue.length > 0 && !isQueue) {
        response = { status: 404, value };
        if (!isQueue) this.addToQueue(key, original.uid, "insert", original);
        throw new Error(`Delete Queued: No Connection was Established`);
      }
      if (await this.checkConnection()) {
        let options = {
          method: "POST",
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
          },
        };
        log.n("Requested POST", `${Config.endpoint}/${key}`);
        response = await fetch(`${Config.endpoint}/${key}`, { ...options });
        if (response.status !== 201) {
          if (!isQueue) this.addToQueue(key, original.uid, "insert", original);
          throw new Error(`Queued: Status ${response.status}`);
        } else {
          let body = await response.json();
          await this.db
            .get(`mapping.${key}`)
            .push({ uid: body.uid, member: value.uid })
            .write();
        }
        log.n(
          "Server",
          `Insert Success : ${JSON.stringify(value).slice(0, 100)}`
        );
      } else {
        if (!isQueue) this.addToQueue(key, original.uid, "insert", original);
        response = { status: 404, value };
        throw new Error(`Update Queued: No Connection was Established`);
      }
    } catch (error) {
      log.e("Server", error);
    }
    console.log(response);
    return { status: response.status, value };
  };

  serverUpdate = async (key, value, id, isQueue = false) => {
    let o = { value, uid: id };
    value = await this.postProcess(key, value, false);
    const uid = await this.convertMembertoUID(key, id);
    delete value.uid;
    let response;

    let queue = await this.db.get("queue").value();
    try {
      let queue = await this.db.get("queue").value();
      if (queue.length > 0 && !isQueue) {
        response = { status: 404, value };
        if (!isQueue) this.addToQueue(key, o.uid, "update", o.value);
        throw new Error(`Delete Queued: No Connection was Established`);
      }
      if (await this.checkConnection()) {
        let options = {
          method: "PUT",
          body: JSON.stringify(value),
          headers: {
            "Content-Type": "application/json",
          },
        };
        log.n("Requested PUT", `${Config.endpoint}/${key}/${uid}`);
        response = await fetch(`${Config.endpoint}/${key}/${uid}`, options);
      } else {
        if (!isQueue) this.addToQueue(key, o.uid, "update", o.value);
        throw new Error(`Update Queued: No Connection was Established`);
      }
      if (response.status === 404) {
        if (!isQueue) this.addToQueue(key, o.uid, "update", o.value);
        throw new Error(
          `Update Queued: Status ${response.status} -> Reference was not found`
        );
      } else {
        log.n("Server", `Update Success : ${JSON.stringify(value)}`);
      }
    } catch (error) {
      log.e("Server", error);
      return error;
    }

    return response;
  };

  serverDelete = async (key, id, isQueue = false) => {
    let o = id;
    const uid = await this.convertMembertoUID(key, id);
    let options = {
      method: "DELETE",
      body: JSON.stringify({ uid }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response;

    try {
      let queue = await this.db.get("queue").value();
      if (queue.length > 0 && !isQueue) {
        if (!isQueue) this.addToQueue(key, id, "delete", {});
        throw new Error(`Delete Queued: No Connection was Established`);
      }
      if (await this.checkConnection()) {
        log.n("Requested DELETE", `${Config.endpoint}/${key}/${uid}`);
        response = await fetch(`${Config.endpoint}/${key}/${uid}`, options);
        await this.db
          .get(`mapping.${key}`)
          .remove((v) => v.uid === uid)
          .write();
      } else {
        if (!isQueue) this.addToQueue(key, id, "delete", {});
        throw new Error(`Delete Queued: No Connection was Established`);
      }
      if (response.status === 404) {
        if (!isQueue) this.addToQueue(key, id, "delete", {});
        throw new Error(
          `Delete Queued: Status ${response.status} -> Reference was not found`
        );
      } else {
        log.n("Server", `Delete Success : ${JSON.stringify(uid)}`);
      }
    } catch (error) {
      log.e("Server", error);
      return error;
    }

    return response;
  };

  localRead = async (key) => {
    let response, data;
    try {
      response = this.db.has(key).value();

      if (!response) {
        throw new Error(`Read Error: No ${key} value was found in db`);
      }
      data = this.db.get(key).value();

      log.d("Local", `Read Success : ${JSON.stringify(response)}`);
      return data;
    } catch (error) {
      log.e("Local", error);
      return { response: false, value: key };
    }
  };

  localInsert = async (key, value) => {
    let newInsert = value;
    try {
      this.db
        .get(key)
        .push({ ...newInsert, sync: false })
        .write();
      log.d("Local", `Insert Success : ${JSON.stringify(newInsert)}`);
    } catch (error) {
      log.e("Local", error);
    }
  };

  localUpdate = async (key, value, uid) => {
    let newInsert = value;
    try {
      this.db
        .get(key)
        .find({ uid: uid })
        .assign({ ...newInsert, sync: false })
        .write();
      log.d("Local", `Update Success : ${JSON.stringify(newInsert)}`);
    } catch (error) {
      log.e("Local", error);
    }
  };

  localDelete = async (key, uid) => {
    try {
      this.db
        .get(key)
        .remove((val) => val.uid === uid)
        .write();
      log.d("Local", `Delete Success : ${JSON.stringify(uid)}`);
    } catch (error) {
      log.e("Local", error);
    }
  };

  localSet = async (key, value) => {
    this.db.set(key, value).write();
  };

  truncateDelete = async (key) => {
    this.db.set(key, []).write();
    log.d("Local", `Delete ALL Success : ${JSON.stringify(key)}`);
  };

  localSave = (obj) => {
    Object.keys(obj).forEach(async (key) => {
      this.db.set(key, obj[key]).write();
    });
  };

  getDatabyKey = async (key) => {
    return await this.db.get(key).value();
  };

  getAllData = async () => {
    return this.db.value();
  };

  switchState = (key) => {
    this.stateKeys.forEach((val) => {
      this[val] = key === val;
    });
  };

  getState = () => {
    return _(this.stateKeys)
      .filter((val) => this[val])
      .first();
  };

  loginUser = async ({ username, password }) => {
    const accounts = await this.getDatabyKey(ServerTableEnum.Accounts);
    const find = accounts.findIndex((val) => val.username === username);
    if (find === -1) {
      log.e("Local", "No User Matched!");
      return { state: false, message: "No user matched!" };
    } else {
      const matchPass = decrypt(accounts[find].password);
      const origPass = decrypt(password);
      if (matchPass === origPass) {
        log.n("Local", "Login Success");
        return { state: true, user: accounts[find], message: "Login Success!" };
      }
      log.e("Local", "Password Incorrect!");
      return { state: false, message: "Password incorrect!" };
    }
  };

  registerUser = async (data) => {
    const accounts = await this.getDatabyKey(ServerTableEnum.Accounts);
    const find = accounts.findIndex((val) => val.username === data.username);
    if (!this.checkConnection()) {
      log.e("Local", "No Connection can be established!");
      return { state: false, message: "No connection can be established" };
    }
    if (find === -1) {
      const newAcc = new Accounts({ ...data });
      let options = {
        method: "POST",
        body: JSON.stringify(newAcc),
        headers: {
          "Content-Type": "application/json",
        },
      };
      let response = await fetch(`${Config.endpoint}/accounts`, { ...options });
      if (response.status === 201) {
        return { state: true, message: "Registration Successful!" };
      } else {
        return { state: false, message: "Connection Refused!" };
      }
    } else {
      log.e("Local", "User already exist!");
    }
    return false;
  };

  logoutUser = async () => {
    await this.db.set("token", null).write();
    return true;
  };
}

const dbm = new DataManager();

export default dbm;
