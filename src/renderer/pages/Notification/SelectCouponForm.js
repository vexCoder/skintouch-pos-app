import React from "react";
import Fill from "../../elements/Fill";
import { Row, Col } from "antd";
import Select from "../../elements/Select";
import { useAppState } from "../../../data/Provider";
import { StateTypeEnum } from "../../../tools/Enum";
import Button from "../../elements/Button";
import Text from "../../elements/Text";

export default function SelectCouponForm(props) {
  const { hide, renderProps } = props;
  const { coupon } = useAppState();

  const [selected, setselected] = React.useState(null);

  const couponList = Array.from(coupon.entries(), ([key, value]) => ({
    label: `${value.code}`,
    value: value.uid,
  }));
  return (
    <Fill>
      <Row gutter={[5, 5]}>
        <Col span={24}>
          <Text size="h5">{renderProps.title ?? "Select Coupon"}</Text>
        </Col>
        <Col span={24}>
          <Select
            data={couponList}
            onChange={(uid) => {
              setselected(uid);
            }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            style={{ width: "25%" }}
            onClick={(e) => {
              e.target.blur();
              hide();
              renderProps.onSubmit(coupon.get(selected));
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Fill>
  );
}
