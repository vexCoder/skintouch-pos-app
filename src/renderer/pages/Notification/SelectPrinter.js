import React from "react";
import Fill from "../../elements/Fill";
import { Row, Col } from "antd";
import Select from "../../elements/Select";
import Button from "../../elements/Button";
import Text from "../../elements/Text";

const { ipcRenderer } = window.require("electron");

export default function SelectPrinter(props) {
  const { hide, renderProps } = props;

  const printers = ipcRenderer.sendSync("get-printer");

  const [printer, setprinter] = React.useState(printers[0].name);
  return (
    <Fill>
      <Row gutter={[5, 5]}>
        <Col span={24}>
          <Text size="h5">{renderProps.title ?? "Select Printer"}</Text>
        </Col>
        <Col span={24}>
          <Select
            value={printer}
            data={printers.map((val) => ({ label: val.name, value: val.name }))}
            onChange={(p) => {
              setprinter(p);
            }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            style={{ width: "25%" }}
            onClick={(e) => {
              e.target.blur();
              hide();
              renderProps.onSubmit(printer);
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Fill>
  );
}
