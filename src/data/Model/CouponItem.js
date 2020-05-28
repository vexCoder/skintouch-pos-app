export default class CouponItem {
  constructor(data) {
    this.uid = data.uid;
    this.name = data.name;
    this.price = +data.price;
    this.quantity = +data.quantity;
    this.itemUID = data.itemUID;
    this.couponUID = data.couponUID;
    this.created = data.created;
    this.lastModified = data.lastModified;
  }

  couponObj = (coupon) => {
    return coupon.get(this.uid);
  };

  get totalPrice() {
    return this.price * this.quantity;
  }
}
