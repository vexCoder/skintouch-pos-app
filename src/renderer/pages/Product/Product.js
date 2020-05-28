import React from "react";
import Page from "../../components/Page";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import {
  StateTypeEnum,
  BreakPointsEnum,
  BreakPointsEnumH,
  ModalEnum,
  AnimationEnum,
} from "../../../tools/Enum";
import List from "../../components/List";
import Card from "../../elements/Card";
import { Row, Col, Space, Tooltip } from "antd";
import Text from "../../elements/Text";
import ProductCard from "./ProductCard";
import useWindowDimensions from "../../../tools/Hooks";
import Flex from "../../elements/Flex";
import TextField from "../../elements/TextField";
import FormItem from "../../components/FormItem";
import Select from "../../elements/Select";
import Button from "../../elements/Button";
import Icon, {
  PlusCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import shippingAndDelivery from "../../../icons/shipping-and-delivery";
import { light, dark } from "../../../base/theme";
import Dropdown from "../../elements/Dropdown";
import ProductForm from "./ProductForm";
import Animate from "../../components/Animate";
import Divider from "../../elements/Divider";
import { red } from "@ant-design/colors";
import _ from "lodash";
import moment from "moment";

export default function Product() {
  const { product, category, supplier, favorites, theme } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);

  const { height, width } = useWindowDimensions();

  const [showDrawer, setshowDrawer] = React.useState(false);
  const [showList, setshowList] = React.useState(true);
  const [categorySel, setcategory] = React.useState(null);
  const [supplierSel, setsupplier] = React.useState(null);
  const [editValue, seteditValue] = React.useState(null);
  const [keyword, setkeyword] = React.useState("");

  let xSpan, colSpan, btnShrink;
  if (width <= BreakPointsEnum.Sm) {
    xSpan = 12;
    btnShrink = true;
  } else if (width <= BreakPointsEnum.Md) {
    xSpan = 12;
    btnShrink = true;
  } else if (width <= BreakPointsEnum.Lg) {
    xSpan = 8;
    btnShrink = false;
  } else if (width <= BreakPointsEnum.Xl) {
    xSpan = 8;
    btnShrink = false;
  } else {
    xSpan = 6;
    btnShrink = false;
  }

  if (height <= BreakPointsEnumH.Sm) {
    colSpan = 3;
  } else if (height <= BreakPointsEnumH.Md) {
    colSpan = 3;
  } else if (height <= BreakPointsEnumH.Lg) {
    colSpan = 3;
  } else if (height <= BreakPointsEnumH.Xl) {
    colSpan = 3;
  } else {
    colSpan = 5;
  }

  const isFavorite = (uid) => {
    return _.findIndex(favorites, (val) => val === uid) >= 0;
  };

  let productData = Array.from(product.entries(), ([key, value]) => ({
    product: value,
    isFav: isFavorite(value.uid),
  }));

  productData = productData.sort(
    (a, b) =>
      moment(a.product.created).format("YYYYMMDD") -
      moment(b.product.created).format("YYYYMMDD")
  );

  productData = [
    ...productData.filter((val) => val.isFav),
    ...productData.filter((val) => !val.isFav),
  ];

  let filterProducts = function (arr) {
    let filtered_products = arr.filter(function (item) {
      item = item.product.name.toLowerCase();
      return item.indexOf(keyword) > -1;
    });
    if (categorySel) {
      filtered_products = filtered_products.filter(function (item) {
        console.log(item.category, categorySel);
        return item.product.category === categorySel;
      });
    }
    if (supplierSel) {
      filtered_products = filtered_products.filter(function (item) {
        return item.product.supplier === supplierSel;
      });
    }
    return filtered_products;
  };

  productData = filterProducts(productData);

  return (
    <>
      <Page padding="5px 0 25px 0">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Row
            gutter={[5, 0]}
            align={"bottom"}
            justify="space-between"
            style={{ marginTop: "10px", padding: "0 15px 0 15px" }}
          >
            <Col span={18}>
              <Row gutter={[5, 0]}>
                <Col span={6}>
                  <Animate
                    transition={AnimationEnum.FadeSlideIn}
                    condition={showList}
                    duration={250}
                  >
                    <FormItem label="Filter Name" noError>
                      <TextField
                        onChange={(e) => {
                          setkeyword(e.target.value.toLowerCase());
                        }}
                      />
                    </FormItem>
                  </Animate>
                  <Animate
                    transition={AnimationEnum.FadeSlideIn}
                    condition={!showList}
                    duration={250}
                  >
                    <Space>
                      <Text style={{ fontSize: "1.5em" }}>
                        <FileTextOutlined style={{ fontSize: "inherit" }} />
                      </Text>
                      <Text size="h5">Product Information</Text>
                    </Space>
                  </Animate>
                </Col>
                <Col span={6}>
                  <Animate
                    transition={AnimationEnum.FadeSlideIn}
                    condition={showList}
                    duration={250}
                  >
                    <FormItem label="Category" placement="top" noError>
                      <Select
                        allowClear
                        value={categorySel}
                        data={Array.from(category.entries(), ([key, val]) => ({
                          label: val.name,
                          value: val.uid,
                        }))}
                        onChange={(cat) => {
                          setcategory(cat);
                        }}
                      />
                    </FormItem>
                  </Animate>
                </Col>
                <Col span={6}>
                  <Animate
                    transition={AnimationEnum.FadeSlideIn}
                    condition={showList}
                    duration={250}
                  >
                    <FormItem label="Supplier" placement="top" noError>
                      <Select
                        allowClear
                        value={supplierSel}
                        data={Array.from(supplier.entries(), ([key, val]) => ({
                          label: val.name,
                          value: val.uid,
                        }))}
                        onChange={(sup) => {
                          setsupplier(sup);
                        }}
                      />
                    </FormItem>
                  </Animate>
                </Col>
              </Row>
            </Col>

            <Col span="auto">
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={showList}
                duration={250}
                style={{ zIndex: 999, marginBottom: "8px" }}
              >
                {MenuDropdown({
                  showDrawer,
                  setshowDrawer,
                  pushNotif,
                  setshowList,
                  showList,
                  theme,
                })}
              </Animate>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={!showList}
                duration={250}
              >
                <Button
                  onClick={() => {
                    setshowList(!showList);
                    seteditValue(null);
                  }}
                  style={{ background: red[5], color: "white" }}
                >
                  Return
                </Button>
              </Animate>
            </Col>
            <Col
              span={24}
              style={{
                maxHeight: "2px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <Divider
                style={{
                  height: "1px",
                  width: "100%",
                  background: "transparent",
                }}
              />
            </Col>
          </Row>
          <div
            style={{
              position: "relative",
              height: "100%",
              maxHeight: "calc(100vh - 130px)",
              overflowY: "auto",
            }}
          >
            <Animate
              transition={AnimationEnum.FadeSlideIn}
              condition={showList}
              duration={250}
              style={{ height: "100%" }}
            >
              <List
                spacing={2}
                itemSpan={xSpan}
                colSpan={colSpan}
                data={productData}
                padding="0 15px 0 15px"
                style={{ height: "100%" }}
                renderItem={(val) => {
                  return (
                    <ProductCard
                      favorite={val.isFav}
                      data={val}
                      setEdit={(value) => {
                        seteditValue(value);
                        setshowList(!showList);
                      }}
                      buttonList={["edit", "stock", "page", "fav", "del"]}
                    />
                  );
                }}
              />
            </Animate>
            <Animate
              transition={AnimationEnum.FadeSlideIn}
              condition={!showList}
              duration={250}
            >
              {!showList && (
                <ProductForm
                  add={editValue == null}
                  edit={editValue != null}
                  value={editValue}
                  onSubmit={() => {
                    setshowList(true);
                  }}
                />
              )}
            </Animate>
          </div>
        </div>
      </Page>
    </>
  );
}

const MenuDropdown = ({
  showDrawer,
  setshowDrawer,
  pushNotif,
  setshowList,
  showList,
  theme,
}) => {
  return (
    <Dropdown
      icon={
        <PlusCircleOutlined
          style={{ color: theme === "light" ? light.textSecondary : dark.text }}
        />
      }
      title="Manage Inventory"
      data={[
        {
          title: "Add Product",
          onClick: () => {
            setshowList(!showList);
          },
        },
        {
          title: "Manage Category",
          onClick: () => {
            pushNotif(
              ModalEnum.CategoryForm({
                onSubmit: (bool) => {
                  if (bool) {
                    pushNotif(ModalEnum.Success());
                  } else {
                    pushNotif(ModalEnum.Fail());
                  }
                },
              })
            );
          },
        },
        {
          title: "Manage Supplier",
          onClick: () => {
            pushNotif(
              ModalEnum.SupplierForm({
                onSubmit: (bool) => {
                  if (bool) {
                    pushNotif(ModalEnum.Success());
                  } else {
                    pushNotif(ModalEnum.Fail());
                  }
                },
              })
            );
          },
        },
      ]}
    />
  );
};
