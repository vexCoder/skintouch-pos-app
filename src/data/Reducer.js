import dbm from "./DataManager";
import _ from "lodash";
import { removeProperty, convert2Map, log, decrypt } from "../tools/Snippets";
import { Config } from "../tools/Config";
import Category from "./Model/Category";
import { ServerTableEnum } from "../tools/Enum";
import Supplier from "./Model/Supplier";
import Product from "./Model/Product";
import Receipt from "./Model/Receipt";
import Coupon from "./Model/Coupon";
import CouponItem from "./Model/CouponItem";
import ReceiptItem from "./Model/ReceiptItem";
import Accounts from "./Model/Accounts";

const { ipcRenderer } = window.require("electron");

export default (state, action) => {
  log.d(action.type, action.payload);
  var nextContext;
  switch (action.type) {
    case "SWITCH_THEME": {
      const theme = state.theme === "light" ? "dark" : "light";
      nextContext = {
        ...state,
        theme: theme,
      };
      dbm.localSave({ theme });
      break;
    }
    case "SET_THEME": {
      const theme = action.payload;
      nextContext = {
        ...state,
        theme: theme,
      };
      break;
    }
    case "SET_TAX": {
      const tax = action.payload;
      nextContext = {
        ...state,
        tax: tax,
      };
      break;
    }
    case "SET_STOCK": {
      const stock = action.payload;
      nextContext = {
        ...state,
        stock: stock,
      };
      break;
    }
    case "SWITCH_TAB": {
      nextContext = { ...state, tab: action.payload };
      break;
    }
    case "PUSH_NOTIF": {
      nextContext = {
        ...state,
        notification: [
          ...state.notification,
          { ...action.payload, show: true },
        ],
      };
      break;
    }
    case "HIDE_NOTIF": {
      nextContext = state;
      nextContext.notification[action.payload].show = false;
      break;
    }
    case "POP_NOTIF": {
      nextContext = {
        ...state,
        notification: _.slice(
          state.notification,
          1,
          state.notification.length - 1
        ),
      };
      break;
    }
    case "SYNC_LOCAL_DATA": {
      nextContext = { ...state };
      Object.keys(action.payload).forEach((key) => {
        const value = action.payload[key];
        // if (key === "token" && !value) {
        //   ipcRenderer.send("return-to-login");
        // }
        if (key === "mapping") return nextContext;
        if (
          value != null &&
          typeof value === "object" &&
          key !== "queue" &&
          key !== "favorites"
        ) {
          nextContext = {
            ...nextContext,
            [key]: convert2Map(
              value.map((val) => {
                switch (key) {
                  case "product":
                    return new Product(val);
                  case "category":
                    return new Category(val);
                  case "supplier":
                    return new Supplier(val);
                  case "coupon":
                    return new Coupon({
                      ...val,
                      items: val.items.map((item) => new CouponItem(item)),
                    });
                  case "receipt":
                    return new Receipt({
                      ...val,
                      items: val.items.map((item) => new ReceiptItem(item)),
                    });
                  case "accounts":
                    return new Accounts(val);
                  default:
                    return {};
                    break;
                }
              })
            ),
          };
        } else {
          nextContext = {
            ...nextContext,
            [key]:
              key === "token" && value != null
                ? JSON.parse(decrypt(value))
                : value,
          };
        }
      });
      break;
    }
    case "SET_VERSION": {
      const version = action.payload;
      nextContext = { ...state, version: version };
      dbm.localSave({ version });
      break;
    }
    case "SET_FAVORITE": {
      const favorite = action.payload;
      nextContext = { ...state, favorites: favorite };
      dbm.localSave({ favorites: favorite });
      break;
    }
    case "ADD_CATEGORY": {
      const map = state.category.set(
        action.payload.uid,
        new Category(action.payload)
      );
      nextContext = { ...state, category: map };
      break;
    }
    case "EDIT_CATEGORY": {
      const { uid, name, description } = action.payload;
      const last = state.category.get(uid);
      if (!last) break;
      const map = state.category.set(
        uid,
        new Category({ ...last, name: name, description: description })
      );
      nextContext = { ...state, category: map };
      break;
    }
    case "DELETE_CATEGORY": {
      const { uid } = action.payload;
      const check = state.category.has(uid);
      if (!check) break;
      state.category.delete(uid);
      nextContext = { ...state, category: state.category };
      break;
    }
    case "ADD_SUPPLIER": {
      const map = state.supplier.set(
        action.payload.uid,
        new Supplier(action.payload)
      );
      nextContext = { ...state, supplier: map };
      break;
    }
    case "EDIT_SUPPLIER": {
      const { uid, name, location } = action.payload;
      const last = state.supplier.get(uid);
      if (!last) break;
      const map = state.supplier.set(
        uid,
        new Supplier({ ...last, name, location })
      );
      nextContext = { ...state, supplier: map };
      break;
    }
    case "DELETE_SUPPLIER": {
      const { uid } = action.payload;
      const check = state.supplier.has(uid);
      if (!check) break;
      state.supplier.delete(uid);
      nextContext = { ...state, supplier: state.supplier };
      break;
    }
    case "ADD_PRODUCT": {
      const map = state.product.set(
        action.payload.uid,
        new Product(action.payload)
      );
      nextContext = { ...state, product: map };
      break;
    }
    case "EDIT_PRODUCT": {
      const last = state.product.get(action.payload.uid);

      if (!last) break;
      const map = state.product.set(
        action.payload.uid,
        new Product({ ...last, ...action.payload })
      );
      nextContext = { ...state, product: map };
      break;
    }
    case "DELETE_PRODUCT": {
      const { uid } = action.payload;
      const check = state.product.has(uid);
      if (!check) break;
      state.product.delete(uid);
      nextContext = { ...state, product: state.product };
      break;
    }
    case "PUNCH_RECEIPT": {
      const receipt = new Receipt(action.payload);
      const map = state.receipt.set(receipt.uid, receipt);
      nextContext = { ...state, receipt: map };
      break;
    }
    case "ADD_COUPON": {
      const coupon = new Coupon(action.payload);
      const map = state.coupon.set(coupon.uid, coupon);
      nextContext = { ...state, coupon: map };
      break;
    }
    case "EDIT_COUPON": {
      const last = state.coupon.get(action.payload.uid);
      if (!last) {
        log.e(action.type, `No ${action.payload} was found`);
      } else {
        const map = state.coupon.set(
          action.payload.uid,
          new Coupon({ ...last, ...action.payload })
        );
        nextContext = { ...state, coupon: map };
      }
      break;
    }
    case "DELETE_COUPON": {
      const { uid } = action.payload;
      const check = state.coupon.has(uid);
      if (!check) {
        log.e(action.type, `No ${action.payload} was found`);
      } else {
        state.coupon.delete(uid);
        nextContext = { ...state, coupon: state.coupon };
      }
      break;
    }
    case "ADD_ACCOUNT": {
      const map = state.accounts.set(
        action.payload.uid,
        new Accounts(action.payload)
      );
      nextContext = { ...state, accounts: map };
      break;
    }
    case "EDIT_ACCOUNT": {
      const { uid, name, description } = action.payload;
      const last = state.accounts.get(uid);
      if (!last) {
        log.e(action.type, `No ${action.payload} was found`);
      } else {
        const map = state.accounts.set(
          uid,
          new Accounts({ ...last, name, description })
        );
        nextContext = { ...state, accounts: map };
      }
      break;
    }
    case "DELETE_ACCOUNT": {
      const { uid } = action.payload;
      const check = state.accounts.has(uid);
      if (!check) {
        log.e(action.type, `No ${action.payload} was found`);
      } else {
        state.accounts.delete(uid);
        nextContext = { ...state, accounts: state.accounts };
      }
      break;
    }
    default:
      break;
  }
  return { ...state, ...nextContext };
};
