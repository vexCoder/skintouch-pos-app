import React from "react";
import Fill from "../../elements/Fill";
import Flex from "../../elements/Flex";
import FormItem from "../../components/FormItem";
import TextField from "../../elements/TextField";
import { Formik } from "formik";
import { object, string } from "yup";
import styled from "styled-components";
import { Button, Checkbox, message } from "antd";
import Text from "../../elements/Text";
import { encrypt, decrypt } from "../../../tools/Snippets";
import dbm from "../../../data/DataManager";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

export default function LoginForm(props) {
  const { theme, handleLogin, handleSubmit, setloggingIn, loggingIn } = props;
  return (
    <Fill style={{ padding: "5%", marginTop: "25%" }}>
      <Formik
        validateOnChange={false}
        initialValues={{ username: "", password: "", remember: false }}
        validationSchema={object().shape({
          username: string().required("Required"),
          password: string().required("Required"),
        })}
        onSubmit={(values, actions) => {
          const data = {
            username: values.username,
            password: encrypt(values.password).toString(),
            remember: values.remember
              ? moment().add(30, "day").unix()
              : moment().unix(),
          };
          handleLogin(data).then((res) => {
            if (res.state) {
              const token = encrypt(
                JSON.stringify({ ...res.user, remember: data.remember })
              ).toString();
              dbm.localSet("token", token);
              setTimeout(() => {
                message.success(res.message);
              }, 1500);
              setTimeout(handleSubmit, 2500);
            } else {
              setloggingIn(false);
              message.error(res.message);
            }
            actions.resetForm();
          });
        }}
      >
        {({ values, setFieldValue, errors, submitForm }) => {
          return (
            <Flex
              direction="column"
              align="center"
              justify="center"
              heightSpan={["33%", "33%", "auto"]}
              xSpan={["100%", "100%", "auto", "50%"]}
            >
              <FormItem
                label="Username"
                tooltip="Enter your username!"
                error={errors.username}
                placement="top"
                themeLocal={"dark"}
              >
                <TextField
                  disabled={loggingIn}
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
                  disabled={loggingIn}
                  style={{ "-webkit-app-region": "no-drag" }}
                  type="password"
                  value={values.password}
                  onChange={(e) => {
                    setFieldValue("password", e.target.value);
                  }}
                />
              </FormItem>
              <Checkbox
                style={{ color: "white", "-webkit-app-region": "no-drag" }}
                checked={values.remember}
                onChange={() => {
                  setFieldValue("remember", !values.remember);
                }}
              >
                Remember? (1 month)
              </Checkbox>
              <StyledButton
                disabled={loggingIn}
                style={{ width: "100%" }}
                onClick={() => {
                  if (loggingIn) return;
                  setloggingIn(true);
                  submitForm();
                }}
              >
                {!loggingIn ? (
                  <Text style={{ color: "white !important" }}>Submit</Text>
                ) : (
                  <LoadingOutlined rotate={true} style={{ color: "white" }} />
                )}
              </StyledButton>
            </Flex>
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
