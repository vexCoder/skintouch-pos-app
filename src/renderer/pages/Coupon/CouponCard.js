import React from "react";
import Card from "../../elements/Card";
import { Row, Col, Space } from "antd";
import Text from "../../elements/Text";
import Flex from "../../elements/Flex";
import {
  PushpinOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import { magenta, blue } from "@ant-design/colors";
import { dark } from "../../../base/theme";
import Button from "../../elements/Button";
import { StateTypeEnum, ModalEnum } from "../../../tools/Enum";

export default function CouponCard(props) {
  const { data } = props;
  const { theme } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { deleteCoupon } = useAppDispatch(StateTypeEnum.Coupon);
  return (
    <Card style={{ width: "100%", height: "100%", padding: "5%" }}>
      <Row>
        <Col span={24} style={{ width: "100%" }}>
          <Flex
            ySpan={[8, 2]}
            justify="space-between"
            align="flex-end"
            style={{ width: "100%" }}
          >
            <Text
              size="h6"
              strong
              style={{
                color: theme === "light" ? magenta[4] : blue[6],
              }}
            >
              {data.code}
            </Text>
            <Space>
              <Text strong>Stock: </Text>
              <Text>{`${data.stock}`}</Text>
            </Space>
          </Flex>
        </Col>
        {data.type === 0 && (
          <>
            <Col span={24}>
              <Text strong>Products:</Text>
            </Col>
            {data.items.map((val) => (
              <Col span={24}>
                <Flex
                  ySpan={[9, 1]}
                  style={{ width: "100%" }}
                  xSpan={["90%", "10%"]}
                  justify="space-between"
                >
                  <Text style={{ maxWidth: "95%" }}>{`${val.name}`}</Text>
                  <Text strong>{`x${val.quantity}`}</Text>
                </Flex>
              </Col>
            ))}
          </>
        )}
        {data.type === 1 && (
          <>
            <Col span={24}>
              <Text strong>Payment:</Text>
            </Col>
            <Col span={24}>
              <Text size="h4" strong>
                {`₱${data.payment.toFixed(2)}`}
              </Text>
            </Col>
          </>
        )}
        {data.type === 2 && (
          <>
            <Col span={24}>
              <Text strong>Discount:</Text>
            </Col>
            <Col span={24}>
              <Text size="h4" strong>
                {`${data.discount * 100}%`}
              </Text>
            </Col>
          </>
        )}
      </Row>
      <Flex
        justify="flex-end"
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: "100%",
          height: "auto",
        }}
        ySpan={[1, 1]}
        xSpan={["20%", "20%"]}
      >
        <Button
          type="link"
          style={{ background: "transparent" }}
          onClick={() => {
            pushNotif(ModalEnum.CouponForm({ value: data, edit: true }));
          }}
        >
          <EditOutlined />
        </Button>
        <Button
          type="link"
          style={{ background: "transparent" }}
          onClick={() => {
            pushNotif(
              ModalEnum.Confirmation({
                onOk: () => {
                  deleteCoupon(data.uid);
                },
              })
            );
          }}
        >
          <DeleteOutlined />
        </Button>
      </Flex>
    </Card>
  );
}
