import React from "react";
import styled from "styled-components";

export default function Fill(props) {
  return <DivWrapper {...props}>{props.children}</DivWrapper>;
}

const DivWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
