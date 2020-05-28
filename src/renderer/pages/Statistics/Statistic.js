import React from "react";
import Page from "../../components/Page";
import { Row, Col } from "antd";
import Card from "../../elements/Card";
import { useAppState } from "../../../data/Provider";
import { Chart } from "chart.js";
import Inventory from "./Inventory";
import Flex from "../../elements/Flex";
import Income from "./Income";
import Count from "./Count";

export default function Statistic() {
  const { receipt } = useAppState();
  return (
    <Page padding="8% 25px 15% 25px">
      <Row style={{ width: "100%", height: "100%" }} gutter={[12, 0]}>
        <Col span={14}>
          <Card style={{ width: "100%", height: "100%" }}>
            <Flex
              direction="column"
              style={{ height: "100%", width: "100%" }}
              ySpan={[1, 1]}
              heightSpan={["50%", "50%"]}
            >
              <Inventory />
              <Income receipt={receipt} />
            </Flex>
          </Card>
        </Col>
        <Col span={10}>
          <Card style={{ width: "100%", height: "100%" }}>
            <Count />
          </Card>
        </Col>
      </Row>
    </Page>
  );
}
