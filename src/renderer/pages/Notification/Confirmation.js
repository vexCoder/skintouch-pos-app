import React from "react";
import Page from "../../components/Page";
import { Row, Col, Space } from "antd";
import { green } from "@ant-design/colors";
import Button from "../../elements/Button";
import Center from "../../elements/Center";
import Text from "../../elements/Text";
import { CheckCircleFilled } from "@ant-design/icons";

export default function Confirmation(props) {
  const { hide, renderProps } = props;
  return (
    <Page padding="3%">
      <Row gutter={[5, 5]}>
        <Col span={24}>
          <Text size="h5">{renderProps.title ?? "Confirm"}</Text>
        </Col>
        <Col span={24} style={{ paddingBottom: "15px" }}>
          <Text>
            {renderProps.body ??
              "Are you sure you want to continue the action? This action is irreversible."}
          </Text>
        </Col>
        <Col push={7} span={5}>
          <Button
            onClick={() => {
              hide();
              renderProps.onCancel();
            }}
          >
            Cancel
          </Button>
        </Col>
        <Col push={7} span={5}>
          <Button
            onClick={() => {
              hide();
              renderProps.onOk();
            }}
          >
            Agree
          </Button>
        </Col>
      </Row>
    </Page>
  );
}
