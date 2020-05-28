import React from "react";
import Page from "../../components/Page";
import { Row, Col, Space } from "antd";
import { green } from "@ant-design/colors";
import Button from "../../elements/Button";
import Center from "../../elements/Center";
import Text from "../../elements/Text";
import { CheckCircleFilled } from "@ant-design/icons";

export default function Success(props) {
  const { hide, renderProps } = props;
  return (
    <Page padding="3%">
      <Row gutter={[0, 5]}>
        <Col span={24}>
          <Center style={{ paddingBottom: "10px" }}>
            <CheckCircleFilled style={{ color: green[4], fontSize: "64px" }} />
          </Center>
        </Col>
        <Col span={24}>
          <Center style={{ paddingBottom: "5px" }}>
            <Text style={{ color: green[4] }} size="medium">
              Success
            </Text>
          </Center>
        </Col>
        <Col span={24}>
          <Center style={{ paddingBottom: "15px" }}>
            <Text size="small">{renderProps.message}</Text>
          </Center>
        </Col>
        <Col push={7} span={10}>
          <Button
            onClick={() => {
              hide();
            }}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </Page>
  );
}
