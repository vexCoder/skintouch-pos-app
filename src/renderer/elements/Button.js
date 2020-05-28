import React from "react";
import { Button as ButtonComponent } from "antd";
import styled from "styled-components";
import { useAppState } from "../../data/Provider";
import { ButtonTheme } from "../../base/theme";

export default function Button(props) {
  const { children, styles, themeLocal, type } = props;
  const { theme } = useAppState();
  const background = type === "link" ? { background: "transparent" } : {};
  return (
    <StyledButton
      styler={{ ...ButtonTheme[theme], ...styles, ...background }}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

const StyledButton = styled(ButtonComponent)((props) => {
  return props.styler;
});
