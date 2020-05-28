import PropTypes from "prop-types";
import React from "react";
import Fill from "../elements/Fill";
import { Row, Col } from "antd";
import Flex from "../elements/Flex";
import { AnimationEnum } from "../../tools/Enum";
import Animate from "./Animate";

export default function List(props) {
  const {
    renderItem,
    data,
    itemSpan,
    colSpan,
    spacing,
    padding,
    maxHeight,
    header,
  } = props;

  const flex = (prop) => (
    <Flex
      justify="flex-start"
      align="flex-start"
      spacing={spacing}
      xSpan={data.map(() => `${100 / (24 / itemSpan)}%`)}
      ySpan={data.map(() => "1 auto")}
      heightSpan={data.map(() => `${100 / colSpan}%`)}
      style={{
        height: "100%",
        width: "100%",
        padding: padding,
      }}
    >
      {prop.children}
    </Flex>
  );

  let children = [data.map((val, index) => renderItem(val, index))];
  if (header) children = [header, ...children];

  return (
    <Fill
      {...props}
      style={{
        position: "relative",
        ...props.style,
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {flex({ children: children })}
    </Fill>
  );
}

List.propTypes = {
  data: PropTypes.array,
  itemSpan: PropTypes.any,
  renderItem: PropTypes.func,
  spacing: PropTypes.number,
  colItemSpan: PropTypes.number,
};

List.defaultProps = {
  data: [],
  itemSpan: "auto",
  renderItem: (val) => <div>{JSON.stringify(val)}</div>,
  spacing: 4,
  colItemSpan: 4,
};
