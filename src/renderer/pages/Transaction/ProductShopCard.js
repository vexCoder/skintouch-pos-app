import React from "react";
import Card from "../../elements/Card";
import { Row, Col, Space, Tooltip } from "antd";
import Text from "../../elements/Text";
import useWindowDimensions from "../../../tools/Hooks";
import {
  BreakPointsEnum,
  AnimationEnum,
  StateTypeEnum,
  ModalEnum,
} from "../../../tools/Enum";
import Fill from "../../elements/Fill";
import { blue, green, red, lime, grey } from "@ant-design/colors";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import Flex from "../../elements/Flex";
import {
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  DeleteFilled,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import Button from "../../elements/Button";
import _ from "lodash";
import Animate from "../../components/Animate";

const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");

export default function ProductShopCard(props) {
  const {
    data,
    buttonList,
    setEdit,
    favorite,
    items,
    setItems,
    activeCoupon,
  } = props;

  const { height, width } = useWindowDimensions();
  const { category, supplier, favorites } = useAppState();
  const { deleteProduct, updateFavorite } = useAppDispatch(
    StateTypeEnum.Product
  );
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);

  const [imageData, setImageData] = React.useState(null);
  const [showDescription, setShowDescription] = React.useState(false);
  const [isFavorite, setisFavorite] = React.useState(data.isFav);

  let span = 12;
  let bottom;
  let fontSize;
  if (width <= BreakPointsEnum.Sm) {
    span = 8;
    bottom = -5;
    fontSize = "xs";
  } else if (width <= BreakPointsEnum.Md) {
    span = 7;
    bottom = -5;
    fontSize = "small";
  } else if (width <= BreakPointsEnum.Lg) {
    span = 6;
    bottom = 0;
    fontSize = "small";
  } else {
    span = 4;
    bottom = 0;
    fontSize = "small";
  }

  const value = data.product;
  const path = ipcRenderer.sendSync("get-app-data-path");
  const imagePath = `${path}\\image\\${value.image}`;

  fs.readFile(imagePath, (err, data) => {
    if (err) return "";
    let base64Image = new Buffer(data, "binary").toString("base64");
    let imgSrcString = `data:image/png;base64,${base64Image}`;
    setImageData(imgSrcString);
  });

  const check = value.diffPrice > 0;
  const sup = supplier.get(value.supplier);
  const cat = category.get(value.category);

  const deletedStyle = {
    supplier: !sup
      ? {
          fontStyle: "italic",
          color: red[5],
        }
      : {},
    category: !cat
      ? {
          fontStyle: "italic",
          color: red[5],
        }
      : {},
  };

  const buttonData = (isFav) => ({
    edit: {
      icon: <EditOutlined style={{ lineHeight: 1 }} />,
      tooltip: "Edit",
      onClick: () => {
        setEdit(value);
      },
    },
    page: {
      icon: <CopyOutlined />,
      tooltip: "Change Page",
      onClick: () => {
        setShowDescription(!showDescription);
      },
    },
    buy: {
      icon: <ShoppingCartOutlined />,
      tooltip: "Add to Cart",
      disabled: activeCoupon != null,
      onMouseDown: () => {
        pushNotif(
          ModalEnum.Quantity({
            label: "Quantity",
            max: value.stock,
            onOk: (quantity) => {
              let index = _(items).findIndex((val) => val.uid === value.uid);
              if (quantity === 0) {
                if (index === -1) {
                  return;
                } else {
                  let temp = items.slice();
                  temp.splice(index, 1);
                  setItems(temp);
                  return;
                }
              } else {
                if (index === -1) {
                  setItems([...items, { ...value, quantity, isCoupon: false }]);
                } else {
                  items[index] = { ...value, quantity, isCoupon: false };
                  setItems(items);
                }
              }
            },
          })
        );
      },
    },
    fav: {
      icon: <HeartFilled style={{ color: "inherit" }} />,
      tooltip: "Favorite",
      onClick: () => {
        setisFavorite(isFavorite);
        updateFavorite(value.uid);
      },
    },
    del: {
      icon: <DeleteOutlined />,
      tooltip: "Delete",
      onClick: () => {
        pushNotif(
          ModalEnum.Confirmation({
            onCancel: () => {},
            onOk: () => {
              deleteProduct(value.uid);
            },
          })
        );
      },
    },
  });

  let buttons = buttonData(isFavorite);

  React.useEffect(() => {
    buttons = buttonData(favorite);
  }, [favorite]);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <Row style={{ width: "100%", height: "100%" }}>
        <Col span={span} style={{ padding: "10px" }}>
          <Card shadow={1} style={{ width: "100%", height: "100%" }}>
            <Fill
              style={{
                backgroundImage: `url(${imageData})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
              }}
            />
          </Card>
        </Col>
        <Col span={24 - span} style={{ padding: "5px" }}>
          <Flex
            direction="column"
            justify="space-between"
            style={{ height: "100%" }}
          >
            <Row>
              <Col span={24}>
                <Text size={fontSize} strong>
                  {value.name}
                </Text>
              </Col>
              {pageOne({ fontSize, value, check, deletedStyle, sup, cat })}
            </Row>
            <Fill>
              <Space style={{ position: "absolute", bottom: bottom, right: 0 }}>
                {getButtons(buttonList, buttons, favorite)}
              </Space>
            </Fill>
          </Flex>
        </Col>
      </Row>
    </Card>
  );
}

function getButtons(keys, buttons, isFavorite) {
  let arr = [];
  keys.forEach((key) => {
    arr = [...arr, { ...buttons[key], key: key }];
  });
  return arr.map((val) => {
    let color = "inherit";
    if (isFavorite && val.key === "fav") color = red[4];
    if (val.disabled) color = `rgba(0,0,0,0.2)`;
    return (
      <Tooltip title={val.tooltip} placement="bottom">
        <Button
          type="link"
          style={{
            padding: 0,
            margin: 0,
            fontSize: "15px",
            color: color,
          }}
          onClick={val.onClick}
          onMouseDown={val.onMouseDown}
          disabled={val.disabled}
        >
          {val.icon}
        </Button>
      </Tooltip>
    );
  });
}

function pageOne({ fontSize, value, check, deletedStyle, sup, cat }) {
  return (
    <>
      <Col
        span={24}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Space size="small">
          <Text size={fontSize} style={{ color: blue[5] }}>
            Stock:
          </Text>
          <Text size={fontSize}>{`${value.stock}`}</Text>
        </Space>
      </Col>
      <Col
        span={24}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Space size="small">
          <Text size={fontSize} style={{ color: blue[5] }}>
            Price:
          </Text>
          <Text size={fontSize}>{`₱${value.sellingPrice.toFixed(2)}`}</Text>
        </Space>
      </Col>
    </>
  );
}
