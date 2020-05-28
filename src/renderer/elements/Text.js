import React from "react";
import { useAppState } from "../../data/Provider";
import { light, dark } from "../../base/theme";
import styled from "styled-components";
import PropTypes from "prop-types";

export default function Text(props) {
  const { children, variant, size, strong, style, noWrap, themeLocal } = props;
  var { theme } = useAppState();
  if (themeLocal) theme = themeLocal;

  const presetSize = {
    small: 14,
    medium: 20,
    large: 28,
    h1: 96,
    h2: 60,
    h3: 48,
    h4: 34,
    h5: 24,
    h6: 20,
    xs: 11,
  };

  return (
    <StyledText
      styler={{
        display: "inline-block",
        width: "auto",
        whiteSpace: noWrap ? "nowrap" : "normal",
        color: theme === "light" ? light[variant] : dark[variant],
        fontSize: `${presetSize[size]}px`,
        fontWeight: strong ? "bold" : "normal",
        lineHeight: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        ...style,
      }}
    >
      {children}
    </StyledText>
  );
}

const StyledText = styled.div((props) => {
  return props.styler;
});

Text.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  strong: PropTypes.bool,
};

Text.defaultProps = {
  variant: "text",
  size: "small",
  strong: false,
};
