import PropTypes from "prop-types";
import React from "react";
import { Button as ButtonComponent } from "antd";
import styled from "styled-components";
import { useAppState } from "../../data/Provider";
import { ButtonTheme, dark, light } from "../../base/theme";
import { magenta } from "@ant-design/colors";

export default function Divider(props) {
  const { styles, size } = props;
  const { theme } = useAppState();

  return (
    <DividerWrapper
      styler={{
        ...styles,
        width: `${size}px`,
        background: theme === "light" ? magenta[2] : dark.primary,
      }}
      {...props}
    />
  );
}

Divider.propTypes = {
  size: PropTypes.number,
};

Divider.defaultProps = {
  size: 1,
};

const DividerWrapper = styled.div((props) => {
  return props.styler;
});
