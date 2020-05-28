export default class Receipt {
  constructor(data) {
    this.uid = data.uid;
    this.payment = +data.payment;
    this.subTotal = +data.subTotal;
    this.discount = +data.discount;
    this.tax = +data.tax;
    this.items = data.items;
    this.couponUID = data.couponUID;
    this.userUID = data.userUID;
    this.created = data.created;
    this.lastModified = data.lastModified;
  }

  get discountTotal() {
    return this.subTotal * this.discount;
  }

  get taxTotal() {
    return this.discountTotal * this.tax;
  }

  get netTotal() {
    return this.subTotal - this.discountTotal + this.taxTotal;
  }

  get change() {
    return this.payment - this.netTotal;
  }
  // getNetTotal() => {
  //   return
  // }
}
