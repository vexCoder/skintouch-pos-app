import React from "react";
import Page from "../../components/Page";
import { Row, Col, Space } from "antd";
import { green, red } from "@ant-design/colors";
import Button from "../../elements/Button";
import Center from "../../elements/Center";
import Text from "../../elements/Text";
import { CloseCircleFilled } from "@ant-design/icons";

export default function Fail(props) {
  const { hide, renderProps } = props;
  return (
    <Page padding="3% 0 0 0">
      <Row gutter={[0, 5]}>
        <Col span={24}>
          <Center style={{ paddingBottom: "10px" }}>
            <CloseCircleFilled style={{ color: red[5], fontSize: "64px" }} />
          </Center>
        </Col>
        <Col span={24}>
          <Center style={{ paddingBottom: "5px" }}>
            <Text style={{ color: red[5] }} size="medium">
              Failed
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
