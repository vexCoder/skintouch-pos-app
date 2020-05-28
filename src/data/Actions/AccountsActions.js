import dbm from "../DataManager";
import { v4 as uuid4 } from "uuid";
import { ServerTableEnum, CouponTypeEnum } from "../../tools/Enum";
import { log } from "../../tools/Snippets";
import Accounts from "../Model/Accounts";

export default class AccountsActions {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  addAccount = async (value, cb) => {
    let id = await dbm.generateUniqueID(ServerTableEnum.Accounts);
    const account = new Accounts({
      ...value,
      uid: id,
    });
    const accounts = await dbm.getDatabyKey("accounts");
    const match = accounts.findIndex((v) => v.username === account.username);
    if (match > 0) {
      cb({ state: false, message: "User already exist" });
      return;
    }

    dbm.serverInsert(ServerTableEnum.Accounts, account).then((res) => {
      console.log(res);
      if (res.status !== 201) {
        cb({ state: true, message: "Offline Registration Successful" });
      } else {
        cb({ state: true, message: "Online Registration Successful" });
      }
    });
    dbm.localInsert(ServerTableEnum.Accounts, account);
  };

  editAccount = (value) => {
    dbm.serverUpdate(ServerTableEnum.Accounts, value, value.uid);
    dbm.localUpdate(ServerTableEnum.Accounts, value, value.uid);
    this.dispatch({
      type: "EDIT_ACCOUNT",
      payload: value,
    });
  };

  deleteAccount = (uid) => {
    dbm.serverDelete(ServerTableEnum.Accounts, uid);
    dbm.localDelete(ServerTableEnum.Accounts, uid);
    this.dispatch({
      type: "DELETE_ACCOUNT",
      payload: { uid },
    });
  };
}
