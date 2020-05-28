import React from "react";
import Page from "../../components/Page";
import { Formik } from "formik";
import { object, string } from "yup";
import Fill from "../../elements/Fill";
import { Row, Col, Space, Divider } from "antd";
import TextField from "../../elements/TextField";
import FormItem from "../../components/FormItem";
import Text from "../../elements/Text";
import Button from "../../elements/Button";
import { blue } from "@ant-design/colors";
import { useAppDispatch, useAppState } from "../../../data/Provider";
import { StateTypeEnum, ModalEnum } from "../../../tools/Enum";
import Flex from "../../elements/Flex";
import { AppstoreOutlined } from "@ant-design/icons";
import Empty from "../../elements/Empty";
import Table from "../../components/Table";
import Select from "../../elements/Select";

export default function CategoryForm(props) {
  const { hide, renderProps, edit, add, del } = props;
  const { initial, validation } = getFormData({ edit, add, del });
  const { category } = useAppState();
  const { addCategory, editCategory, deleteCategory } = useAppDispatch(
    StateTypeEnum.Product
  );

  if (!initial || !validation) {
    return <Empty />;
  }

  const handleAdd = async (values) => {
    addCategory({ ...values });
  };

  const handleEdit = async (values) => {
    editCategory({ ...values });
  };

  const handleDelete = async (values) => {
    deleteCategory(values);
  };

  const handleContinue = () => {
    hide();
    renderProps.onSubmit(true);
  };

  return (
    <Page padding="5px 15px 5px 15px">
      <Formik
        validateOnChange={false}
        validateOnMount={false}
        enableReinitialize
        initialValues={initial}
        validationSchema={validation}
        onSubmit={(values, actions) => {
          if (add) handleAdd(values).then(handleContinue);
          if (edit) handleEdit(values).then(handleContinue);
          if (del) handleDelete(values.uid).then(handleContinue);
        }}
      >
        {(props) => {
          const { setFieldValue, values, errors, submitForm } = props;
          return (
            <Fill>
              <Row>
                <Col span={24}>
                  {(edit || del) && (
                    <FormItem
                      label="Category"
                      tooltip="Select Category"
                      error={errors.uid}
                      placement="top"
                    >
                      <Select
                        data={Array.from(
                          category.entries(),
                          ([key, value]) => ({
                            label: value.name,
                            value: value.uid,
                          })
                        )}
                        onChange={(uid) => {
                          setFieldValue("uid", uid);
                          setFieldValue("name", category.get(uid).name);
                          setFieldValue(
                            "description",
                            category.get(uid).description
                          );
                        }}
                      />
                    </FormItem>
                  )}
                </Col>
                <Col span={24}>
                  {(add || edit) && (
                    <FormItem
                      label="Name"
                      tooltip="Name your category"
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
                  )}
                </Col>
                <Col span={24}>
                  {(add || edit) && (
                    <FormItem
                      label="Description"
                      tooltip="Describe why you created this category!"
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
                  )}
                </Col>
                <Col push={16} span={8}>
                  <Button
                    onClick={() => {
                      submitForm();
                    }}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Fill>
          );
        }}
      </Formik>
    </Page>
  );
}

const getFormData = ({ edit, add, del }) => {
  var initial, validation;
  if (edit) {
    initial = {
      uid: "",
      name: "",
      description: "",
    };
    validation = object().shape({
      uid: string().required("Category is required"),
      name: string()
        .max(15, "Too Long! Max 15 characters")
        .required("Name is required"),
      description: string()
        .max(50, "Too Long! Max 50 characters")
        .required("Description is required"),
    });
  }
  if (add) {
    initial = {
      name: "",
      description: "",
    };
    validation = object().shape({
      name: string()
        .max(15, "Too Long! Max 15 characters")
        .required("Name is required"),
      description: string()
        .max(50, "Too Long! Max 50 characters")
        .required("Description is required"),
    });
  }
  if (del) {
    initial = {
      uid: "",
    };
    validation = object().shape({
      uid: string().required("Category is required"),
    });
  }
  return { initial, validation };
};
