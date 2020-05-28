import React from "react";
import { Layout } from "antd";
import styled from "styled-components";
import { blue, grey } from "@ant-design/colors";
import _ from "lodash";
import { Config } from "../tools/Config";
import { useAppState } from "../data/Provider";
import { RoutesEnum, AnimationEnum } from "../tools/Enum";
import Animate from "./components/Animate";
import Empty from "./elements/Empty";
import { light, dark } from "../base/theme";
import Fill from "./elements/Fill";

const { Content } = Layout;

const getRoute = (tab) => {
  const arr = _(Object.keys(RoutesEnum))
    .map((val, index) => ({
      key: val,
      tab: val,
    }))
    .filter((val) => {
      const menu = _(Config.menu).split("|").value();
      return _.includes(menu, val.key);
    })
    .value();

  if (arr.length === 0) return <Empty description="You've reached nowhere!" />;
  return arr.map((val, index) => (
    <Animate
      transition={AnimationEnum.FadeSlideIn}
      condition={tab === val.key || (typeof tab !== "string" && index === 0)}
      duration={250}
      key={val.key}
    >
      <Fill>{RoutesEnum[val.key].component}</Fill>
    </Animate>
  ));
};

export default function Route() {
  const { tab, theme } = useAppState();
  return (
    <Layout>
      <ContentWrapper theme={theme}>{getRoute(tab)}</ContentWrapper>
    </Layout>
  );
}

const ContentWrapper = styled(Content)`
  overflow: hidden;
  max-height: calc(100vh - 22px);
  background: ${({ theme }) =>
    theme === "light" ? light.background : grey[7]};
`;
