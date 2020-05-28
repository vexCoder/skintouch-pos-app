import Product from "../../../data/Model/Product";
import { CouponTypeEnum } from "../../../tools/Enum";
import { encrypt } from "../../../tools/Snippets";

export function test(cb) {
  const testObj = {
    uid: "test",
    name: "test",
    description: "test",
  };

  console.log(testObj);

  cb(testObj);
}
