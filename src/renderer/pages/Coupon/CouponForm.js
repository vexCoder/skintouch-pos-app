import React from "react";
import Page from "../../components/Page";
import Fill from "../../elements/Fill";
import { Formik } from "formik";
import { Row, Col, Space } from "antd";
import { object, string, number } from "yup";
import FormItem from "../../components/FormItem";
import TextField from "../../elements/TextField";
import Select from "../../elements/Select";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import Button from "../../elements/Button";
import Flex from "../../elements/Flex";
import Card from "../../elements/Card";
import Text from "../../elements/Text";
import { CloseOutlined, GiftOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import { StateTypeEnum } from "../../../tools/Enum";

export default function CouponForm(props) {
  const { hide, renderProps } = props;
  const { product } = useAppState();
  const { addCoupon, editCoupon } = useAppDispatch(StateTypeEnum.Coupon);
  const { value, add, edit } = renderProps;

  const items = new Map();

  const handleSubmit = (values, actions) => {
    const itemSubmit = Array.from(
      values.items.entries(),
      ([key, value]) => value
    );
    hide();
    if (add) addCoupon(values, itemSubmit);
    if (edit) editCoupon(values, itemSubmit);
  };

  if (value && edit) {
    value.items.forEach((i) => {
      items.set(i.itemUID, i);
    });
  }

  const initialValues = value
    ? {
        uid: value.uid,
        code: value.code,
        type: value.type,
        stock: value.stock,
        items: items,
        payment: value.payment,
        discount: value.discount,
      }
    : {
        code: "",
        type: 0,
        stock: 0,
        items: items,
        payment: 0,
        discount: 0,
      };

  const productData = Array.from(product.entries(), ([key, value]) => ({
    label: value.name,
    value: value.uid,
  }));
  return (
    <Page padding="5px 10px 15px 10px">
      <Fill>
        <Formik
          validateOnMount={false}
          validateOnChange={false}
          initialValues={{ ...initialValues, product: null, quantity: null }}
          enableReinitialize
          validationSchema={object().shape({
            code: string().required("Required"),
            type: number().required("Required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, submitForm }) => {
            const itemArray = Array.from(values.items);
            return (
              <Row>
                <Col span={24}>
                  <Space>
                    <Text size="medium" strong>
                      <GiftOutlined />
                    </Text>
                    <Text size="medium" strong>
                      Coupon Information
                    </Text>
                  </Space>
                </Col>
                <Col span={24}>
                  <FormItem
                    label="Code"
                    tooltip="Enter your coupon redeem code!"
                    error={errors.code}
                    placement="top"
                  >
                    <TextField
                      value={values.code}
                      onChange={(e) => {
                        setFieldValue("code", e.target.value);
                      }}
                    />
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem
                    label="Type"
                    tooltip="Select coupon type"
                    error={errors.type}
                    placement="top"
                  >
                    <Select
                      value={values.type}
                      data={[
                        { label: "Items", value: 0 },
                        { label: "Payment", value: 1 },
                        { label: "Discount", value: 2 },
                      ]}
                      onChange={(type) => {
                        setFieldValue("type", type);
                      }}
                    />
                  </FormItem>
                </Col>
                <Col push={1} span={11}>
                  <FormItem
                    label="Stock"
                    tooltip="Enter your coupon stock!"
                    error={errors.stock}
                    placement="top"
                  >
                    <TextField
                      type="number"
                      value={values.stock}
                      onChange={(e) => {
                        setFieldValue("stock", +e.target.value);
                      }}
                    />
                  </FormItem>
                </Col>
                {values.type === 0 && (
                  <Col span={24}>
                    <Row>
                      <Col span={12}>
                        <Flex direction="column" align="center">
                          <FormItem
                            label="Add Products"
                            tooltip="Select coupon type"
                            noError
                            placement="top"
                          >
                            <Select
                              data={productData}
                              onChange={(uid) => {
                                setFieldValue("product", uid);
                              }}
                            />
                          </FormItem>
                          <div style={{ marginTop: "6px" }} />
                          <FormItem
                            label="Quantity"
                            tooltip="How many items?"
                            noError
                            placement="top"
                          >
                            <TextField
                              type="number"
                              value={values.quantity}
                              onChange={(e) => {
                                setFieldValue("quantity", e.target.value);
                              }}
                            />
                          </FormItem>
                          <Flex style={{ marginTop: "13px", width: "100%" }}>
                            <div style={{ padding: "5px" }}>
                              <Button
                                style={{ width: "100%" }}
                                onClick={() => {
                                  if (
                                    !values.items.has(values.product) &&
                                    (values.items.size >= 5 ||
                                      values.product == null)
                                  )
                                    return;

                                  let qty = values.quantity;
                                  if (
                                    values.quantity == null ||
                                    values.quantity == 0
                                  )
                                    qty = 1;
                                  let nMap = new Map(values.items);
                                  const selected = product.get(values.product);

                                  nMap.set(values.product, {
                                    quantity: qty,
                                    name: selected.name,
                                    price: selected.sellingPrice,
                                    itemUID: values.product,
                                  });
                                  setFieldValue("items", nMap);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                            <div style={{ padding: "5px" }}>
                              <Button
                                style={{ width: "100%" }}
                                onClick={() => {
                                  let nMap = new Map(values.items);
                                  nMap.delete(values.product);
                                  setFieldValue("items", nMap);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </Flex>
                        </Flex>
                      </Col>
                      <Col span={12} style={{ padding: "0 0 0 10px" }}>
                        <Card
                          style={{
                            padding: "5px 10px 5px 10px",
                            height: "100%",
                          }}
                        >
                          <Flex
                            direction="column"
                            style={{ height: "100%", width: "100%" }}
                            xSpan={itemArray.map(() => `${100}%`)}
                            heightSpan={itemArray.map(() => `${100 / 6}%`)}
                          >
                            <Row
                              align="center"
                              justify="space-between"
                              style={{ height: "100%" }}
                            >
                              <Col span={20}>
                                <Text strong>Name</Text>
                              </Col>
                              <Col span={4}>
                                <Text strong>Qty</Text>
                              </Col>
                            </Row>
                            {Array.from(
                              values.items,
                              ([key, value]) => value
                            ).map((val) => (
                              <Row
                                align="center"
                                justify="space-between"
                                style={{ height: "100%" }}
                              >
                                <Col span={20}>
                                  <Text style={{ maxWidth: "80%" }}>
                                    {val.name}
                                  </Text>
                                </Col>
                                <Col span={4}>
                                  <Text>{`x${val.quantity}`}</Text>
                                </Col>
                              </Row>
                            ))}
                          </Flex>
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                )}
                {values.type === 1 && (
                  <Col span={24}>
                    <FormItem
                      label="Payment"
                      tooltip="Diminish transaction payment"
                      error={errors.payment}
                      placement="top"
                    >
                      <TextField
                        value={values.payment}
                        onChange={(e) => {
                          setFieldValue("payment", e.target.value);
                        }}
                      />
                    </FormItem>
                  </Col>
                )}
                {values.type === 2 && (
                  <Col span={24}>
                    <FormItem
                      label="Discount"
                      tooltip="Percent discount for transactions"
                      error={errors.discount}
                      placement="top"
                    >
                      <TextField
                        value={values.discount}
                        onChange={(e) => {
                          setFieldValue("discount", e.target.value);
                        }}
                      />
                    </FormItem>
                  </Col>
                )}
                <Col span={24}>
                  <div style={{ marginTop: "16px" }} />
                  <Button
                    onClick={(e) => {
                      e.target.blur();
                      submitForm();
                    }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            );
          }}
        </Formik>
      </Fill>
    </Page>
  );
}
