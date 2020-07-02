import firebaseService from "firebase";
var db = firebaseService.firestore;

export async function transact (payload, type, id) {
  const typeRef = db().collection(type);
  const inventory = db().collection("inventory");
  var key = "",
    keys = [],
    getCalls = [],
    count = {};
  try {
    // Start firebase transaction
    await db().runTransaction(async transaction => {
      const doc = await transaction.get(typeRef.doc(id));
      payload.items.forEach(element => {
        // create key as item name-HSU Code
        key = `${element.item.toLowerCase()}-${element.code.toLowerCase()}`;
        // push the Key into arraynamed as Keys if not exists
        if (!keys.includes(key)) {
          keys.push(key);
          // push all getter to promise type array
          getCalls.push(transaction.get(inventory.doc(key)));
        }
        // populate the count for each unique item based on key
        if (!!count[key]) {
          count[key] += parseFloat(element.qnty);
        } else {
          count[key] = parseFloat(element.qnty);
        }
      });
      var keyDatas = await Promise.all(getCalls)
      keyDatas.forEach(keyData => {
        var serverCount = keyData.exists
          ? parseFloat(keyData.data().count)
          : 0;
        console.log(serverCount, count[keyData.id], type, keyData.id)
        switch (type) {
          case "purchase":
            count[keyData.id] = serverCount + count[keyData.id];
            break;
          case "sales":
            count[keyData.id] = serverCount - count[keyData.id];
            break;
          default:
            break;
        }
        console.log(count[keyData.id])
        transaction.set(inventory.doc(keyData.id), {
          count: count[keyData.id]
        });
      });
      transaction.set(typeRef.doc(id), { ...payload });
      return doc;
    });
  } catch(e) {
    console.log('Transaction failed', e)
  }
}
