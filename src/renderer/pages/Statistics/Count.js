import React from "react";
import { useAppState } from "../../../data/Provider";
import { Row, Col, Space, Progress } from "antd";
import Fill from "../../elements/Fill";
import { NumberOutlined, CaretRightOutlined } from "@ant-design/icons";
import Text from "../../elements/Text";
import { MaxEnum } from "../../../tools/Enum";
import Flex from "../../elements/Flex";

export default function Count() {
  const { product, coupon, receipt } = useAppState();

  return (
    <Fill
      style={{
        position: "relative",
        padding: "calc(2% + 5px)",
        height: "100%",
        width: "100%",
      }}
    >
      <Flex
        direction="column"
        ySpan={[4, 4, 7, 7, 8]}
        style={{ width: "100%", height: "100%" }}
      >
        <Space style={{ width: "100%", height: "100%" }}>
          <Text strong size="h6">
            <NumberOutlined />
          </Text>
          <Text strong size="h6">
            Data Count
          </Text>
        </Space>
        <Space>
          <Text>
            <CaretRightOutlined />
          </Text>
          <Text
            style={{
              whiteSpace: "wrap",
              overflow: "visible",
              textOverflow: "initial",
            }}
          >
            Displays the maximum unique items you can add and how much you have
            added.
          </Text>
        </Space>
        <Flex
          direction="column"
          heightSpan={["30%", "20%", "10%"]}
          style={{ width: "100%", height: "100%" }}
        >
          <Text strong size="h6">
            Products:
          </Text>
          <Text>{`${product.size}/${MaxEnum.Product}`}</Text>
          <Progress
            showInfo={false}
            percent={(product.size / MaxEnum.Product) * 100}
          />
        </Flex>
        <Flex
          direction="column"
          heightSpan={["30%", "20%", "10%"]}
          style={{ width: "100%", height: "100%" }}
        >
          <Text strong size="h6">
            Coupons:
          </Text>
          <Text>{`${coupon.size}/${MaxEnum.Coupon}`}</Text>
          <Progress
            showInfo={false}
            percent={(coupon.size / MaxEnum.Coupon) * 100}
          />
        </Flex>
        <div />
      </Flex>
    </Fill>
  );
}
