import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { useAppState } from "../../data/Provider";
import { light, dark } from "../../base/theme";
import { Typography, Col, Row } from "antd";
import Text from "./Text";
import { findByType } from "../../tools/Snippets";
import Fill from "./Fill";

const shadows = [
  "0",
  "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
  "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
  "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
  "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
];

export default function Card(props) {
  const { shadow, children, style } = props;
  const { theme } = useAppState();

  return (
    <CardWrapper
      {...props}
      style={{ ...style }}
      theme={theme}
      shadow={shadows[shadow]}
    >
      {children}
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  box-shadow: ${(props) => props.shadow};
  background: ${({ theme }) =>
    theme === "light" ? light.background : dark.background};
  color: ${({ theme }) => (theme === "light" ? light.text : dark.text)};
`;

Card.propTypes = {
  pad: PropTypes.string,
  shadow: PropTypes.number,
  orientation: PropTypes.string,
};

Card.defaultProps = {
  pad: "15px",
  shadow: 1,
  orientation: "horizontal",
};
