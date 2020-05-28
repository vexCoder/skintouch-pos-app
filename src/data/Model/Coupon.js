export default class Coupon {
  constructor(data) {
    this.uid = data.uid;
    this.code = data.code;
    this.type = +data.type;
    this.stock = +data.stock;
    this.discount = +data.discount;
    this.payment = +data.payment;
    this.items = data.items;
    this.created = data.created;
    this.lastModified = data.lastModified;
  }
}
