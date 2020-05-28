import PropTypes from "prop-types";
import { grey } from "@ant-design/colors";
import { CheckOutlined } from "@ant-design/icons";
import { Select as SelectComponent, Tag, ConfigProvider } from "antd";
import React from "react";
import styled from "styled-components";
import {
  dark,
  light,
  SelectDropdownTheme,
  SelectOptionStyles,
  SelectTheme,
} from "../../base/theme";
import { useAppState } from "../../data/Provider";
import Empty from "./Empty";

const { Option } = SelectComponent;

export default function Select(props) {
  const { styles, data } = props;
  const { theme } = useAppState();

  const [hovered, setHovered] = React.useState(null);

  return (
    <StyledSelect
      tagRender={(props) => {
        const { value, closable, onClose } = props;
        return (
          <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
            {value}
          </Tag>
        );
      }}
      dropdownStyle={{ ...SelectDropdownTheme[theme] }}
      menuItemSelectedIcon={
        <CheckOutlined
          style={{ color: theme === "light" ? light.primary : dark.primary }}
        />
      }
      styler={{ ...SelectTheme[theme], ...styles }}
      {...props}
    >
      {data.length > 0 &&
        data.map((val, index) => {
          const check = hovered === index;
          const themeCheck = theme === "light";
          const bg = themeCheck ? "rgba(0,0,0,0.06)" : grey[5];
          return (
            <Option
              style={{
                position: "relative",
                padding: "0 !important",
                margin: "0 !important",
                background: "rgba(0,0,0,0)",
              }}
              value={val.value}
              key={index}
            >
              <div
                style={{
                  color: theme === "light" ? light.text : dark.text,
                  background: check && bg ? bg : "inherit",
                  ...SelectOptionStyles,
                }}
                onMouseEnter={() => {
                  setHovered(index);
                }}
                onClick={() => {
                  setHovered(null);
                }}
              >
                {val.label}
              </div>
            </Option>
          );
        })}
    </StyledSelect>
  );
}

Select.propTypes = {
  data: PropTypes.array,
};

Select.defaultProps = {
  data: [],
};

const StyledSelect = styled(SelectComponent)((props) => {
  return props.styler;
});
