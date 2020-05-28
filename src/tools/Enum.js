import React from "react";
import Main from "../renderer/pages/Main/Main";
import {
  HomeOutlined,
  DatabaseOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EditFilled,
  DeleteFilled,
  ShopOutlined,
  GiftOutlined,
  UnorderedListOutlined,
  AreaChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Empty from "../renderer/elements/Empty";
import ProductForm from "../renderer/pages/Product/ProductForm";
import CategoryForm from "../renderer/pages/Product/CategoryForm";
import Success from "../renderer/pages/Notification/Success";
import Fail from "../renderer/pages/Notification/Fail";
import TabList from "../renderer/components/TabList";
import SupplierForm from "../renderer/pages/Product/SupplierForm";
import Product from "../renderer/pages/Product/Product";
import Confirmation from "../renderer/pages/Notification/Confirmation";
import Transaction from "../renderer/pages/Transaction/Transaction";
import Quantity from "../renderer/pages/Notification/Quantity";
import Coupon from "../renderer/pages/Coupon/Coupon";
import CouponForm from "../renderer/pages/Coupon/CouponForm";
import Receipt from "../renderer/pages/Receipt/Receipt";
import Statistic from "../renderer/pages/Statistics/Statistic";
import Settings from "../renderer/pages/Settings/Settings";
import SelectCouponForm from "../renderer/pages/Notification/SelectCouponForm";
import SelectPrinter from "../renderer/pages/Notification/SelectPrinter";
import ConfirmationInput from "../renderer/pages/Notification/ConfirmationInput";

export const BreakPointsEnum = {
  Sm: 800,
  Md: 1024,
  Lg: 1440,
  Xl: 1600,
};

export const BreakPointsEnumH = {
  Sm: 600,
  Md: 768,
  Lg: 900,
  Xl: 900,
};

export const MaxEnum = {
  Product: 500,
  Coupon: 500,
};

export const StateTypeEnum = {
  Theme: 0,
  AppSetting: 1,
  Product: 2,
  Receipt: 3,
  Coupon: 4,
  Accounts: 5,
  Settings: 6,
};

export const FetchStateEnum = {
  Running: "Running",
  Fetching: "Fetching",
  Syncing: "Syncing",
  Queueing: "Queueing",
  Idling: "Idling",
  Offline: "Offline",
  Error: "Error",
};

export const ServerTableEnum = {
  Version: "version",
  Product: "product",
  Supplier: "supplier",
  Category: "category",
  Coupon: "coupon",
  Receipt: "receipt",
  Accounts: "accounts",
};

export const DBActionEnum = {
  Insert: 0,
  Update: 1,
  Delete: 2,
  Read: 3,
  UpdateByUID: 4,
};

export const TableEnum = {
  Theme: "theme",
};

export const CouponTypeEnum = {
  Item: 0,
  Payment: 1,
  Discount: 2,
};

export const AnimationEnum = {
  RouteFade: {
    entering: { opacity: 1, position: "absolute" },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0, position: "absolute" },
    opacity: 0,
  },
  Fade: {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    opacity: 0,
  },
  FadeSlideIn: {
    entering: {
      opacity: 0,
      transform: "translateX(-10px)",
      position: "absolute",
    },
    entered: { opacity: 1, transform: "translateX(0px)" },
    exiting: {
      opacity: 0,
      transform: "translateX(-10px)",
    },
    exited: { opacity: 1, transform: "translateX(0px)" },
    opacity: 0,
    transform: "translateX(-10px)",
  },
  DropdownSlideDown: {
    entering: {
      opacity: 0,
      transform: "translateY(-10px)",
      position: "absolute",
    },
    entered: { opacity: 1, transform: "translateY(0px)" },
    exiting: {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    exited: { opacity: 1, transform: "translateY(0px)" },
    opacity: 0,
    transform: "translateY(-10px)",
  },
  DrawerSlideIn: {
    entering: { opacity: 0, transform: "scale(0.5)" },
    entered: { opacity: "100%", transform: "scale(1)" },
    exiting: { opacity: 0, transform: "scale(0.5)" },
    exited: { opacity: 0, transform: "scale(0)" },
    opacity: 0,
    transform: "scale(0.5)",
  },
};

export const RoutesEnum = {
  Main: {
    key: "Main",
    title: "Main",
    component: <Main />,
    icon: <HomeOutlined />,
  },
  Transaction: {
    key: "Transaction",
    title: "Transaction",
    component: <Transaction />,
    icon: <ShopOutlined />,
  },
  Product: {
    key: "Product",
    title: "Inventory",
    component: <Product />,
    icon: <DatabaseOutlined />,
  },
  Coupon: {
    key: "Coupon",
    title: "Coupons",
    component: <Coupon />,
    icon: <GiftOutlined />,
  },
  Receipt: {
    key: "Receipt",
    title: "Recent",
    component: <Receipt />,
    icon: <UnorderedListOutlined />,
  },
  Statistic: {
    key: "Statistic",
    title: "Statistics",
    component: <Statistic />,
    icon: <AreaChartOutlined />,
  },
  Settings: {
    key: "Settings",
    title: "Settings",
    component: <Settings />,
    icon: <SettingOutlined />,
  },
};

export const ModalEnum = {
  Confirmation: (props) => ({
    key: "Confirmation",
    component: <Confirmation />,
    props: { onCancel: () => {}, onOk: () => {}, ...props },
  }),
  ConfirmationInput: (props) => ({
    key: "ConfirmationInput",
    component: <ConfirmationInput />,
    props: { onCancel: () => {}, onOk: () => {}, ...props, top: 25 },
  }),
  ProductForm: (props) => ({
    key: "ProductForm",
    component: <ProductForm />,
    props: { ...props, minHeight: 400 },
  }),
  CategoryForm: (props) => ({
    key: "CategoryForm",
    component: (
      <TabList
        contents={[
          <CategoryForm add />,
          <CategoryForm edit />,
          <CategoryForm del />,
        ]}
        titles={["Add Category", "Edit Category", "Delete Category"]}
        icons={[<PlusOutlined />, <EditFilled />, <DeleteFilled />]}
        position="left"
        buttonAlign="right"
        tabspan={7}
        tabspacing={10}
      />
    ),
    props: { ...props, minHeight: 350 },
  }),
  SupplierForm: (props) => ({
    key: "CategoryForm",
    component: (
      <TabList
        contents={[
          <SupplierForm add />,
          <SupplierForm edit />,
          <SupplierForm del />,
        ]}
        titles={["Add Supplier", "Edit Supplier", "Delete Supplier"]}
        icons={[<PlusOutlined />, <EditFilled />, <DeleteFilled />]}
        position="left"
        buttonAlign="right"
        tabspan={7}
        tabspacing={10}
      />
    ),
    props: { ...props, minHeight: 350 },
  }),
  Success: (props) => ({
    key: "Success",
    component: <Success />,
    props: { top: 25, ...props },
  }),
  Fail: (props) => ({
    key: "Success",
    component: <Fail />,
    props: { top: 25, ...props },
  }),
  Quantity: (props) => ({
    key: "Quantity",
    component: <Quantity />,
    props: { top: 25, ...props },
    width: 350,
    keyboard: false,
  }),
  CouponForm: (props) => ({
    key: "CouponForm",
    component: <CouponForm />,
    props: { top: 25, ...props },
  }),
  SelectCoupon: (props) => ({
    key: "SelectCouponForm",
    component: <SelectCouponForm />,
    props: { top: 25, ...props },
  }),
  SelectPrinter: (props) => ({
    key: "SelectPrinterForm",
    component: <SelectPrinter />,
    props: { top: 25, ...props },
  }),
};
