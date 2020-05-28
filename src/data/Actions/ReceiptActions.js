import dbm from "../DataManager";
import { v4 as uuid4 } from "uuid";
import { ServerTableEnum } from "../../tools/Enum";
import Receipt from "../Model/Receipt";
import { log } from "../../tools/Snippets";
import ReceiptItem from "../Model/ReceiptItem";

export default class ReceiptActions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  addReceipt = async (receipt, items) => {
    const newID = await dbm.generateUniqueID(ServerTableEnum.Supplier);
    const _receipt = new Receipt({
      uid: newID,
      ...receipt,
      items: items.map(
        (val, index) =>
          new ReceiptItem({
            uid: `${index}-${newID}`,
            ...val,
            receiptUID: newID,
          })
      ),
    });
    dbm.serverInsert(ServerTableEnum.Receipt, _receipt);
    dbm.localInsert(ServerTableEnum.Receipt, _receipt);
    this.dispatch({
      type: "PUNCH_RECEIPT",
      payload: _receipt,
    });
  };
}
