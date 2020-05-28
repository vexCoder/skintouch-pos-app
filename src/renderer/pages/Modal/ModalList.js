import React from "react";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import { StateTypeEnum } from "../../../tools/Enum";
import Modal from "../../components/Modal";
import { CloseOutlined } from "@ant-design/icons";
import { red } from "@ant-design/colors";
import _ from "lodash";

export default function ModalList() {
  const { notification } = useAppState();
  const { popNotif, hideNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  return (
    <>
      {notification.map((val, index) => {
        return (
          <Modal
            style={{ top: val.props.top }}
            width={val.width || 520}
            key={index}
            keyboard={val.keyboard}
            minHeight={
              _.has(val.props, "minHeight") ? val.props.minHeight : "100%"
            }
            visible={index === notification.length - 1 && val.show}
            closeIcon={<CloseOutlined style={{ color: red[4] }} />}
            onCancel={() => {
              hideNotif(index);
            }}
            afterClose={() => {
              if (val.props.hasOwnProperty("afterClose"))
                val.props.afterClose();
              const closed = notification
                .map((val) => {
                  return val.show;
                })
                .reduce((prev, curr) => {
                  return prev || curr;
                }, false);
              if (!closed) {
                notification.forEach((val) => {
                  popNotif();
                });
              }
            }}
          >
            {React.cloneElement(val.component, {
              hide: (bool) => {
                hideNotif(index);
              },
              renderProps: val.props,
            })}
          </Modal>
        );
      })}
    </>
  );
}
