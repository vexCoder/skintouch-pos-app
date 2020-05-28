import React from "react";
import Fill from "../../elements/Fill";
import Card from "../../elements/Card";
import { Row, Col } from "antd";
import moment from "moment";
import { blue } from "@ant-design/colors";

export default function ReceiptCard(props) {
  const { data, active, onClick } = props;
  const { receipt, header } = data;
  const summary = !header
    ? [
        {
          label: `${moment(receipt.created).format("YYYY/MM/DD hh:mm A")}`,
          span: 14,
        },
        { label: `₱${receipt.payment.toFixed(2)}`, span: 6 },
        { label: `${receipt.items.length}`, span: 3 },
      ]
    : [
        { label: `${data.created}`, span: 14 },
        { label: `${data.payment}`, span: 6 },
        { label: `Items`, span: 3 },
      ];
  return (
    <Card
      style={{
        width: "100%",
        height: "auto",
        padding: "10px",
        border: active ? `1px solid ${blue[4]}` : "none",
        transition: "border 0.25s ease-out",
      }}
      onClick={() => {
        if (!header) {
          onClick(receipt.uid);
        }
      }}
    >
      <Row justify="space-between" style={{ width: "100%", height: "100%" }}>
        {summary.map((val) => (
          <Col span={val.span}>{val.label}</Col>
        ))}
      </Row>
    </Card>
  );
}
