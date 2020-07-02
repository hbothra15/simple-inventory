import firebaseService from "../../services/firebase";
var db = firebaseService.firestore;

export function read({ commit }, page) {
  const type = "quotes";
  const typeRef = db().collection(type);
  typeRef.onSnapshot(docs => {
    docs.forEach(doc => {
      var data = { ...doc.data() };
      data.id = doc.id;
      commit("addInventory", data);
    });
  });
}
