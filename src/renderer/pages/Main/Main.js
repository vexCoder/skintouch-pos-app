import { grey } from "@ant-design/colors";
import { SettingFilled } from "@ant-design/icons";
import { Col, DatePicker, Row } from "antd";
import React from "react";
import { useAppDispatch, useAppState } from "../../../data/Provider";
import { StateTypeEnum, ModalEnum } from "../../../tools/Enum";
import Page from "../../components/Page";
import Button from "../../elements/Button";
import RadioGroup from "../../elements/RadioGroup";
import Select from "../../elements/Select";
import TextField from "../../elements/TextField";
import FormItem from "../../components/FormItem";
import { test } from "./test";
import dbm from "../../../data/DataManager";
import ProductForm from "../Product/ProductForm";

export default function Main() {
  const { theme, receipt } = useAppState();
  const state = useAppState();
  const { switchTheme } = useAppDispatch(StateTypeEnum.Theme);
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { addCategory } = useAppDispatch(StateTypeEnum.Product);
  const [selected, setselected] = React.useState(false);
  const [show, setshow] = React.useState(false);
  const [error, setError] = React.useState("Error: No username given");

  React.useEffect(() => {
    setshow(true);
  }, [theme]);

  return (
    <>
      <Page background={theme === "light" ? "white" : grey[7]}>
        <Row align="middle" gutter={[6, 6]}>
          <Col span={6}>
            <Button
              onClick={() => {
                test(addCategory);
              }}
            >
              TEST
            </Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => {
                switchTheme();
              }}
            >
              {theme}
            </Button>
          </Col>
          <Col span={6}>
            <Button>YAY</Button>
          </Col>
          <Col span={12}>
            <Select
              mode="multiple"
              showSearch
              data={["wtf", "jeongyeon", "ivan"].map((val) => ({
                label: val,
                value: val,
              }))}
            />
          </Col>
          <Col span={12}>
            <TextField addonAfter={<SettingFilled />} />
          </Col>
          <Col span={12}>
            <TextField />
          </Col>
          <Col span={12}>
            <TextField prefix="￥" />
          </Col>
          <Col span={12}>
            <RadioGroup
              selected={selected}
              onChange={(e) => {
                setselected(e);
              }}
              data={["a", "b", "c", "d"]}
            />
          </Col>
          <Col span={12}>
            <FormItem label="Username" error={error}>
              <TextField />
            </FormItem>
          </Col>
          <Col span={12}>
            <Button
              onClick={() => {
                if (error) setError(null);
                if (!error) setError("Error: username");
              }}
            >
              YAY
            </Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => {
                pushNotif(
                  ModalEnum.CategoryForm({
                    onSubmit: (bool) => {
                      if (bool) {
                        pushNotif(ModalEnum.Success());
                      }
                    },
                  })
                );
              }}
            >
              Category
            </Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => {
                pushNotif(
                  ModalEnum.SupplierForm({
                    onSubmit: (bool) => {
                      if (bool) {
                        pushNotif(ModalEnum.Success());
                      }
                    },
                  })
                );
              }}
            >
              Supplier
            </Button>
          </Col>

          <Col span={6}>
            <Button
              onClick={() => {
                dbm.truncateDelete("coupon");
              }}
            >
              DELETE ALL
            </Button>
          </Col>
        </Row>
      </Page>
    </>
  );
}
