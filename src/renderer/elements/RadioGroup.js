import { Col, Row } from "antd";
import React from "react";
import { dark, light } from "../../base/theme";
import { useAppState } from "../../data/Provider";
import Button from "./Button";

const getRadioButtons = ({ data, selected, onChange, theme }) => {
  return data.map((val, index) => {
    const buttonTheme = {
      light: {
        selected: {
          background: light.primary,
          color: "white",
          border: `1px solid ${light.primary}`,
        },
        unselected: {},
      },
      dark: {
        selected: {
          background: dark.primary,
          borderLeft:
            theme === "dark" && index > 0
              ? "1px inset rgba(120, 120, 120, 0.10)"
              : null,
        },
        unselected: {
          background: dark.background,
          borderLeft:
            theme === "dark" && index > 0
              ? "1px inset rgba(210, 210, 210, 0.55)"
              : null,
        },
      },
    };

    const styling =
      index === selected
        ? buttonTheme[theme].selected
        : buttonTheme[theme].unselected;
    return (
      <Col span={parseInt(24 / data.length)} key={index}>
        <Button
          style={{
            ...styling,
            borderRadius:
              index === 0
                ? "3px 0 0 3px"
                : index === data.length - 1
                ? "0 3px 3px 0"
                : 0,
          }}
          onClick={() => {
            onChange(index === selected ? null : index);
          }}
          value={index}
        >
          {val}
        </Button>
      </Col>
    );
  });
};

export default function RadioGroup(props) {
  const { data, selected, onChange } = props;
  const { theme } = useAppState();
  return (
    <Row {...props}>{getRadioButtons({ data, selected, onChange, theme })}</Row>
  );
}
