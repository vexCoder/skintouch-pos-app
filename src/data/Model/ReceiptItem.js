export default class ReceiptItem {
  constructor(data) {
    this.uid = data.uid;
    this.name = data.name;
    this.price = +data.price;
    this.quantity = +data.quantity;
    this.isCoupon = data.isCoupon;
    this.itemUID = data.itemUID;
    this.receiptUID = data.receiptUID;
    this.created = data.created;
    this.lastModified = data.lastModified;
  }

  receiptObj = (receipt) => {
    return receipt.get(this.uid);
  };

  get totalPrice() {
    return this.price * this.quantity;
  }
}
