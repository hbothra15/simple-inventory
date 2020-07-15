import firebaseService from "firebase";
var db = firebaseService.firestore;
const type = "inventory";

export function read({ commit }) {
  const typeRef = db().collection(type);
  commit("loading", true);
  typeRef.onSnapshot(docs => {
    console.log('Update Inventory')
    commit("cleanup");
    docs.forEach(doc => {
      var data = { ...doc.data() };
      data.id = doc.id;
      commit("addEntry", data);
    });
    commit("loading", false);
  });
}
