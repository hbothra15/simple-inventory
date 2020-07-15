import { transact, updateTransact } from "../../services/Transaction.js";
import firebaseService from "firebase";
import { getFormatDate } from "../../services/DateUtil";
var db = firebaseService.firestore;
const type = "purchase";
const regExpression = /\W/g;

export function add({ commit }, payload) {
  transact(payload, type, `${getFormatDate(payload.date)}-${payload.invoice.replace(regExpression, '')}`);
}

export function update({ commit }, payload) {
  commit("loading", true);
  updateTransact(payload, type, payload.id);
  commit("loading", false);
}

export function read({ commit }) {
  const typeRef = db().collection(type);
  typeRef.orderBy("date", "desc").onSnapshot(docs => {
    commit("cleanup");
    docs.forEach(doc => {
      var data = { ...doc.data() };
      data.id = doc.id;
      commit("addEntry", data);
    });
    commit("loading", false);
  });
}
