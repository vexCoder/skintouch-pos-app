import PropTypes from "prop-types";
import React from "react";
import Fill from "./Fill";

export default function Flex(props) {
  const {
    justify,
    align,
    direction,
    spacing,
    style,
    ySpan,
    xSpan,
    heightSpan,
  } = props;
  return (
    <Fill {...props}>
      <Fill
        style={{
          display: "flex",
          justifyContent: justify,
          flexDirection: direction,
          alignItems: align,
          alignContent: align,
          flexWrap: "wrap",
        }}
      >
        {React.Children.map(props.children, (child, index) => (
          <Fill
            style={{
              padding: `${spacing}px`,
              height: `auto`,
              flex: ySpan ? ySpan[index] : 1,
              width: xSpan ? xSpan[index] : "100%",
              maxWidth: xSpan ? xSpan[index] : "100%",
              height: heightSpan ? heightSpan[index] : "auto",
              maxHeight: heightSpan ? heightSpan[index] : "auto",
            }}
          >
            {child}
          </Fill>
        ))}
      </Fill>
    </Fill>
  );
}

Flex.propTypes = {
  align: PropTypes.string,
  justify: PropTypes.string,
  direction: PropTypes.string,
  spacing: PropTypes.number,
};

Flex.defaultProps = {
  align: "center",
  justify: "flex-start",
  direction: "row",
  spacing: 0,
};
