import React from "react";
import Fill from "../../elements/Fill";
import Text from "../../elements/Text";
import { Row, Col, Space } from "antd";
import { light, dark } from "../../../base/theme";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import Page from "../../components/Page";
import { grey, magenta, blue, red } from "@ant-design/colors";
import ReceiptItemCard from "./ReceiptItemCard";
import List from "../../components/List";
import Flex from "../../elements/Flex";
import Card from "../../elements/Card";
import FormItem from "../../components/FormItem";
import { object, number } from "yup";
import TextField from "../../elements/TextField";
import Button from "../../elements/Button";
import {
  StateTypeEnum,
  ModalEnum,
  CouponTypeEnum,
  BreakPointsEnum,
} from "../../../tools/Enum";
import FillButton from "../../elements/FillButton";
import { ShoppingCartOutlined } from "@ant-design/icons";
import useWindowDimensions from "../../../tools/Hooks";
import { decrypt } from "../../../tools/Snippets";

const { ipcRenderer } = window.require("electron");

export default function Receipt(props) {
  const { items, setItems, activeCoupon, setactiveCoupon } = props;
  const { theme, tax, token, product } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { addReceipt } = useAppDispatch(StateTypeEnum.Receipt);
  const { updateStock } = useAppDispatch(StateTypeEnum.Product);
  const couponActions = useAppDispatch(StateTypeEnum.Coupon);
  const { height, width } = useWindowDimensions();

  const [payment, setpayment] = React.useState(0);
  const [discount, setdiscount] = React.useState(0);

  const handleAddReceipt = () => {
    var coupon = {};
    if (activeCoupon) {
      couponActions.updateStock(activeCoupon, -1);
      coupon = { couponUID: activeCoupon.uid };
    }

    items.forEach((i) => {
      const p = { ...product.get(i.uid), ...i };
      updateStock(p, -i.quantity);
    });
    const user = token ? token.uid : null;
    addReceipt(
      {
        ...coupon,
        userUID: user,
        payment,
        subTotal,
        discount,
        tax,
      },
      items.map((val) => ({
        name: val.name,
        price: val.sellingPrice,
        quantity: val.quantity,
        isCoupon: val.isCoupon,
        itemUID: val.uid,
      }))
    );
    setItems([]);
    setactiveCoupon(null);
    setpayment(0);
    setdiscount(0);
  };

  let schema = object().shape({
    payment: number().min(0, "Must be greater than 0!").required("Required"),
  });

  let error = schema.isValid({ payment });

  const subTotal = items.reduce((sum, val) => {
    if (val.isCoupon) return sum + 0;
    return sum + val.sellingPrice * val.quantity;
  }, 0);

  const discountPrice = subTotal * discount;

  const taxedPrice = (subTotal - discountPrice) * tax;

  const netTotal = subTotal - discountPrice + taxedPrice;

  const change = payment - netTotal;

  const summary = [
    { label: "Payment", value: `₱${payment.toFixed(2)}` },
    { label: "Sub Total", value: `₱${subTotal.toFixed(2)}` },
    {
      label: "Discount",
      value: `₱${discountPrice.toFixed(2)} (${discount * 100}%)`,
    },
    {
      label: "Tax",
      value: `₱${taxedPrice.toFixed(2)} (${(tax * 100).toFixed(2)}%)`,
    },
    {
      label: "Net Total",
      value: `₱${netTotal.toFixed(2)}`,
      color: blue[4],
      strong: true,
    },
    {
      label: "Change",
      value: `₱${change.toFixed(2)}`,
      color: red[4],
      strong: true,
    },
  ];

  let heightSpan;
  if (width <= BreakPointsEnum.Sm) {
    heightSpan = ["auto", "auto", "auto", "auto", "auto"];
  } else if (width <= BreakPointsEnum.Md) {
    heightSpan = ["auto", "auto", "auto", "auto", "auto"];
  } else if (width <= BreakPointsEnum.Lg) {
  } else {
  }

  return (
    <Page padding="5px 20px 10px 20px">
      <Fill>
        <Flex
          direction="column"
          style={{ height: "100%" }}
          ySpan={[1.2, 7, 10, 2]}
        >
          <Text size="h6">Transaction Items</Text>
          <Card
            style={{
              borderTop: `4px solid ${
                theme === "light" ? magenta[2] : dark.textSecondary
              }`,
              height: "43vh",
              minHeight: "43vh",
              maxHeight: "30vh",
              overflow: "hidden",
              overflowY: "auto",
            }}
          >
            <List
              spacing={0}
              itemSpan={24}
              colSpan={8}
              data={[
                { name: "Item", sellingPrice: "Price", quantity: "Qty" },
                ...items,
              ]}
              padding="0"
              style={{
                maxHeight: "43vh",
              }}
              renderItem={(val, index) => {
                return (
                  <ReceiptItemCard
                    index={index}
                    items={items}
                    setItems={setItems}
                    data={val}
                  />
                );
              }}
            />
          </Card>
          <Row style={{ height: "100%" }}>
            <Col span={12} style={{ padding: "15px 25px 0 0" }}>
              <Flex
                direction="column"
                style={{ height: "100%", paddingBottom: "10%" }}
                spacing={4}
              >
                <Button
                  style={{
                    height: "100%",
                    background: "hsla(285, 100%, 40%, 0.4)",
                  }}
                  disabled={activeCoupon}
                  onClick={(e) => {
                    e.target.blur();
                    pushNotif(
                      ModalEnum.Quantity({
                        label: "Payment",
                        max: 999999,
                        onOk: (val) => {
                          setpayment(val);
                        },
                      })
                    );
                  }}
                >
                  Payment
                </Button>
                <Button
                  style={{
                    height: "100%",
                    background: "hsla(135, 100%, 70%, 0.9)",
                  }}
                  disabled={activeCoupon}
                  onClick={(e) => {
                    e.target.blur();
                    pushNotif(
                      ModalEnum.Quantity({
                        label: "Discount (%)",
                        max: 100,
                        onOk: (val) => {
                          setdiscount(val / 100);
                        },
                      })
                    );
                  }}
                >
                  Discount
                </Button>
                <Button
                  style={{
                    height: "100%",
                    background: "hsla(95, 100%, 70%, 0.9)",
                  }}
                  disabled={
                    items.length > 0 &&
                    items.findIndex((val) => !val.isCoupon) >= 0
                  }
                  onClick={(e) => {
                    e.target.blur();
                    if (!activeCoupon) {
                      pushNotif(
                        ModalEnum.SelectCoupon({
                          onSubmit: (coupon) => {
                            if (!coupon) return;
                            setactiveCoupon(coupon);
                            switch (coupon.type) {
                              case CouponTypeEnum.Item:
                                setItems(
                                  coupon.items.map((val) => ({
                                    uid: val.itemUID,
                                    name: val.name,
                                    sellingPrice: val.price,
                                    quantity: val.quantity,
                                    isCoupon: true,
                                  }))
                                );
                                break;
                              case CouponTypeEnum.Payment:
                                setpayment(coupon.payment);
                                break;
                              case CouponTypeEnum.Discount:
                                setdiscount(coupon.discount);
                                break;
                              default:
                                break;
                            }
                          },
                        })
                      );
                    } else {
                      pushNotif(
                        ModalEnum.Confirmation({
                          onOk: () => {
                            switch (activeCoupon.type) {
                              case CouponTypeEnum.Item:
                                setItems([]);
                                break;
                              case CouponTypeEnum.Payment:
                                setpayment(0);
                                break;
                              case CouponTypeEnum.Discount:
                                setdiscount(0);
                                break;
                              default:
                                break;
                            }
                            setactiveCoupon(null);
                          },
                        })
                      );
                    }
                  }}
                >
                  <Space>
                    <Text>{`Coupon${activeCoupon ? ": " : ""}`}</Text>
                    <Text style={{ color: blue[5] }}>
                      {activeCoupon ? activeCoupon.code : ""}
                    </Text>
                  </Space>
                </Button>
                <Button
                  style={{
                    height: "100%",
                    background: "hsla(46, 100%, 70%, 0.9)",
                  }}
                  onClick={(e) => {
                    e.target.blur();
                    pushNotif(
                      ModalEnum.SelectPrinter({
                        onSubmit: (printer) => {
                          new Promise((resolve, reject) => {
                            resolve(
                              ipcRenderer.sendSync("printData", {
                                items: items.map((val) => ({
                                  item: val.name,
                                  quantity: val.quantity,
                                  total: `₱${(
                                    val.quantity * val.sellingPrice
                                  ).toFixed(2)}`,
                                })),
                                payment: payment,
                                subTotal: subTotal,
                                tax: tax,
                                taxedPrice: taxedPrice,
                                discount: discount,
                                discountPrice: discountPrice,
                                netTotal: netTotal,
                                user: `${
                                  token.firstname.charAt(0).toUpperCase() +
                                  token.firstname.slice(1).toLowerCase()
                                } ${token.lastname.charAt(0).toUpperCase()}.`, // ADD USER
                                change: change,
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
                <Button
                  style={{
                    height: "100%",
                    background: "hsla(4, 100%, 70%, 0.9)",
                  }}
                  onClick={(e) => {
                    e.target.blur();
                    setItems([]);
                    setactiveCoupon(null);
                    setpayment(0);
                    setdiscount(0);
                  }}
                >
                  Clear
                </Button>
              </Flex>
            </Col>
            <Col span={12}>
              <Flex
                direction="column"
                style={{ height: "100%" }}
                heightSpan={summary.map(() => "29px")}
              >
                {summary.map((val, index) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      height: "100%",
                      alignContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      size={index === 4 ? "medium" : "small"}
                      strong
                      style={{
                        color: theme === "light" ? magenta[4] : dark.text,
                      }}
                    >
                      {`${val.label}:`}
                    </Text>
                    <Text strong={val.strong}>{`${val.value}`}</Text>
                  </div>
                ))}
              </Flex>
            </Col>
          </Row>
          <Button
            style={{
              height: "100%",
              background: "hsla(195, 100%, 70%, 0.9)",
            }}
            onClick={(e) => {
              e.target.blur();
              pushNotif(
                ModalEnum.Confirmation({
                  onOk: () => {
                    let result = {
                      state: "",
                      message: "Thank you for your patronage!",
                    };
                    if (items.length <= 0) {
                      result = {
                        state: "fail",
                        message: "No Items Found!",
                      };
                    }
                    if (payment < netTotal) {
                      result = {
                        state: "fail",
                        message: "Payment is less than total!",
                      };
                    }
                    if (activeCoupon && activeCoupon.stock <= 0) {
                      console.log(activeCoupon);
                      result = {
                        state: "fail",
                        message: "Coupon is already out of stock!",
                      };
                    }

                    items.forEach((i) => {
                      if (i.quantity <= 0) {
                        result = {
                          state: "fail",
                          message: "Some items have no quantity",
                        };
                      }
                      return;
                    });

                    switch (result.state) {
                      case "fail":
                        pushNotif(
                          ModalEnum.Fail({
                            message: result.message,
                          })
                        );
                        break;
                      default:
                        handleAddReceipt();
                        pushNotif(
                          ModalEnum.Success({
                            message: result.message,
                          })
                        );
                        break;
                    }
                  },
                })
              );
            }}
          >
            <Space>
              <Text size="h6">
                <ShoppingCartOutlined />
              </Text>
              <Text size="h6" style={{ lineHeight: "1.3em" }}>
                Charge
              </Text>
              <Text size="h6" strong>{`₱${netTotal.toFixed(2)}`}</Text>
            </Space>
          </Button>
        </Flex>
      </Fill>
    </Page>
  );
}
