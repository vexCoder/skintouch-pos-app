import React from "react";
import Page from "../../components/Page";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import {
  StateTypeEnum,
  BreakPointsEnum,
  ModalEnum,
  AnimationEnum,
} from "../../../tools/Enum";
import List from "../../components/List";
import Card from "../../elements/Card";
import { Row, Col, Space, Tooltip } from "antd";
import Text from "../../elements/Text";
import useWindowDimensions from "../../../tools/Hooks";
import Flex from "../../elements/Flex";
import TextField from "../../elements/TextField";
import FormItem from "../../components/FormItem";
import Select from "../../elements/Select";
import Button from "../../elements/Button";
import Icon, {
  PlusCircleOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import shippingAndDelivery from "../../../icons/shipping-and-delivery";
import { light, dark } from "../../../base/theme";
import Dropdown from "../../elements/Dropdown";
import Animate from "../../components/Animate";
import Divider from "../../elements/Divider";
import { red } from "@ant-design/colors";
import _ from "lodash";
import moment from "moment";
import CouponCard from "./CouponCard";

export default function Coupon() {
  const { coupon, theme } = useAppState();
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);

  const { height, width } = useWindowDimensions();

  const [showDrawer, setshowDrawer] = React.useState(false);
  const [showList, setshowList] = React.useState(true);
  const [editValue, seteditValue] = React.useState(null);
  const [keyword, setkeyword] = React.useState("");

  let xSpan, colSpan, btnShrink;
  if (width <= BreakPointsEnum.Sm) {
    xSpan = 8;
    colSpan = 1;
    btnShrink = true;
  } else if (width <= BreakPointsEnum.Md) {
    xSpan = 12;
    colSpan = 2;
    btnShrink = true;
  } else if (width <= BreakPointsEnum.Lg) {
    xSpan = 8;
    colSpan = 3;
    btnShrink = false;
  } else if (width <= BreakPointsEnum.Xl) {
    xSpan = 8;
    colSpan = 3;
    btnShrink = false;
  } else {
    xSpan = 6;
    colSpan = 4;
    btnShrink = false;
  }

  let couponData = Array.from(coupon.entries(), ([key, value]) => value);

  couponData = couponData.sort(
    (a, b) =>
      moment(a.created).format("YYYYMMDD") -
      moment(b.created).format("YYYYMMDD")
  );

  let filterCoupons = function (arr) {
    let filtered_coupons = arr.filter(function (item) {
      item = item.code.toLowerCase();
      return item.indexOf(keyword) > -1;
    });

    return filtered_coupons;
  };

  couponData = filterCoupons(couponData);

  return (
    <>
      <Page padding="5px 0 25px 0">
        <Flex direction="column" ySpan={[1, 10]}>
          <Col span={24}>
            <Row
              gutter={[5, 0]}
              align={"bottom"}
              justify="space-between"
              style={{ marginTop: "10px", padding: "0 15px 0 15px" }}
            >
              <Col span={10}>
                <Animate
                  transition={AnimationEnum.FadeSlideIn}
                  condition={showList}
                  duration={250}
                >
                  <FormItem label="Filter Name" noError>
                    <TextField
                      onChange={(e) => {
                        setkeyword(e.target.value.toLowerCase());
                      }}
                    />
                  </FormItem>
                </Animate>
                <Animate
                  transition={AnimationEnum.FadeSlideIn}
                  condition={!showList}
                  duration={250}
                >
                  <Space>
                    <Text style={{ fontSize: "1.5em" }}>
                      <FileTextOutlined style={{ fontSize: "inherit" }} />
                    </Text>
                    <Text size="h5">Coupon Information</Text>
                  </Space>
                </Animate>
              </Col>
              <Col span="auto">
                <Animate
                  transition={AnimationEnum.FadeSlideIn}
                  condition={showList}
                  duration={250}
                  style={{ zIndex: 999, marginBottom: "8px" }}
                >
                  <Button
                    onClick={() => {
                      pushNotif(ModalEnum.CouponForm({ add: true }));
                    }}
                  >
                    <Space align="center" style={{ height: "auto" }}>
                      <Text
                        style={{
                          lineHeight: 1,
                          color:
                            theme === "light" ? light.textSecondary : dark.text,
                        }}
                      >
                        <PlusCircleOutlined />
                      </Text>
                      <Text
                        style={{
                          lineHeight: 1,
                        }}
                      >
                        Add Coupon
                      </Text>
                    </Space>
                  </Button>
                </Animate>
              </Col>
              <Col
                span={24}
                style={{
                  maxHeight: "2px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Divider
                  style={{
                    height: "1px",
                    width: "100%",
                    background: "transparent",
                  }}
                />
              </Col>
            </Row>
          </Col>
          <div style={{ height: "100%" }}>
            <Animate
              transition={AnimationEnum.FadeSlideIn}
              condition={showList}
              duration={250}
              style={{ height: "100%" }}
            >
              <List
                spacing={2}
                itemSpan={xSpan}
                colSpan={colSpan}
                data={couponData}
                padding="0 15px 0 15px"
                renderItem={(val) => {
                  return <CouponCard data={val} />;
                }}
              />
            </Animate>
            <Animate
              transition={AnimationEnum.FadeSlideIn}
              condition={!showList}
              duration={250}
            >
              {!showList && <div>wtf</div>}
            </Animate>
          </div>
        </Flex>
      </Page>
    </>
  );
}
