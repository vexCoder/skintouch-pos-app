import React from "react";
import Text from "../elements/Text";
import Fill from "../elements/Fill";
import { Row, Col, Tooltip, Space } from "antd";
import PropTypes from "prop-types";
import { AnimationEnum } from "../../tools/Enum";
import Animate from "./Animate";
import { WarningFilled, WarningOutlined } from "@ant-design/icons";
import _ from "lodash";

export default function FormItem(props) {
  const {
    label,
    children,
    error,
    tooltip,
    placement,
    labelSize,
    noError,
    themeLocal,
  } = props;

  const presetSize = {
    small: 14,
    medium: 20,
    large: 28,
  };

  const [errorRef, setErrorRef] = React.useState("");

  React.useEffect(() => {
    if (error != null) setErrorRef(error);
    return () => {};
  }, [error]);

  return (
    <Fill>
      <Row align="middle" gutter={[0, 4]}>
        <Col span={24}>
          <Text themeLocal={themeLocal}>{label + ":"}</Text>
        </Col>
        <Col span={24}>
          <Tooltip title={tooltip} placement={placement}>
            {React.cloneElement(children, { error: error })}
          </Tooltip>
        </Col>
        <Col span={18}>
          {!noError && (
            <Space>
              <Animate
                transition={AnimationEnum.FadeSlideIn}
                condition={error != null}
                duration={150}
              >
                <Row align="middle" gutter={[5, 0]}>
                  <Col>
                    <Text variant="error" themeLocal={themeLocal}>
                      <WarningFilled style={{ fontSize: "16px" }} />
                    </Text>
                  </Col>
                  <Col>
                    <Text variant="error" themeLocal={themeLocal}>
                      {errorRef}
                    </Text>
                  </Col>
                </Row>
              </Animate>
            </Space>
          )}
        </Col>
      </Row>
    </Fill>
  );
}

FormItem.propTypes = {
  tooltip: PropTypes.string,
  placement: PropTypes.string,
  labelSize: PropTypes.string,
  validation: PropTypes.array,
};

FormItem.defaultProps = {
  tooltip: "",
  placement: "right",
  labelSize: "small",
  validation: [],
};
