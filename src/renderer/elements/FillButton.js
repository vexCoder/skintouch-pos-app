import React from "react";
import { Button as ButtonComponent, Space } from "antd";
import styled from "styled-components";
import { useAppState } from "../../data/Provider";
import { ButtonTheme, dark, light } from "../../base/theme";
import Flex from "./Flex";

export default function FillButton(props) {
  const { children, styles, prefix, affix, ref } = props;
  const { theme } = useAppState();

  return (
    <StyledButton
      styler={{
        ...styles,
        width: "100%",
        height: "100%",
        minWidth: "100%",
        minHeight: "100%",
        outline: 0,
        border: 0,
        background: theme === "light" ? light.background : dark.darker,
      }}
      {...props}
    >
      <Space>
        {prefix ? prefix : null}
        {children}
        {affix ? affix : null}
      </Space>
    </StyledButton>
  );
}

const StyledButton = styled.button((props) => {
  return props.styler;
});
