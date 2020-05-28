import React from "react";
import Page from "../../components/Page";
import { Formik } from "formik";
import Fill from "../../elements/Fill";
import { Row, Col, Carousel, Space } from "antd";
import Card from "../../elements/Card";
import {
  LoadingOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Upload from "../../elements/Upload";
import Flex from "../../elements/Flex";
import TextField from "../../elements/TextField";
import FormItem from "../../components/FormItem";
import Text from "../../elements/Text";
import Button from "../../elements/Button";
import Select from "../../elements/Select";
import Divider from "../../elements/Divider";
import { object, string, number } from "yup";
import { useAppState, useAppDispatch } from "../../../data/Provider";
import { blue } from "@ant-design/colors";
import { StateTypeEnum, ModalEnum } from "../../../tools/Enum";

const { ipcRenderer } = window.require("electron");
const fs = window.require("fs");

export default function ProductForm(props) {
  const { add, edit, onSubmit, value } = props;
  const { addProduct, editProduct } = useAppDispatch(StateTypeEnum.Product);
  const { pushNotif } = useAppDispatch(StateTypeEnum.AppSetting);
  const { category, supplier } = useAppState();

  const [loading, setLoading] = React.useState(false);

  function onChange(a, b, c) {}

  const suppliers = Array.from(supplier.entries(), ([key, value]) => ({
    label: value.name,
    value: value.uid,
  }));
  const categories = Array.from(category.entries(), ([key, value]) => ({
    label: value.name,
    value: value.uid,
  }));

  let uid,
    imagePath,
    imgSrcString,
    initialValues = {
      name: "",
      description: "",
      originalPrice: "",
      sellingPrice: "",
      stock: "",
      supplier: "",
      category: "",
      image: "",
      path: "",
    };

  if (edit && value != null) {
    const path = ipcRenderer.sendSync("get-app-data-path");
    try {
      imagePath = `${path}/image/${value.image}`;
      const data = fs.readFileSync(imagePath);
      const base64Image = new Buffer(data, "binary").toString("base64");
      imgSrcString = `data:image/png;base64,${base64Image}`;
    } catch (error) {
      imgSrcString = `data:image/png;base64,${value.image}`;
    }
    uid = value.uid;
    initialValues = Object.assign(initialValues, {
      ...value,
      image: imgSrcString,
    });
  }

  return (
    <Page padding="10px">
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        validationSchema={object().shape({
          name: string()
            .max(75, "Max length is 75 characters")
            .required("Required"),
          description: string()
            .max(75, "Max length is 75 characters")
            .required("Required"),
          originalPrice: number()
            .min(1, "Must be greater than 0")
            .required("Required"),
          sellingPrice: number()
            .min(1, "Must be greater than 0")
            .required("Required"),
          stock: number().required("Required"),
        })}
        onSubmit={(values, actions) => {
          delete values.path;
          if (add) {
            addProduct(values);
            pushNotif(ModalEnum.Success());
          } else if (edit) {
            editProduct({ uid: uid, ...values });
            pushNotif(ModalEnum.Success());
          }
          onSubmit();
        }}
      >
        {(props) => {
          const { setFieldValue, values, errors, submitForm } = props;
          return (
            <Fill>
              <Flex
                direction="column"
                ySpan={[1, 1, 10, 1]}
                style={{ width: "100%" }}
              >
                <Row
                  style={{ height: "100%", overflow: "hidden" }}
                  gutter={[10, 10]}
                >
                  <Col sm={6} lg={5} xl={4}>
                    <FormItem
                      label="Select Image"
                      tooltip="Name your product!"
                      error={errors.image}
                      placement="top"
                    >
                      <Upload
                        value={values.path}
                        imageData={values.image}
                        style={{
                          width: "150px",
                          height: "150px",
                        }}
                        imageSize={150}
                        imageRealSize={100}
                        onChange={({ dataUrl, filePath }) => {
                          setFieldValue("image", dataUrl);
                          setFieldValue("path", filePath);
                        }}
                      />
                    </FormItem>
                  </Col>
                  <Col sm={9} lg={9} xl={10}>
                    <Row gutter={[0, 5]}>
                      <Col span={24}>
                        <Text size="h6">Basic Information</Text>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Name"
                          tooltip="Name your product!"
                          error={errors.name}
                          placement="top"
                        >
                          <TextField
                            value={values.name}
                            onChange={(e) => {
                              setFieldValue("name", e.target.value);
                            }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Description"
                          tooltip="Describe your product!"
                          error={errors.description}
                          placement="top"
                        >
                          <TextField
                            value={values.description}
                            onChange={(e) => {
                              setFieldValue("description", e.target.value);
                            }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Category"
                          tooltip="Select Category!"
                          error={errors.category}
                          placement="top"
                        >
                          <Select
                            value={values.category}
                            data={categories}
                            onChange={(uid) => {
                              setFieldValue("category", uid);
                            }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Supplier"
                          tooltip="Select Supplier!"
                          error={errors.supplier}
                          placement="top"
                        >
                          <Select
                            value={values.supplier}
                            data={suppliers}
                            onChange={(uid) => {
                              setFieldValue("supplier", uid);
                            }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={9} lg={10} xl={10}>
                    <Row gutter={[0, 5]}>
                      <Col span={24}>
                        <Text size="h6">Pricing</Text>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Original Price"
                          tooltip="Set the retail price of the product"
                          error={errors.originalPrice}
                          placement="top"
                        >
                          <TextField
                            value={values.originalPrice}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("originalPrice", e.target.value);
                            }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Selling Price"
                          tooltip="Set how much you charge for the product"
                          error={errors.sellingPrice}
                          placement="top"
                        >
                          <TextField
                            value={values.sellingPrice}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("sellingPrice", e.target.value);
                            }}
                          />
                        </FormItem>
                      </Col>
                      <Col span={24}>
                        <FormItem
                          label="Stock"
                          tooltip="How many stock you have?"
                          error={errors.stock}
                          placement="top"
                        >
                          <TextField
                            type="number"
                            value={values.stock}
                            onChange={(e) => {
                              setFieldValue("stock", e.target.value);
                            }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Flex
                  justify="flex-end"
                  align="flex-end"
                  style={{ width: "100%" }}
                  xSpan={["30%"]}
                  ySpan={["auto"]}
                >
                  <Button
                    onClick={() => {
                      submitForm();
                    }}
                    style={{ background: blue[5], color: "white" }}
                  >
                    Submit
                  </Button>
                </Flex>
              </Flex>
            </Fill>
          );
        }}
      </Formik>
    </Page>
  );
}
