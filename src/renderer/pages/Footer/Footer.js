import React from "react";
import Fill from "../../elements/Fill";
import { useAppState } from "../../../data/Provider";
import { light, dark } from "../../../base/theme";
import { Row, Col } from "antd";
import moment from "moment";
import { magenta } from "@ant-design/colors";
import dbm from "../../../data/DataManager";
import { LoadingOutlined } from "@ant-design/icons";
import { FetchStateEnum } from "../../../tools/Enum";

export default function Footer(props) {
  const { theme } = useAppState();
  const state = dbm.getState();
  return (
    <Fill
      style={{
        background: theme === "light" ? magenta[3] : dark.primary,
        color: theme === "light" ? light.background : dark.text,
        padding: "0 10px 0 10px",
      }}
    >
      <Row justify="end" gutter={[7, 0]}>
        <Col>{moment().format("HH:mm A")}</Col>
        <Col>
          <LoadingOutlined spin={state === FetchStateEnum.Fetching} />
        </Col>
        <Col span={2} style={{ textAlign: "right", textTransform: 'capitalize' }}>
          {state}
        </Col>
      </Row>
    </Fill>
  );
}
