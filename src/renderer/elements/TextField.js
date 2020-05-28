import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import { TextFieldTheme, light, dark } from "../../base/theme";
import { useAppState } from "../../data/Provider";

export default function TextField(props) {
  const { styles, error } = props;
  var { theme } = useAppState();
  if (props.themeLocal) theme = props.themeLocal;

  return (
    <StyledTextField
      styler={{
        ...TextFieldTheme[theme],
        ...styles,
      }}
      {...props}
    />
  );
}

const StyledTextField = styled(Input)((props) => {
  return props.styler;
});
