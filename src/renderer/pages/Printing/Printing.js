import React from "react";
import Table from "../../components/Table";
import Flex from "../../elements/Flex";
import Text from "../../elements/Text";

const { ipcRenderer } = window.require("electron");

const columns = [
  {
    title: "Item",
    key: "item",
    style: {
      width: "50%",
      textAlign: "left",
    },
  },
  {
    title: "Quantity",
    key: "quantity",
    style: {
      width: "25%",
      textAlign: "right",
    },
  },
  {
    title: "Total",
    key: "total",
    style: {
      width: "25%",
      textAlign: "right",
    },
  },
];

export default function Printing() {
  const [data, setdata] = React.useState({
    items: [],
    subTotal: 0,
    discount: 0,
    discountPrice: 0,
    tax: 0,
    taxedPrice: 0,
    netTotal: 0,
    change: 0,
    payment: 0,
  });
  ipcRenderer.on("toPrintWindow", (event, printData) => {
    setdata(printData);
  });
  const tableData = data.items.map((val, index) => ({
    key: index,
    ...val,
  }));

  const summaryData = [
    {
      label: "Payment",
      value: `₱${data.payment.toFixed(2)}`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
    {
      label: "Sub-Total",
      value: `₱${data.subTotal.toFixed(2)}`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
    {
      label: "Discount",
      value: `₱${data.discountPrice.toFixed(2)}(${data.discount * 100}%)`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
    {
      label: "Tax",
      value: `₱${data.taxedPrice.toFixed(2)}(${data.tax * 100}%)`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
    {
      label: "Net Total",
      value: `₱${data.netTotal.toFixed(2)}`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
    {
      label: "Change",
      value: `₱${data.change.toFixed(2)}`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
    {
      label: "Cashier",
      value: `${data.user || "n/a"}`,
      labelSpan: 2,
      style: { textAlign: "right" },
    },
  ];

  return (
    <div>
      <Flex
        direction="column"
        align="center"
        justify="center"
        style={{ width: "100%" }}
        xSpan={["auto", "auto"]}
      >
        <div
          style={{
            fontSize: "1.5em",
            lineHeight: "1.25em",
            fontWeight: "bold",
          }}
        >
          Skintouch
        </div>
        <div>Thank you for your patronage!</div>
      </Flex>
      <Table data={tableData} columns={columns} summary={summaryData} />
    </div>
  );
}
