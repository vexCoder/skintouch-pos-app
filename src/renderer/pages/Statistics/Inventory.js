import React from "react";
import Fill from "../../elements/Fill";
import { useAppState } from "../../../data/Provider";
import { Chart } from "chart.js";
import { Row, Col, Space } from "antd";
import { fitToContainer } from "../../../tools/Snippets";
import List from "../../components/List";
import Card from "../../elements/Card";
import Text from "../../elements/Text";
import { PieChartOutlined, PieChartFilled } from "@ant-design/icons";
import Flex from "../../elements/Flex";

export default function Inventory() {
  const { receipt, product } = useAppState();

  const invData = Array.from(product.entries(), ([key, value]) => value).sort(
    (a, b) => b.stock - a.stock
  );

  const [size, setsize] = React.useState({ width: 0, height: 0 });

  const invLegend = invData.map((val) => val.name).slice(0, 5);
  const invStock = invData.map((val) => val.stock).slice(0, 5);
  const etcStock = invData
    .map((val) => val.stock)
    .slice(4, invData.length)
    .reduce((sum, val) => sum + val, 0);

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

    new Chart(itx, {
      type: "doughnut",
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
    fitToContainer(invRef.current);
  }, []);

  const invRef = React.useRef(null);
  const containerRef = React.useRef(null);
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
        <Space style={{ width: "100%", height: "100%" }}>
          <Text strong size="h6">
            <PieChartFilled />
          </Text>
          <Text strong size="h6">
            Inventory
          </Text>
        </Space>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col span={14} style={{ width: "100%", height: "100%" }}>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
              <canvas
                ref={invRef}
                style={{ width: size.width, height: size.height }}
              />
            </div>
          </Col>
          <Col span={10}>
            <Card style={{ height: "100%" }}>
              <List
                spacing={0}
                itemSpan={24}
                colSpan={6}
                data={data}
                renderItem={(val, index) => (
                  <Flex
                    style={{ height: "100%" }}
                    ySpan={[1, 8, 2]}
                    heightSpan={["100%"]}
                    align="center"
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "50%",
                        background: `hsl(${360 / (index + 1)},85%,69%)`,
                      }}
                    />
                    <Text>{invLegend[index] || "Etc."}</Text>
                    <Text>{val}</Text>
                  </Flex>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Flex>
    </Fill>
  );
}
