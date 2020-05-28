import React from "react";
import Page from "../../components/Page";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import { Row, Col, Space } from "antd";
import Flex from "../../elements/Flex";
import TextField from "../../elements/TextField";
import FormItem from "../../components/FormItem";
import List from "../../components/List";
import moment from "moment";
import ReceiptCard from "./ReceiptCard";
import Card from "../../elements/Card";
import {
  BreakPointsEnum,
  AnimationEnum,
  ModalEnum,
  StateTypeEnum,
} from "../../../tools/Enum";
import useWindowDimensions from "../../../tools/Hooks";
import Fill from "../../elements/Fill";
import Text from "../../elements/Text";
import Item from "antd/lib/list/Item";
import Animate from "../../components/Animate";
import _ from "lodash";
import { GiftOutlined } from "@ant-design/icons";
import Button from "../../elements/Button";

const { ipcRenderer } = window.require("electron");

export default function Receipt() {
  const { theme, receipt, token } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { height, width } = useWindowDimensions();

  const [date, setdate] = React.useState(null);
  const [active, setactive] = React.useState(null);

  let listCount;
  if (width <= BreakPointsEnum.Sm) {
    listCount = 10;
  } else if (width <= BreakPointsEnum.Md) {
    listCount = 10;
  } else if (width <= BreakPointsEnum.Lg) {
    listCount = 11;
  } else if (width <= BreakPointsEnum.Xl) {
    listCount = 12;
  } else {
    listCount = 15;
  }

  let receiptData = Array.from(receipt.entries(), ([key, value]) => ({
    receipt: value,
    header: false,
    active: active === value.uid,
  }));
  receiptData = receiptData.filter((val) =>
    date != null
      ? moment(val.created).isBetween(
          moment(date).startOf("date"),
          moment(date).endOf("date"),
          "date",
          "[]"
        )
      : true
  );

  const activeItem = active ? receipt.get(active) : {};
  return (
    <Page padding="15px 0 5px 0">
      <Row style={{ height: "100%" }}>
        <Col span={12}>
          <Flex
            direction="column"
            heightSpan={["70px", "calc(100% - 70px)"]}
            style={{ height: "100%" }}
          >
            <div style={{ padding: "0 25px 0 25px" }}>
              <FormItem
                label="Filter Date"
                tooltip="Choose the date of transaction"
                noError
                placement="top"
              >
                <TextField
                  type="date"
                  onChange={(e) => {
                    setdate(e.target.value);
                  }}
                />
              </FormItem>
            </div>
            <div
              style={{
                height: "100%",
                maxHeight: "calc(100vh - 107px)",
                overflowY: "auto",
              }}
            >
              <List
                spacing={2}
                itemSpan={24}
                colSpan={listCount}
                data={[
                  {
                    header: true,
                    created: "Date",
                    payment: "Payment",
                    netTotal: "Net",
                    change: "Change",
                  },
                  ...receiptData,
                ]}
                padding="0 25px 0 25px"
                renderItem={(val) => {
                  return (
                    <ReceiptCard
                      active={!val.header && active === val.receipt.uid}
                      data={val}
                      onClick={(uid) => {
                        if (active === uid) {
                          setactive(null);
                        } else {
                          setactive(uid);
                        }
                      }}
                    />
                  );
                }}
              />
            </div>
          </Flex>
        </Col>
        <Col span={12}>
          <Fill style={{ padding: "25px" }}>
            <Animate
              transition={AnimationEnum.FadeSlideIn}
              condition={active != null}
              duration={250}
            >
              <Card style={{ width: "300px", height: "500px" }}>
                <Page>
                  {!_.isEmpty(activeItem) && (
                    <Flex
                      direction="column"
                      style={{ height: "100%" }}
                      ySpan={[1, 1, 9, 2, 2, 2, 2, 2, 2, 2]}
                    >
                      <Space>
                        <Text strong>Date:</Text>
                        <Text>
                          {moment(activeItem.created).format(
                            "YYYY/DD/MMM hh:mm A"
                          )}
                        </Text>
                      </Space>
                      <Text strong>Items: </Text>
                      <Card>
                        <List
                          spacing={2}
                          itemSpan={24}
                          colSpan={4}
                          data={activeItem.items}
                          padding="0 5px 0 5px"
                          header={
                            <Flex ySpan={[10, 3, 2]} style={{ width: "100%" }}>
                              <Text>Name</Text>
                              <Text>Price</Text>
                              <Text>Qty</Text>
                            </Flex>
                          }
                          renderItem={(val) => (
                            <Flex ySpan={[10, 3, 2]} style={{ width: "100%" }}>
                              <Text>{val.name}</Text>
                              {!val.isCoupon ? (
                                <Text>{`₱${val.price}`}</Text>
                              ) : (
                                <Text>
                                  <GiftOutlined />
                                </Text>
                              )}
                              <Text>{`x${val.quantity}`}</Text>
                            </Flex>
                          )}
                        />
                      </Card>
                      <Space>
                        <Text strong>Payment:</Text>
                        <Text>{`₱${activeItem.payment.toFixed(2)}`}</Text>
                      </Space>
                      <Space>
                        <Text strong>Sub Total:</Text>
                        <Text>{`₱${activeItem.subTotal.toFixed(2)}`}</Text>
                      </Space>
                      <Space>
                        <Text strong>Discount:</Text>
                        <Text>{`₱${activeItem.discountTotal.toFixed(2)} (${
                          activeItem.discount * 100
                        }%)`}</Text>
                      </Space>
                      <Space>
                        <Text strong>Tax:</Text>
                        <Text>{`₱${activeItem.taxTotal.toFixed(2)} (${
                          activeItem.tax * 100
                        }%)`}</Text>
                      </Space>
                      <Space>
                        <Text strong>Net Total:</Text>
                        <Text>{`₱${activeItem.netTotal.toFixed(2)}`}</Text>
                      </Space>
                      <Space>
                        <Text strong>Change:</Text>
                        <Text>{`₱${activeItem.change.toFixed(2)}`}</Text>
                      </Space>
                      <Space>
                        <Button
                          onClick={(e) => {
                            e.target.blur();
                            pushNotif(
                              ModalEnum.SelectPrinter({
                                onSubmit: (printer) => {
                                  new Promise((resolve, reject) => {
                                    resolve(
                                      ipcRenderer.sendSync("printData", {
                                        items: activeItem.items.map((val) => ({
                                          item: val.name,
                                          quantity: val.quantity,
                                          total: `₱${(
                                            val.quantity * val.price
                                          ).toFixed(2)}`,
                                        })),
                                        payment: activeItem.payment,
                                        subTotal: activeItem.subTotal,
                                        tax: activeItem.tax,
                                        taxedPrice: activeItem.taxTotal,
                                        discount: activeItem.discount,
                                        discountPrice: activeItem.discountTotal,
                                        netTotal: activeItem.netTotal,
                                        user: `${
                                          token.firstname
                                            .charAt(0)
                                            .toUpperCase() +
                                          token.firstname.slice(1).toLowerCase()
                                        } ${token.lastname
                                          .charAt(0)
                                          .toUpperCase()}.`, // ADD USER // ADD USER
                                        change: activeItem.change,
                                      })
                                    );
                                  }).then((message) => {
                                    ipcRenderer.sendSync("go-print", printer);
                                  });
                                },
                              })
                            );
                          }}
                        >
                          Print
                        </Button>
                      </Space>
                    </Flex>
                  )}
                </Page>
              </Card>
            </Animate>
          </Fill>
        </Col>
      </Row>
    </Page>
  );
}
