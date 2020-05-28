import React from "react";
import Page from "../../components/Page";
import Fill from "../../elements/Fill";
import { Row, Col } from "antd";
import List from "../../components/List";
import Receipt from "./Receipt";
import ProductShopCard from "./ProductShopCard";
import FormItem from "../../components/FormItem";
import TextField from "../../elements/TextField";
import moment from "moment";
import useWindowDimensions from "../../../tools/Hooks";
import { BreakPointsEnum } from "../../../tools/Enum";
import _ from "lodash";
import { useAppState } from "../../../data/Provider";
import Flex from "../../elements/Flex";

export default function Transaction(props) {
  const {} = props;

  const { product, category, supplier, favorites } = useAppState();

  const [activeCoupon, setactiveCoupon] = React.useState(null);
  const [receiptItem, setreceiptItem] = React.useState([]);
  const [keyword, setkeyword] = React.useState("");
  const { height, width } = useWindowDimensions();

  const isFavorite = (uid) => {
    return _.findIndex(favorites, (val) => val === uid) >= 0;
  };

  let productData = Array.from(product.entries(), ([key, value]) => ({
    product: value,
    isFav: isFavorite(value.uid),
  }));

  productData = productData.sort(
    (a, b) =>
      moment(a.product.created).format("YYYYMMDD") -
      moment(b.product.created).format("YYYYMMDD")
  );

  productData = [
    ...productData.filter((val) => val.isFav),
    ...productData.filter((val) => !val.isFav),
  ];

  let filterProducts = function (arr) {
    let filtered_products = arr.filter(function (item) {
      item = item.product.name.toLowerCase();
      return item.indexOf(keyword) > -1;
    });

    return filtered_products;
  };

  productData = filterProducts(productData);

  let colSpan;
  if (width <= BreakPointsEnum.Sm) {
    colSpan = 6;
  } else if (width <= BreakPointsEnum.Md) {
    colSpan = 8;
  } else if (width <= BreakPointsEnum.Lg) {
    colSpan = 9;
  } else {
    colSpan = 11;
  }

  return (
    <Page padding="15px 0 5px 0">
      <Fill>
        <Row style={{ height: "100%" }}>
          <Col span={9} style={{ height: "100%", padding: "0 15px 0 15px" }}>
            <Flex direction="column" heightSpan={["70px", "calc(100% - 70px)"]}>
              <FormItem label="Filter Name" noError>
                <TextField
                  onChange={(e) => {
                    setkeyword(e.target.value.toLowerCase());
                  }}
                />
              </FormItem>
              <div
                style={{
                  height: "100%",
                  maxHeight: "calc(100vh - 107px)",
                  overflowY: "auto",
                }}
              >
                <List
                  spacing={2}
                  itemSpan={24}
                  colSpan={colSpan}
                  data={productData}
                  padding="0 0px 0 0px"
                  renderItem={(val) => {
                    return (
                      <ProductShopCard
                        activeCoupon={activeCoupon}
                        items={receiptItem}
                        setItems={setreceiptItem}
                        favorite={val.isFav}
                        data={val}
                        buttonList={["fav", "buy"]}
                      />
                    );
                  }}
                />
              </div>
            </Flex>
          </Col>
          <Col span={15}>
            <Receipt
              items={receiptItem}
              setItems={setreceiptItem}
              activeCoupon={activeCoupon}
              setactiveCoupon={setactiveCoupon}
            />
          </Col>
        </Row>
      </Fill>
    </Page>
  );
}
