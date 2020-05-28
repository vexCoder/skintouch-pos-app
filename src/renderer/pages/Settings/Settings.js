import React from "react";
import Page from "../../components/Page";
import { Row, Col, Space } from "antd";
import Flex from "../../elements/Flex";
import Card from "../../elements/Card";
import Text from "../../elements/Text";
import Divider from "../../elements/Divider";
import FormItem from "../../components/FormItem";
import TextField from "../../elements/TextField";
import {
  BankOutlined,
  NumberOutlined,
  DeleteOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import Button from "../../elements/Button";
import { red, blue } from "@ant-design/colors";
import Select from "../../elements/Select";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import Fill from "../../elements/Fill";
import { StateTypeEnum, ModalEnum } from "../../../tools/Enum";
import { decrypt } from "../../../tools/Snippets";
import dbm from "../../../data/DataManager";

const { ipcRenderer } = window.require("electron");

export default function Settings() {
  const { theme, tax, stock, token } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { setTheme } = useAppDispatch(StateTypeEnum.Theme);
  const { setTax, setStock } = useAppDispatch(StateTypeEnum.Settings);
  const [taxState, settaxState] = React.useState((tax * 100).toFixed(0));
  const [stockState, setstockState] = React.useState(stock);
  const [themeState, setthemeState] = React.useState(theme);
  return (
    <Page
      style={{
        height: "100%",
        maxHeight: "calc(100vh - 22px )",
        overflowY: "scroll",
      }}
    >
      <Fill>
        <Row gutter={[0, 10]}>
          <Col span={24}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              xSpan={["75%"]}
            >
              <Card style={{ width: "100%", padding: "25px" }}>
                <Row>
                  <Col span={12}>
                    <Flex direction="column" heightSpan={["25%", "65%", "25%"]}>
                      <Text strong>Theme</Text>
                      <Text
                        style={{
                          whiteSpace: "wrap",
                          overflow: "visible",
                          textOverflow: "initial",
                        }}
                      >
                        Change app theme color to your preference.
                      </Text>
                      <Text>Default: 0</Text>
                    </Flex>
                  </Col>
                  <Col span={1}>
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <Divider style={{ width: "1px", height: "100%" }} />
                    </Flex>
                  </Col>
                  <Col span={11}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <Select
                        value={themeState}
                        data={[
                          { value: "light", label: "Light" },
                          { value: "dark", label: "Dark" },
                        ]}
                        onChange={(theme) => {
                          setthemeState(theme);
                        }}
                      />
                    </Flex>
                  </Col>
                </Row>
              </Card>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              xSpan={["75%"]}
            >
              <Card style={{ width: "100%", padding: "25px" }}>
                <Row>
                  <Col span={12}>
                    <Flex direction="column" heightSpan={["25%", "65%", "25%"]}>
                      <Text strong>Tax</Text>
                      <Text
                        style={{
                          whiteSpace: "wrap",
                          overflow: "visible",
                          textOverflow: "initial",
                        }}
                      >
                        Change tax settings for computing your total net sales
                        in each purchase by your consumers.
                      </Text>
                      <Text>Default: 12%</Text>
                    </Flex>
                  </Col>
                  <Col span={1}>
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <Divider style={{ width: "1px", height: "100%" }} />
                    </Flex>
                  </Col>
                  <Col span={11}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <TextField
                        value={taxState}
                        type="number"
                        addonAfter={<BankOutlined />}
                        onChange={(e) => {
                          settaxState(e.target.value);
                        }}
                      />
                    </Flex>
                  </Col>
                </Row>
              </Card>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              xSpan={["75%"]}
            >
              <Card style={{ width: "100%", padding: "25px" }}>
                <Row>
                  <Col span={12}>
                    <Flex direction="column" heightSpan={["25%", "65%", "25%"]}>
                      <Text strong>Stock</Text>
                      <Text
                        style={{
                          whiteSpace: "wrap",
                          overflow: "visible",
                          textOverflow: "initial",
                        }}
                      >
                        Change stock treshold to notify you when products stock
                        are getting low.
                      </Text>
                      <Text>Default: 0</Text>
                    </Flex>
                  </Col>
                  <Col span={1}>
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <Divider style={{ width: "1px", height: "100%" }} />
                    </Flex>
                  </Col>
                  <Col span={11}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <TextField
                        value={stockState}
                        type="number"
                        addonAfter={<NumberOutlined />}
                        onChange={(e) => {
                          setstockState(e.target.value);
                        }}
                      />
                    </Flex>
                  </Col>
                </Row>
              </Card>
            </Flex>
          </Col>
          <Col push={15} span={6} style={{ marginBottom: "25px" }}>
            <Button
              style={{ borderColor: blue[5] }}
              onClick={() => {
                //settings
                pushNotif(
                  ModalEnum.Confirmation({
                    onOk: () => {
                      setTheme(themeState);
                      setStock(stockState);
                      setTax(taxState / 100);
                    },
                  })
                );
              }}
            >
              <Space>
                <Text style={{ color: blue[5] }}>
                  <SaveOutlined />
                </Text>
                <Text style={{ color: blue[5] }}>Save</Text>
              </Space>
            </Button>
          </Col>
          <Col span={24}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              xSpan={["75%"]}
            >
              <Card style={{ width: "100%", padding: "25px" }}>
                <Row>
                  <Col span={12}>
                    <Flex direction="column" heightSpan={["45%", "65%"]}>
                      <Text strong>Delete User</Text>
                      <Text
                        style={{
                          whiteSpace: "wrap",
                          overflow: "visible",
                          textOverflow: "initial",
                        }}
                      >
                        Delete currently logged in user. Need user password.
                      </Text>
                    </Flex>
                  </Col>
                  <Col span={1}>
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <Divider style={{ width: "1px", height: "100%" }} />
                    </Flex>
                  </Col>
                  <Col span={11}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="center"
                      xSpan={["auto"]}
                    >
                      <Button
                        style={{
                          background: red[5],
                        }}
                        onClick={() => {
                          //delete
                          pushNotif(
                            ModalEnum.ConfirmationInput({
                              hidden: true,
                              onOk: async (value) => {
                                const match = decrypt(token.password);
                                const connection = await dbm.checkConnection();
                                if (!connection) {
                                  pushNotif(
                                    ModalEnum.Fail({
                                      message:
                                        "Connection is needed to delete user!",
                                    })
                                  );
                                } else {
                                  if (match === value) {
                                    pushNotif(
                                      ModalEnum.Success({
                                        message: "Now Logging Out!",
                                        afterClose: () => {
                                          dbm.logoutUser().then(() => {
                                            dbm
                                              .localDelete(
                                                "accounts",
                                                token.uid
                                              )
                                              .then((res) => {
                                                dbm
                                                  .serverDelete(
                                                    "accounts",
                                                    token.uid
                                                  )
                                                  .then(() => {
                                                    ipcRenderer.send(
                                                      "return-to-login"
                                                    );
                                                  });
                                              });
                                          });
                                        },
                                      })
                                    );
                                  } else {
                                    pushNotif(
                                      ModalEnum.Fail({
                                        message: "Password incorrect!",
                                      })
                                    );
                                  }
                                }
                              },
                            })
                          );
                        }}
                      >
                        <Space>
                          <Text
                            style={{
                              color: "white",
                            }}
                          >
                            <DeleteOutlined />
                          </Text>
                          <Text
                            style={{
                              color: "white",
                            }}
                          >
                            Delete
                          </Text>
                        </Space>
                      </Button>
                    </Flex>
                  </Col>
                </Row>
              </Card>
            </Flex>
          </Col>
        </Row>
      </Fill>
    </Page>
  );
}
