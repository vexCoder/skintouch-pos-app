import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

export default function Page(props) {
  const { children, padding, background } = props;
  const { Container, Padding } = Styled;
  return (
    <Container background={background} style={{ ...props.style }}>
      <Padding padding={padding}>{children}</Padding>
    </Container>
  );
}

Page.propTypes = {
  background: PropTypes.string,
  padding: PropTypes.string,
};

Page.defaultProps = {
  background: "none",
  padding: "5%",
};

const Styled = {
  Container: styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background: ${(props) => props.background};
  `,
  Padding: styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: ${(props) => props.padding};
    box-sizing: border-box;
  `,
};
