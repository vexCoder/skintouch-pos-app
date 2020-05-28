export default class Product {
  constructor(data) {
    this.uid = data.uid;
    this.name = data.name;
    this.description = data.description;
    this.image = data.image;
    this.originalPrice = +data.originalPrice;
    this.sellingPrice = +data.sellingPrice;
    this.stock = +data.stock;
    this.supplier = data.supplier;
    this.category = data.category;
    this.created = data.created;
    this.lastModified = data.lastModified;
  }

  supplierObj = (supplier) => {
    return supplier.get(this.uid);
  };

  categoryObj = (category) => {
    return category.get(this.uid);
  };

  get diffPrice() {
    return this.sellingPrice - this.originalPrice;
  }
}
