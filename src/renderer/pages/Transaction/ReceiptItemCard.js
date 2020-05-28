import React from "react";
import Card from "../../elements/Card";
import { Row, Col, Space } from "antd";
import Button from "../../elements/Button";
import { EditOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { blue, green, red, grey } from "@ant-design/colors";
import Text from "../../elements/Text";
import Flex from "../../elements/Flex";
import Fill from "../../elements/Fill";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import { dark } from "../../../base/theme";
import { StateTypeEnum, ModalEnum } from "../../../tools/Enum";

export default function ReceiptItemCard(props) {
  const { data, setItems, items, index } = props;
  const { theme } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);

  let value = data;

  const rowBG =
    theme === "light"
      ? { odd: "white", even: "rgba(80,80,80,0.1)" }
      : { odd: dark.background, even: grey[5] };

  value =
    index !== 0
      ? {
          ...value,
          sellingPrice: `₱${value.sellingPrice.toFixed(2)}`,
        }
      : { ...value };
  return (
    <Fill style={{ padding: 0 }}>
      <Flex
        align="center"
        ySpan={[10, 6, 3, 3]}
        style={{
          width: "100%",
          background: "transparent",
          padding: "0 10px 0 10px",
        }}
      >
        <Text>{value.name}</Text>
        {!value.isCoupon ? (
          <Text>{`${value.sellingPrice}`}</Text>
        ) : (
          <Text>
            <GiftOutlined />
          </Text>
        )}
        <Text>{`${value.quantity}`}</Text>
        <Space align="end">
          {index > 0 && !value.isCoupon ? (
            <>
              <Button
                type="link"
                style={{
                  padding: 0,
                  margin: 0,
                  background: "transparent",
                  fontSize: "15px",
                }}
                onMouseDown={() => {
                  pushNotif(
                    ModalEnum.Quantity({
                      value: value.quantity,
                      label: "Quantity",
                      max: value.stock,
                      onOk: (quantity) => {
                        if (quantity === 0) {
                          let arr = items.slice();
                          arr.splice(index - 1, 1);
                          setItems(arr);
                        } else {
                          let arr = items.slice();
                          arr[index - 1].quantity = quantity;
                          setItems(arr);
                        }
                      },
                    })
                  );
                }}
                disabled={index === 0}
              >
                <EditOutlined style={{ color: "inherit" }} />
              </Button>
              <Button
                type="link"
                style={{
                  padding: 0,
                  margin: 0,
                  background: "transparent",
                  fontSize: "15px",
                  color: red[4],
                }}
                onClick={() => {
                  let arr = items.slice();
                  arr.splice(index - 1, 1);
                  setItems(arr);
                }}
                disabled={index === 0}
              >
                <DeleteOutlined style={{ color: "inherit" }} />
              </Button>
            </>
          ) : (
            <div />
          )}
        </Space>
      </Flex>
    </Fill>
  );
}
