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
import { blue, green, red, lime } from "@ant-design/colors";
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
  NumberOutlined,
} from "@ant-design/icons";
import Button from "../../elements/Button";
import _ from "lodash";
import Animate from "../../components/Animate";

const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");

export default function ProductCard(props) {
  const { data, buttonList, setEdit, favorite } = props;
  const { height, width } = useWindowDimensions();
  const { category, supplier, favorites, stock } = useAppState();
  const { deleteProduct, updateFavorite, updateStock } = useAppDispatch(
    StateTypeEnum.Product
  );
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);

  const [imageData, setImageData] = React.useState(null);
  const [showDescription, setShowDescription] = React.useState(false);
  const [isFavorite, setisFavorite] = React.useState(data.isFav);

  let span = 12;
  let fontSize;
  if (width <= BreakPointsEnum.Sm) {
    span = 10;
    fontSize = "xs";
  } else if (width <= BreakPointsEnum.Md) {
    span = 9;
    fontSize = "small";
  } else if (width <= BreakPointsEnum.Lg) {
    span = 10;
    fontSize = "small";
  } else {
    span = 9;
    fontSize = "small";
  }

  const value = data.product;
  const path = ipcRenderer.sendSync("get-app-data-path");
  const imagePath = `${path}/image/${value.image}`;
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
    stock: {
      icon: <NumberOutlined />,
      tooltip: "Update Stock",
      onClick: () => {
        pushNotif(
          ModalEnum.Quantity({
            label: "Add/Subtract to Stock",
            negative: true,
            onOk: (quantity) => {
              updateStock(value, quantity);
            },
          })
        );
      },
    },
    page: {
      icon: <CopyOutlined />,
      tooltip: "Change Page",
      onClick: () => {
        setShowDescription(!showDescription);
      },
    },
    buy: { icon: <ShoppingCartOutlined />, tooltip: "Add to Cart" },
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
  const lowStock =
    value.stock <= stock
      ? {
          borderRight: `4px solid ${red[5]}`,
        }
      : {};
  return (
    <Card
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "156px",
        ...lowStock,
      }}
    >
      <Row style={{ width: "100%", height: "100%", minHeight: "156px" }}>
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
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={!showDescription}
                duration={250}
              >
                {pageOne({
                  fontSize,
                  value,
                  check,
                  deletedStyle,
                  sup,
                  cat,
                  treshold: stock,
                })}
              </Animate>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={showDescription}
                duration={250}
              >
                {pageTwo({ fontSize, value, check, deletedStyle, sup, cat })}
              </Animate>
            </Row>
            <Fill>
              <Space style={{ position: "absolute", bottom: -5, right: 0 }}>
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
  return arr.map((val) => (
    <Tooltip title={val.tooltip} placement="bottom">
      <Button
        type="link"
        style={{
          padding: 0,
          margin: 0,
          fontSize: "15px",
          color: isFavorite && val.key === "fav" ? red[4] : "inherit",
        }}
        onClick={val.onClick}
      >
        {val.icon}
      </Button>
    </Tooltip>
  ));
}

function pageTwo({ fontSize, value }) {
  return (
    <>
      <Col span={24}>
        <Text size={fontSize} style={{ color: blue[5] }}>
          Description:
        </Text>
      </Col>
      <Col span={24}>
        <Text size={fontSize}>{value.description}</Text>
      </Col>
    </>
  );
}

function pageOne({ fontSize, value, check, deletedStyle, sup, cat, treshold }) {
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
            Price:
          </Text>
          <Text size={fontSize}>{`₱${value.sellingPrice.toFixed(2)}`}</Text>
          <Text
            size={fontSize}
            style={{ color: check ? green[5] : red[5] }}
          >{`${check ? "+" : "-"}${value.diffPrice.toFixed(2)}`}</Text>
        </Space>
      </Col>
      <Col span={24}>
        <Space size="small">
          <Text size={fontSize} style={{ color: blue[5] }}>
            Stock:
          </Text>
          <Text
            size={fontSize}
            style={{
              ...deletedStyle.supplier,
              color: value.stock <= treshold ? red[5] : "inherit",
            }}
          >{`${value ? value.stock : 0}`}</Text>
        </Space>
      </Col>
      <Col span={24}>
        <Space size="small">
          <Text size={fontSize} style={{ color: blue[5] }}>
            Supplier:
          </Text>
          <Text size={fontSize} style={{ ...deletedStyle.supplier }}>{`${
            sup ? sup.name : "deleted"
          }`}</Text>
        </Space>
      </Col>
      <Col span={24}>
        <Space size="small">
          <Text size={fontSize} style={{ color: blue[5] }}>
            Category:
          </Text>
          <Text size={fontSize} style={{ ...deletedStyle.category }}>{`${
            cat ? cat.name : "deleted"
          }`}</Text>
        </Space>
      </Col>
    </>
  );
}
