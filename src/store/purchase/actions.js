import { transact } from "../../services/Transaction.js";
import firebaseService from "firebase";
import { getFormatDate } from "../../services/DateUtil";
var db = firebaseService.firestore;

export function add({ commit }, payload) {
  transact(
    payload,
    "purchase",
    `${getFormatDate(payload.date)}-${payload.invoice}`
  );
}

export function read({ commit }, page) {
  const type = "purchase";
  const typeRef = db().collection(type);
  typeRef.orderBy("date", "desc").onSnapshot(docs => {
    docs.forEach(doc => {
      var data = { ...doc.data() };
      data.id = doc.id;
      commit("addPurchase", data);
    });
  });
}
