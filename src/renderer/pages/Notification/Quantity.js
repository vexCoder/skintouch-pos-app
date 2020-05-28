import React from "react";
import Page from "../../components/Page";
import TextField from "../../elements/TextField";
import Button from "../../elements/Button";
import Mousetrap from "mousetrap";
import Text from "../../elements/Text";
import { Space, Row, Col } from "antd";
import Flex from "../../elements/Flex";
import { useAppState } from "../../../data/Provider";
import { light, dark } from "../../../base/theme";

export default function Quantity(props) {
  const { hide, renderProps } = props;
  const { onOk, value = 0, label = "Quantity", max = null } = renderProps;
  const { theme } = useAppState();
  const [quantity, setquantity] = React.useState(value);

  const buttons = [
    7,
    8,
    9,
    4,
    5,
    6,
    1,
    2,
    3,
    "Backspace",
    0,
    !renderProps.negative ? "Clear" : "+/-",
  ];

  const handleNumberClick = (e) => {
    let qty = +`${quantity}${e}`;
    if (max && qty > max) qty = max;
    setquantity(+qty);
  };

  buttons.forEach((e) => {
    if (e >= 0) {
      Mousetrap.bind(e.toString(), () => {
        handleNumberClick(e);
      });
    }
  });

  Mousetrap.bind("-", () => {
    setquantity(quantity * -1);
  });

  Mousetrap.bind("esc", () => {
    setquantity(0);
  });

  Mousetrap.bind("backspace", () => {
    setquantity(parseInt(quantity / 10));
  });

  Mousetrap.bind("enter", () => {
    hide();
    onOk(quantity);
  });

  React.useEffect(() => {
    return () => {
      Mousetrap.reset();
    };
  }, []);

  return (
    <Page>
      <Flex direction="column" align="center" ySpan={[1, 3, 1]} spacing={4}>
        <Text size="h5">{`${label}`}</Text>
        <div
          style={{
            border: `1px solid ${theme === "light" ? light.text : dark.text}`,
            padding: "10px",
          }}
        >
          <Text size="h5">{`${quantity}`}</Text>
        </div>
        <Row>
          {buttons.map((val) =>
            val >= 0 ? (
              <Col span={8}>
                <Button
                  onClick={() => {
                    handleNumberClick(val);
                  }}
                >
                  {val}
                </Button>
              </Col>
            ) : (
              <Col
                span={8}
                onClick={() => {
                  if (val === "+/-") setquantity(quantity * -1);
                  if (val === "Clear") setquantity(0);
                  if (val === "Backspace") {
                    setquantity(parseInt(quantity / 10));
                  }
                }}
              >
                <Button>{val}</Button>
              </Col>
            )
          )}
        </Row>
        <Button
          onClick={() => {
            hide();
            renderProps.onOk(quantity);
          }}
        >
          Submit
        </Button>
      </Flex>
    </Page>
  );
}
