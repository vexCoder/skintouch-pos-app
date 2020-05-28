import dbm from "../DataManager";
import { v4 as uuid4 } from "uuid";
import { ServerTableEnum } from "../../tools/Enum";
import Category from "../Model/Category";
import Supplier from "../Model/Supplier";
import Product from "../Model/Product";
import {
  log,
  base64_encode,
  saveImageToDisk,
  stripHeader,
  deleteImageInDisk,
} from "../../tools/Snippets";
import _ from "lodash";

const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");

export default class ProductActions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  addCategory = async (value) => {
    const { name, description } = value;
    const category = new Category({
      uid: await dbm.generateUniqueID(ServerTableEnum.Category),
      name,
      description,
    });
    dbm.serverInsert(ServerTableEnum.Category, category);
    dbm.localInsert(ServerTableEnum.Category, category);
    this.dispatch({
      type: "ADD_CATEGORY",
      payload: { ...category },
    });
  };

  editCategory = (value) => {
    const category = new Category(value);
    dbm.serverUpdate(ServerTableEnum.Category, category, category.uid);
    dbm.localUpdate(ServerTableEnum.Category, category, category.uid);
    this.dispatch({
      type: "EDIT_CATEGORY",
      payload: { ...category },
    });
  };

  deleteCategory = (uid) => {
    dbm.serverDelete(ServerTableEnum.Category, uid);
    dbm.localUpdate(ServerTableEnum.Category, uid);
    this.dispatch({
      type: "DELETE_CATEGORY",
      payload: { uid },
    });
  };

  addSupplier = async (value) => {
    const supplier = new Supplier({
      uid: await dbm.generateUniqueID(ServerTableEnum.Supplier),
      ...value,
    });
    dbm.serverInsert(ServerTableEnum.Supplier, supplier);
    dbm.localInsert(ServerTableEnum.Supplier, supplier);
    this.dispatch({
      type: "ADD_SUPPLIER",
      payload: supplier,
    });
  };

  editSupplier = (value) => {
    dbm.serverUpdate(ServerTableEnum.Supplier, value, value.uid);
    dbm.localUpdate(ServerTableEnum.Supplier, value, value.uid);
    this.dispatch({
      type: "EDIT_SUPPLIER",
      payload: value,
    });
  };

  deleteSupplier = (uid) => {
    dbm.serverDelete(ServerTableEnum.Supplier, uid);
    dbm.localDelete(ServerTableEnum.Supplier, uid);
    this.dispatch({
      type: "DELETE_SUPPLIER",
      payload: { uid },
    });
  };

  addProduct = async (value) => {
    console.log(value);
    const image = stripHeader(value.image);
    const path = ipcRenderer.sendSync("get-app-data-path");
    const product = new Product({
      ...value,
      uid: await dbm.generateUniqueID(ServerTableEnum.Product),
      image,
    });
    const imagePath = `${path}\\image\\${product.uid}.png`;
    var buf = new Buffer(image, "base64");
    fs.writeFileSync(imagePath, buf);
    dbm.serverInsert(ServerTableEnum.Product, product);
    dbm.localInsert(
      ServerTableEnum.Product,
      new Product({ ...product, image: `${product.uid}.png` })
    );
    this.dispatch({
      type: "ADD_PRODUCT",
      payload: { ...product, image: `${product.uid}.png` },
    });
  };

  editProduct = (value) => {
    console.log(value);
    const image = stripHeader(value.image);
    const path = ipcRenderer.sendSync("get-app-data-path");
    const imagePath = `${path}\\image\\${value.uid}.png`;
    const product = new Product(value);
    console.log(imagePath);
    var buf = new Buffer(image, "base64");
    fs.writeFileSync(imagePath, buf);
    dbm.serverUpdate(
      ServerTableEnum.Product,
      {
        ...product,
        image: image,
      },
      product.uid
    );
    dbm.localUpdate(
      ServerTableEnum.Product,
      new Product({ ...product, image: `${value.uid}.png` }),
      product.uid
    );
    this.dispatch({
      type: "EDIT_PRODUCT",
      payload: { ...product, image: `${value.uid}.png` },
    });
  };

  updateStock = (value, quantity) => {
    console.log(value);
    const nQuant = value.stock + quantity;
    dbm.serverUpdate(ServerTableEnum.Product, { stock: nQuant }, value.uid);
    dbm.localUpdate(
      ServerTableEnum.Product,
      new Product({ ...value, stock: nQuant }),
      value.uid
    );
    this.dispatch({
      type: "EDIT_PRODUCT",
      payload: { uid: value.uid, stock: nQuant },
    });
  };

  deleteProduct = (uid) => {
    dbm.serverDelete(ServerTableEnum.Product, uid);
    dbm.localDelete(ServerTableEnum.Product, uid);
    deleteImageInDisk(uid);
    this.dispatch({
      type: "DELETE_PRODUCT",
      payload: { uid },
    });
  };

  updateFavorite = (uid) => {
    dbm.getDatabyKey("favorites").then((favorites) => {
      let findIndex = _.findIndex(favorites, (val) => val === uid);
      if (findIndex === -1) {
        this.dispatch({
          type: "SET_FAVORITE",
          payload: [...favorites, uid],
        });
      } else {
        favorites.splice(findIndex, 1);
        this.dispatch({
          type: "SET_FAVORITE",
          payload: favorites,
        });
      }
    });
  };
}
