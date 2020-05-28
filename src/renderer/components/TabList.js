import PropTypes from "prop-types";
import React from "react";
import { Tabs, Row, Col } from "antd";
import Text from "../elements/Text";
import Fill from "../elements/Fill";
import styled from "styled-components";
import Flex from "../elements/Flex";
import FillButton from "../elements/FillButton";
import Divider from "../elements/Divider";
import { useAppState } from "../../data/Provider";
import { light, dark } from "../../base/theme";
import Animate from "./Animate";
import { AnimationEnum } from "../../tools/Enum";

const { TabPane } = Tabs;

function getTabButton({
  titles,
  isVertical,
  tabspacing,
  active,
  setactive,
  theme,
  tabHeight,
  transition,
  tabWidth,
  activeRef,
  buttonAlign,
  icons,
}) {
  const direction = isVertical ? "row" : "column";
  const color = theme === "light" ? light.textSecondary : dark.text;
  const colorOff = theme === "light" ? "inherit" : dark.textSecondary;
  const flexStyle = isVertical
    ? {
        minWidth: `${tabWidth * titles.length}px`,
        maxWidth: `${tabWidth * titles.length}px`,
      }
    : {
        minHeight: `${tabHeight * titles.length}px`,
        maxHeight: `${tabHeight * titles.length}px`,
      };
  return (
    <Flex direction={direction} align="flex-end" style={{ ...flexStyle }}>
      {titles.map((val, index) => (
        <FillButton
          affix={
            null ||
            React.cloneElement(icons[index], {
              style: {
                color: active === index ? color : colorOff,
                transition: `all ${350}ms ${transition}`,
              },
            })
          }
          style={{
            borderRadius: 0,
            textAlign: buttonAlign,
          }}
          onClick={() => {
            setactive(index);
          }}
        >
          <Text
            noWrap
            style={{
              color: active === index ? color : colorOff,
              transition: `all ${350}ms ${transition}`,
            }}
          >
            {val}
          </Text>
        </FillButton>
      ))}
    </Flex>
  );
}

export default function TabList(props) {
  const {
    contents,
    position,
    titles,
    tabspan,
    tabspacing,
    tabHeight,
    tabWidth,
    buttonAlign,
    icons,
    hide,
    renderProps,
  } = props;
  const { theme } = useAppState();

  const transition = "cubic-bezier(0.7, 0, 0.84, 0)";

  const isVertical = position === "top" || position === "bottom";

  const span = isVertical ? 24 : tabspan || 5;
  const spanDivider = isVertical ? 24 : 1;
  const spanOther = isVertical ? 24 : 23 - tabspan;
  const [active, setactive] = React.useState(0);

  const activeRef = React.useRef(null);

  const tabStyle = isVertical
    ? {
        width: `${tabWidth}px`,
        height: "2px",
        marginLeft: `${tabWidth * active}px`,
      }
    : {
        height: `${tabHeight}px`,
        width: "2px",
        marginTop: `${tabHeight * active}px`,
      };

  const divStyle = isVertical
    ? { width: "100%", height: "1px" }
    : { height: "100%", width: "1px" };
  const sub = [
    <Col span={span}>
      {getTabButton({
        ...props,
        theme,
        active,
        setactive,
        transition,
        isVertical,
        activeRef,
      })}
    </Col>,
    <Col span="auto">
      <div
        style={{
          ...tabStyle,
          background: theme === "light" ? light.primary : dark.text,
          transition: `all ${150}ms ${transition}`,
        }}
      />
    </Col>,
    <Col span="auto">
      <div
        style={{
          ...divStyle,
          background: theme === "light" ? light.primary : dark.primary,
        }}
      />
    </Col>,
    <Col span={spanOther}>
      {contents.map((val, index) => (
        <Animate
          transition={AnimationEnum.FadeSlideIn}
          condition={active === index}
          duration={250}
        >
          {React.cloneElement(val, { hide, renderProps })}
        </Animate>
      ))}
    </Col>,
  ];

  switch (position) {
    case "right":
    case "bottom":
      sub = sub.reverse();
      break;
  }

  return (
    <Fill style={{ minHeight: "100%", overflow: "hidden" }}>
      <Row style={{ minHeight: "100%" }}>{sub.map((val) => val)}</Row>
    </Fill>
  );
}

const TabButtonFlex = styled.div``;

TabList.propTypes = {
  contents: PropTypes.array,
  position: PropTypes.string,
  titles: PropTypes.array,
  tabspan: PropTypes.number,
  tabHeight: PropTypes.number,
  tabWidth: PropTypes.number,
  buttonAlign: PropTypes.string,
};

TabList.defaultProps = {
  contents: [],
  position: "top",
  titles: [],
  tabspan: 0,
  tabHeight: 42,
  tabWidth: 80,
  buttonAlign: "center",
};
