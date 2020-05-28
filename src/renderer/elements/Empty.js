import PropTypes from "prop-types";
import React from "react";
import { Empty as EmptyComponent } from "antd";
import styled from "styled-components";
import { EmptyTheme, light, dark } from "../../base/theme";
import { useAppState } from "../../data/Provider";
import { QuestionCircleFilled } from "@ant-design/icons";
import { magenta } from "@ant-design/colors";

export default function Empty(props) {
  const { styles, data, size, iconStyle } = props;
  const { theme } = useAppState();

  const fontSize = {
    xs: "15px",
    small: "25px",
    regular: "50px",
    medium: "75px",
    large: "125px",
  };

  return (
    <StyledEmpty
      {...props}
      styler={{ ...EmptyTheme[theme], ...styles }}
      image={
        <QuestionCircleFilled
          style={{
            marginTop: "80%",
            fontSize: fontSize[size],
            color: theme === "light" ? magenta[3] : dark.textSecondary,
            ...iconStyle,
          }}
        />
      }
    />
  );
}

Empty.propTypes = {
  size: PropTypes.any,
};

Empty.defaultProps = {
  size: "medium",
};

const StyledEmpty = styled(EmptyComponent)((props) => {
  return props.styler;
});
