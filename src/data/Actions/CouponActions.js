import dbm from "../DataManager";
import { v4 as uuid4 } from "uuid";
import { ServerTableEnum, CouponTypeEnum } from "../../tools/Enum";
import { log } from "../../tools/Snippets";
import Coupon from "../Model/Coupon";
import CouponItem from "../Model/CouponItem";

export default class CouponActions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  addCoupon = async (coupon, items = []) => {
    const newID = await dbm.generateUniqueID(ServerTableEnum.Supplier);
    const _coupon = new Coupon({
      uid: newID,
      ...coupon,
      items: items.map(
        (val, index) =>
          new CouponItem({
            uid: `${index}-${newID}`,
            ...val,
            couponUID: newID,
          })
      ),
    });
    dbm.serverInsert(ServerTableEnum.Coupon, _coupon);
    dbm.localInsert(ServerTableEnum.Coupon, _coupon);
    this.dispatch({
      type: "ADD_COUPON",
      payload: _coupon,
    });
  };

  editCoupon = (coupon, items = []) => {
    const _coupon = new Coupon({
      ...coupon,
      items: items.map(
        (val, index) =>
          new CouponItem({
            uid: `${index}-${coupon.uid}`,
            ...val,
            couponUID: coupon.uid,
          })
      ),
    });
    dbm.serverUpdate(ServerTableEnum.Coupon, _coupon, _coupon.uid);
    dbm.localUpdate(ServerTableEnum.Coupon, _coupon, _coupon.uid);
    this.dispatch({
      type: "EDIT_COUPON",
      payload: _coupon,
    });
  };

  deleteCoupon = (uid) => {
    dbm.serverDelete(ServerTableEnum.Coupon, uid);
    dbm.localDelete(ServerTableEnum.Coupon, uid);
    this.dispatch({
      type: "DELETE_COUPON",
      payload: { uid },
    });
  };

  updateStock = (value, quantity) => {
    const coupon = new Coupon({ ...value });
    const newStock = coupon.stock + quantity;

    dbm.localUpdate(
      ServerTableEnum.Coupon,
      { ...coupon, stock: newStock },
      coupon.uid
    );
    dbm.serverUpdate(ServerTableEnum.Coupon, { stock: newStock }, coupon.uid);
    this.dispatch({
      type: "EDIT_COUPON",
      payload: { stock: newStock, uid: coupon.uid },
    });
  };
}
