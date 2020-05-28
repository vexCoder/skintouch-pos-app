import dbm from "../DataManager";

export default class SettingsActions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  setStock = (stock) => {
    dbm.localSet("stock", stock).then(() => {
      this.dispatch({ type: "SET_STOCK", payload: stock });
    });
  };

  setTax = (tax) => {
    dbm.localSet("tax", tax).then(() => {
      this.dispatch({ type: "SET_TAX", payload: tax });
    });
  };
}
