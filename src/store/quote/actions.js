import {transact} from "../../services/Transaction.js"
import {getFormatDate, getUniqueKeyFromDate} from "../../services/DateUtil"
import firebaseService from "../../services/firebase";
var db = firebaseService.firestore;

export function add({ commit }, payload) {
  transact(payload, "quotes", `${getFormatDate(payload.date)}-${getUniqueKeyFromDate()}`)
}

export function read({ commit }, page) {
  const type="quotes"
  const typeRef = db().collection(type);
  typeRef.orderBy("date", "desc")
    .onSnapshot((docs) => {
      docs.forEach((doc) => {
        var data = {...doc.data()}
        data.id = doc.id
        commit('addQuotes', data)
      })
    })
}