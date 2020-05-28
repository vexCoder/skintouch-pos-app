import React from "react";
import { Menu, Popover, Space } from "antd";
import {
  RoutesEnum,
  StateTypeEnum,
  AnimationEnum,
  BreakPointsEnum,
  ModalEnum,
} from "../../../tools/Enum";
import _ from "lodash";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import { SideBarTheme, MenuItemTheme } from "../../../base/theme";
import { Config } from "../../../tools/Config";
import Animate from "../../components/Animate";
import useWindowDimensions from "../../../tools/Hooks";
import Text from "../../elements/Text";
import Flex from "../../elements/Flex";
import { magenta } from "@ant-design/colors";
import Button from "../../elements/Button";
import Icon, { LogoutOutlined } from "@ant-design/icons";
import dbm from "../../../data/DataManager";

const { ipcRenderer } = window.require("electron");

const getMenu = ({ theme, tab }) => {
  const arr = _(Object.keys(RoutesEnum))
    .map((val) => ({
      ...RoutesEnum[val],
    }))
    .filter((val) => {
      const menu = _(Config.menu).split("|").value();
      return _.includes(menu, val.key);
    })
    .value();

  return arr.map((val) => {
    const selected = tab ? tab === val.key : _.first(arr).key === val.key;
    return (
      <Menu.Item
        style={{ ...MenuItemTheme(selected)[theme] }}
        key={val.key}
        icon={val.icon}
        title={null}
      >
        {val.title}
      </Menu.Item>
    );
  });
};

export default function Sidebar(props) {
  const { theme, tab, token } = useAppState();
  const { switchTab, pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { height, width } = useWindowDimensions();

  const handleClick = (e) => {
    switchTab(e.key);
  };

  var show;
  if (width <= BreakPointsEnum.Md) {
    show = false;
  } else {
    show = true;
  }

  return (
    <Menu
      style={{ ...SideBarTheme[theme], height: "100%" }}
      onClick={handleClick}
      defaultSelectedKeys={[tab]}
      mode="vertical"
    >
      <div>
        <Animate
          transition={AnimationEnum.FadeSlideIn}
          condition={show}
          duration={250}
        >
          <div style={{ padding: "25px 25px 25px 10px" }}>
            <Flex direction="column">
              <Text size="large" style={{ color: magenta[2] }}>
                Skintouch
              </Text>
              <Text size="small">Point of Sales & Inventory</Text>
              <Space style={{ paddingTop: "10px" }}>
                <Text size="medium">Welcome,</Text>
                <Text size="medium" style={{ textTransform: "capitalize" }}>
                  {token && token.hasOwnProperty("firstname")
                    ? token.firstname
                    : "n/a"}
                </Text>
              </Space>
            </Flex>
          </div>
        </Animate>
      </div>
      {getMenu({ theme, tab })}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          width: "100%",
          height: "25px",
          padding: "10%",
        }}
      >
        <Button
          onClick={() => {
            pushNotif(
              ModalEnum.Confirmation({
                body: "Are you sure you want to log-out?",
                onOk: () => {
                  dbm.logoutUser().then(() => {
                    ipcRenderer.send("return-to-login");
                  });
                },
              })
            );
          }}
        >
          {show ? "Logout" : <LogoutOutlined />}
        </Button>
      </div>
    </Menu>
  );
}
