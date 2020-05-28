import React from "react";
import Page from "../../components/Page";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import dbm from "../../../data/DataManager";
import { Row, Col, Button, Space, message } from "antd";
import Flex from "../../elements/Flex";
import {
  CloseCircleOutlined,
  CloseSquareOutlined,
  CloseCircleFilled,
  CloseOutlined,
  MinusOutlined,
  MinusSquareOutlined,
  CloseSquareTwoTone,
  MinusSquareTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import { ButtonTheme } from "../../../base/theme";
import { red, magenta, green, grey, blue } from "@ant-design/colors";
import Text from "../../elements/Text";
import Animate from "../../components/Animate";
import { AnimationEnum, StateTypeEnum } from "../../../tools/Enum";
import styled from "styled-components";
import Fill from "../../elements/Fill";
import bg from "../../../assets/makeup.jpg";
import { decrypt } from "../../../tools/Snippets";
import moment from "moment";

const { ipcRenderer } = window.require("electron");

export default function Login() {
  const { token } = useAppState();
  const { addAccount } = useAppDispatch(StateTypeEnum.Accounts);
  const [theme, settheme] = React.useState("light");
  const [isLogin, setisLogin] = React.useState(true);
  const [loaded, setloaded] = React.useState(false);
  const [loggingIn, setloggingIn] = React.useState(false);

  const handleSubmit = () => {
    setTimeout(() => {
      setloggingIn(false);
      ipcRenderer.sendSync("open-main-window");
    }, 1500);
  };

  const handleLogin = async (data) => {
    return dbm.loginUser(data);
  };

  const handleRegister = async (data) => {
    return addAccount(data, (res) => {
      if (res.state) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
      return res.state;
    });
  };

  const image = new Image();
  image.onload = function () {
    setloaded(true);
  };
  image.src = bg;

  React.useEffect(() => {
    console.log(token, moment().unix());
    if (token && token.remember >= moment().unix()) {
      handleSubmit();
    }
  }, [token]);

  return (
    <Fill
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Page
        style={{
          boxSizing: "border-box",
          background: `hsla(31,${loaded ? 0 : 9}%,${loaded ? 0 : 21}%,${
            loaded ? 0.5 : 1
          })`,
          transition: "all 1.0s ease-in-out",
        }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{
            position: "absolute",
            height: "auto",
            width: "100%",
            bottom: 30,
            left: 0,
          }}
          heightSpan={["20px", "auto"]}
          xSpan={["auto", "auto"]}
          spacing={0}
        >
          <Text
            themeLocal={theme}
            size="small"
            style={{ color: "white", lineHeight: "1.2em" }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <StyledButton
            disabled={loggingIn}
            style={{
              ...ButtonTheme[theme],
              color: isLogin ? green[4] : blue[4],
              width: "auto",
              height: "auto",
              padding: 0,
              "-webkit-app-region": "no-drag",
              background: "red",
            }}
            onClick={() => {
              setisLogin(!isLogin);
            }}
            type="link"
          >
            {isLogin ? "Register Now!" : "Login!"}
          </StyledButton>
        </Flex>
        <Row style={{ marginTop: "2em" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Flex
              direction="column"
              style={{
                border: `3px solid ${magenta[2]}`,
              }}
            >
              <Text
                themeLocal={theme}
                size="h3"
                strong
                style={{ color: magenta[2] }}
              >
                SKINTOUCH
              </Text>
              <Text themeLocal={theme} size="small" style={{ color: "white" }}>
                Point of Sales & Inventory
              </Text>
            </Flex>
          </Col>
          <Col span={24}>
            <>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={isLogin}
                duration={250}
              >
                <LoginForm
                  setloggingIn={setloggingIn}
                  loggingIn={loggingIn}
                  theme={theme}
                  handleLogin={handleLogin}
                  handleSubmit={handleSubmit}
                />
              </Animate>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={!isLogin}
                duration={250}
              >
                <RegisterForm
                  theme={theme}
                  handleRegister={handleRegister}
                  setisLogin={setisLogin}
                />
              </Animate>
            </>
          </Col>
        </Row>
      </Page>
    </Fill>
  );
}

const StyledButton = styled(Button)`
  transition: 0.25s all ease-in-out;
  background: none !important;
  &:hover {
    transform: scale(1.15);
  }
`;

const StyledFillFlex = styled(Fill)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
