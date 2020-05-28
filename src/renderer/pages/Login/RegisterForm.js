import React from "react";
import Fill from "../../elements/Fill";
import Flex from "../../elements/Flex";
import FormItem from "../../components/FormItem";
import TextField from "../../elements/TextField";
import { Formik } from "formik";
import { object, string } from "yup";
import styled from "styled-components";
import { Button, message, Space, Col, Row } from "antd";
import Text from "../../elements/Text";
import { encrypt } from "../../../tools/Snippets";
import Accounts from "../../../data/Model/Accounts";
import Animate from "../../components/Animate";
import { AnimationEnum } from "../../../tools/Enum";
import Card from "../../elements/Card";
import dbm from "../../../data/DataManager";
import Icon, { LoadingOutlined } from "@ant-design/icons";

export default function RegisterForm(props) {
  const { theme, handleRegister, setisLogin } = props;
  const [step, setstep] = React.useState(0);
  const [waitConn, setwaitConn] = React.useState(false);
  return (
    <Fill style={{ padding: "10%", marginTop: "15%" }}>
      <Formik
        validateOnChange={false}
        initialValues={{
          username: "",
          password: "",
          remember: false,
          firstname: "",
          lastname: "",
        }}
        validationSchema={object().shape({
          username: string()
            .min(6, "Min length is 6 characters")
            .required("Required"),
          password: string()
            .min(8, "Min length is 8 characters")
            .required("Required"),
          firstname: string().required("Required"),
          lastname: string().required("Required"),
        })}
        onSubmit={(values, actions) => {
          const data = {
            username: values.username,
            password: encrypt(values.password).toString(),
            firstname: values.firstname,
            lastname: values.lastname,
          };
          handleRegister(data).then((res) => {
            setisLogin(true);
            actions.resetForm();
          });
        }}
      >
        {({ values, setFieldValue, errors, submitForm, validateForm }) => {
          return (
            <>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={step === 0}
                duration={250}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  heightSpan={["33%", "33%", "auto"]}
                  xSpan={["100%", "100%", "50%"]}
                >
                  <FormItem
                    label="Username"
                    tooltip="Enter your username!"
                    error={errors.username}
                    placement="top"
                    themeLocal={"dark"}
                  >
                    <TextField
                      style={{ "-webkit-app-region": "no-drag" }}
                      value={values.username}
                      onChange={(e) => {
                        setFieldValue("username", e.target.value);
                      }}
                    />
                  </FormItem>
                  <FormItem
                    label="Password"
                    tooltip="Enter your password!"
                    error={errors.password}
                    placement="top"
                    themeLocal={"dark"}
                  >
                    <TextField
                      style={{ "-webkit-app-region": "no-drag" }}
                      type="password"
                      value={values.password}
                      onChange={(e) => {
                        setFieldValue("password", e.target.value);
                      }}
                    />
                  </FormItem>
                  <StyledButton
                    style={{ width: "100%", marginTop: "30%" }}
                    onClick={() => {
                      setstep(step + 1);
                    }}
                  >
                    <Text style={{ color: "white !important" }}>Next</Text>
                  </StyledButton>
                </Flex>
              </Animate>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={step === 1}
                duration={250}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  heightSpan={["33%", "33%", "auto"]}
                  xSpan={["100%", "100%", "70%"]}
                >
                  <FormItem
                    label="First Name"
                    tooltip="Enter your first name!"
                    error={errors.firstname}
                    placement="top"
                    themeLocal={"dark"}
                  >
                    <TextField
                      style={{ "-webkit-app-region": "no-drag" }}
                      value={values.firstname}
                      onChange={(e) => {
                        setFieldValue("firstname", e.target.value);
                      }}
                    />
                  </FormItem>
                  <FormItem
                    label="Last Name"
                    tooltip="Enter your last name!"
                    error={errors.lastname}
                    placement="top"
                    themeLocal={"dark"}
                  >
                    <TextField
                      style={{ "-webkit-app-region": "no-drag" }}
                      value={values.lastname}
                      onChange={(e) => {
                        setFieldValue("lastname", e.target.value);
                      }}
                    />
                  </FormItem>
                  <Row
                    style={{ marginTop: "30%", width: "100%" }}
                    align="middle"
                    justify="space-between"
                    spacing={3}
                  >
                    <Col span={11}>
                      <StyledButton
                        style={{ width: "100%" }}
                        onClick={() => {
                          setstep(step - 1);
                        }}
                      >
                        <Text style={{ color: "white !important" }}>Back</Text>
                      </StyledButton>
                    </Col>
                    <Col span={11}>
                      <StyledButton
                        style={{ width: "100%" }}
                        onClick={() => {
                          setstep(step + 1);
                        }}
                      >
                        <Text style={{ color: "white !important" }}>Next</Text>
                      </StyledButton>
                    </Col>
                  </Row>
                </Flex>
              </Animate>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={step === 2}
                duration={250}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  heightSpan={["auto", "10%"]}
                  xSpan={["100%", "70%"]}
                >
                  <Card>
                    <Row style={{ padding: "15px" }}>
                      <Col span={24}>
                        <Text size="medium">Summary:</Text>
                      </Col>
                      <Col span={12}>Username: </Col>
                      <Col
                        span={12}
                        style={{
                          textAlign: "right",
                          color: values.username ? "black" : "red",
                        }}
                      >
                        {values.username || "not set"}
                      </Col>
                      <Col span={12}>Password: </Col>
                      <Col
                        span={12}
                        style={{
                          textAlign: "right",
                          color: values.password ? "black" : "red",
                        }}
                      >
                        {values.password
                          .split("")
                          .map((v) => "*")
                          .join("") || "not set"}
                      </Col>
                      <Col span={12}>First Name: </Col>
                      <Col
                        span={12}
                        style={{
                          textAlign: "right",
                          color: values.firstname ? "black" : "red",
                        }}
                      >
                        {values.firstname || "not set"}
                      </Col>
                      <Col span={12}>Last Name: </Col>
                      <Col
                        span={12}
                        style={{
                          textAlign: "right",
                          color: values.lastname ? "black" : "red",
                        }}
                      >
                        {values.lastname || "not set"}
                      </Col>
                    </Row>
                  </Card>
                  <Row
                    style={{ width: "100%" }}
                    align="middle"
                    justify="space-between"
                    spacing={3}
                  >
                    <Col span={11}>
                      <StyledButton
                        style={{ width: "100%" }}
                        onClick={() => {
                          setstep(0);
                        }}
                      >
                        <Text style={{ color: "white !important" }}>
                          Return
                        </Text>
                      </StyledButton>
                    </Col>
                    <Col span={11}>
                      <StyledButton
                        style={{ width: "100%" }}
                        onClick={async () => {
                          setwaitConn(true);
                          validateForm(values).then((err) => {
                            if (Object.keys(err).length > 0) {
                              message.error(
                                "There are errors in your form please recheck"
                              );
                              return;
                            }
                          });
                          const conn = dbm.checkConnection().then((bool) => {
                            if (bool) {
                              setwaitConn(false);
                              submitForm();
                            } else {
                              setwaitConn(false);
                              message.error("No connection established");
                              return;
                            }
                          });
                        }}
                      >
                        {!waitConn ? (
                          <Text style={{ color: "white !important" }}>
                            Submit
                          </Text>
                        ) : (
                          <LoadingOutlined rotate={true} />
                        )}
                      </StyledButton>
                    </Col>
                  </Row>
                </Flex>
              </Animate>
            </>
          );
        }}
      </Formik>
    </Fill>
  );
}

const StyledButton = styled(Button)`
  transition: 0.25s all ease-in-out;
  background: hsla(222, 75%, 55%, 0.9) !important;
  border: none;
  border-radius: 5px;
  color: white;
  -webkit-app-region: no-drag;
  &:hover {
    transform: scale(1.05);
  }
`;
