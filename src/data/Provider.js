import React from "react";
import { StateTypeEnum, FetchStateEnum, ServerTableEnum } from "../tools/Enum";
import dbm from "./DataManager";
import Reducer from "./Reducer";
import { Product, Receipt, Coupon, Account, Settings } from "./Actions";
import { ConfigProvider } from "antd";
import { light, dark } from "../base/theme";
import Empty from "../renderer/elements/Empty";
import { decrypt } from "../tools/Snippets";
import moment from "moment";

const { ipcRenderer } = window.require("electron");

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const initState = {
  // App Settings
  tab: 0,
  notification: [],
  // Data
};

function StateProvider({ children }) {
  const [state, dispatch] = React.useReducer(Reducer, initState);

  const [dataState, setDataState] = React.useState(FetchStateEnum.Error);

  const ThemeActions = require("./Actions/ThemeActions")(dispatch);
  const AppSettingActions = require("./Actions/AppSettingActions")(dispatch);

  React.useEffect(() => {
    dbm.initialize(3000).then(async ({ data }) => {
      setTimeout(async () => {
        fetchLocalData(data);
        dbm.start();
      }, 1000);
    });

    dbm.on("state-change", ({ state }) => {
      setDataState(state.charAt(0).toUpperCase() + state.slice(1));
    });

    dbm.on("data-change", ({ data }) => {
      fetchLocalData(data);
    });

    dbm.on("version-change", ({ version }) => {
      setLocalVersion(version);
    });

    return () => {
      dbm.stop();
    };
  }, []);

  const loginOnOpen = () => {
    ipcRenderer.sendSync("open-main-window");
  };

  const fetchLocalData = (data) => {
    console.log(data);
    dispatch({
      type: "SYNC_LOCAL_DATA",
      payload: data,
    });
  };

  const setLocalVersion = (data) => {
    dispatch({
      type: "SET_VERSION",
      payload: data,
    });
  };

  const customizeRenderEmpty = () => (
    <Empty
      size="regular"
      style={{
        color: state.theme === "light" ? light.text : dark.text,
        width: "100%",
      }}
    />
  );
  return (
    <StateContext.Provider value={state}>
      <ConfigProvider renderEmpty={customizeRenderEmpty}>
        <DispatchContext.Provider
          value={{
            ThemeActions,
            AppSettingActions,
            ProductActions: new Product(dispatch),
            ReceiptActions: new Receipt(dispatch),
            CouponActions: new Coupon(dispatch),
            AccountsActions: new Account(dispatch),
            SettingsActions: new Settings(dispatch),
          }}
        >
          {dataState !== FetchStateEnum.Error && children}
        </DispatchContext.Provider>
      </ConfigProvider>
    </StateContext.Provider>
  );
}

function useAppState() {
  const context = React.useContext(StateContext);
  return context || {};
}
function useAppDispatch(type) {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error("useCountDispatch must be used within a CountProvider");
  }
  switch (type) {
    case StateTypeEnum.Theme:
      return context.ThemeActions;
    case StateTypeEnum.AppSetting:
      return context.AppSettingActions;
    case StateTypeEnum.Product:
      return context.ProductActions;
    case StateTypeEnum.Receipt:
      return context.ReceiptActions;
    case StateTypeEnum.Coupon:
      return context.CouponActions;
    case StateTypeEnum.Accounts:
      return context.AccountsActions;
    case StateTypeEnum.Settings:
      return context.SettingsActions;
    default:
      return context;
  }
}

export { StateProvider, useAppState, useAppDispatch };
