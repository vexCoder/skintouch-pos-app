import React from "react";
import Fill from "../../elements/Fill";
import { useAppState } from "../../../data/Provider";
import { Chart } from "chart.js";
import { Row, Col, Space } from "antd";
import { fitToContainer } from "../../../tools/Snippets";
import List from "../../components/List";
import Card from "../../elements/Card";
import Text from "../../elements/Text";
import {
  PieChartOutlined,
  PieChartFilled,
  BarChartOutlined,
} from "@ant-design/icons";
import Flex from "../../elements/Flex";
import Select from "../../elements/Select";
import moment from "moment";

export default function Income(props) {
  const { receipt } = props;

  const [days, setdays] = React.useState(1);

  const map = new Map();
  var items = Array.from(
    receipt.entries(),
    ([key, value]) => value.items
  ).reduce((prev, val) => [...prev, ...val], []);

  const endDate = moment();
  const startDate = moment().subtract(days, "days");

  items = items.filter((val) => {
    return moment(val.created).isBetween(startDate, endDate, "date", "[]");
  });

  items.forEach((el) => {
    const prev = map.get(el.itemUID);
    if (prev) {
      map.set(el.itemUID, { ...prev, total: prev.total + el.totalPrice });
    } else {
      map.set(el.itemUID, { name: el.name, total: el.totalPrice });
    }
  });

  const invData = Array.from(map.entries(), ([key, value]) => value).sort(
    (a, b) => b.total - a.total
  );

  const [size, setsize] = React.useState({ width: 0, height: 0 });

  const invLegend = invData.map((val) => val.name).slice(0, 5);
  const invStock = invData.map((val) => val.total).slice(0, 5);
  const etcStock = invData
    .map((val) => val.total)
    .slice(4, invData.length)
    .reduce((sum, val) => sum + val, 0);

  var chart;
  const data = invStock.length >= 5 ? [...invStock, etcStock] : invStock;
  const labels = invLegend.length >= 5 ? [...invLegend, "Etc."] : invLegend;
    
  React.useEffect(() => {
    const resizeObs = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setsize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObs.observe(containerRef.current);

    const itx = invRef.current.getContext("2d");
    if (window.chart) {
      window.chart.destroy();
    }

    window.chart = new Chart(itx, {
      type: "bar",
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: data.map(
              (val, index) => `hsl(${360 / (index + 1)},85%,69%)`
            ),
            hoverBackgroundColor: data.map(
              (val, index) => `hsl(${360 / (index + 1)},85%,69%)`
            ),
          },
        ],
        labels: labels,
      },
      options: {
        legend: {
          display: false,
        },
        cutoutPercentage: 80,
      },
    });
    if (window.chart) {
      return;
    } else {
      fitToContainer(invRef.current);
    }
  }, [receipt, days]);

  const invRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const selectDays = [1, 7, 30].map((val) => ({
    label: `${val} days`,
    value: val,
  }));

  return (
    <Fill
      style={{
        position: "relative",
        padding: "calc(2% + 5px)",
        height: "100%",
        width: "100%",
      }}
    >
      <Flex
        direction="column"
        heightSpan={["20%", "80%"]}
        style={{ width: "100%", height: "100%" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space style={{ width: "100%", height: "100%" }}>
            <Text strong size="h6">
              <BarChartOutlined />
            </Text>
            <Text strong size="h6">
              Net Sales
            </Text>
          </Space>
          <Select
            value={days}
            data={selectDays}
            onChange={(val) => {
              setdays(val);
            }}
          />
        </div>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
          <canvas
            ref={invRef}
            style={{ width: size.width, height: size.height, zIndex: 99 }}
          />
        </div>
      </Flex>
    </Fill>
  );
}
