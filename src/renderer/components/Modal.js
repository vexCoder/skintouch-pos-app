import PropTypes from "prop-types";
import React from "react";
import { Modal as ModalComponent } from "antd";
import styled from "styled-components";
import { useAppState } from "../../data/Provider";
import { light, dark } from "../../base/theme";

export default function Modal(props) {
  const { centered, minHeight } = props;
  const { theme } = useAppState();
  return (
    <ModalWrapper
      {...props}
      bodyStyle={{
        overflow: "hidden",
        background: theme === "light" ? light.background : dark.darker,
        color: theme === "light" ? light.text : dark.text,
        height: minHeight ? minHeight : "auto",
        ...props.style,
      }}
      destroyOnClose={true}
      footer={null}
    >
      {props.children}
    </ModalWrapper>
  );
}

Modal.propTypes = {
  centered: PropTypes.bool,
};

const ModalWrapper = styled(ModalComponent)((props) => props.styler);
