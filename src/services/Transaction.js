import firebaseService from "firebase";
import { getItemKey } from "./DateUtil";
var db = firebaseService.firestore;
const inventoryTrnx = ["sales", "purchase"];

export async function transact(payload, type, id) {
  const typeRef = db().collection(type);
  const inventory = db().collection("inventory");
  var key = "",
    keys = [],
    itemCollection = {},
    getCalls = [],
    count = {};
  try {
    // Start firebase transaction
    await db().runTransaction(async transaction => {
      const doc = await transaction.get(typeRef.doc(id));
      if (inventoryTrnx.includes(type)) {
        payload.items.forEach(element => {
          // create key as item name-HSU Code
          key = getItemKey(element);
          // push the Key into arraynamed as Keys if not exists
          if (!keys.includes(key)) {
            keys.push(key);
            itemCollection[key] = element;
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
        var keyDatas = await Promise.all(getCalls);
        keyDatas.forEach(keyData => {
          var serverCount = keyData.exists
            ? parseFloat(keyData.data().qnty)
            : 0;
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
          itemCollection[keyData.id].qnty = count[keyData.id];
          transaction.set(inventory.doc(keyData.id), {
            ...itemCollection[keyData.id]
          });
        });
      }
      transaction.set(typeRef.doc(id), { ...payload });
      return doc;
    });
  } catch (e) {
    console.log("Transaction failed", e);
  }
}

export async function updateTransact(payload, type) {
  const typeRef = db().collection(type);
  const inventory = db().collection("inventory");
  var key = "",
    keys = [],
    itemCollection = {},
    getCalls = [],
    oldCount = {},
    count = {};
  try {
    // Start firebase transaction
    await db().runTransaction(async transaction => {
      const doc = await transaction.get(typeRef.doc(payload.id));
      if (inventoryTrnx.includes(type)) {
        // Count existing data in that purchase order
        doc.data().items.forEach(element => {
          key = getItemKey(element);
          // push the Key into arraynamed as Keys if not exists
          if (!keys.includes(key)) {
            keys.push(key);
            itemCollection[key] = element;
            // push all getter to promise type array
            getCalls.push(transaction.get(inventory.doc(key)));
          }
          // populate the count for each unique item based on key
          if (!!oldCount[key]) {
            oldCount[key] += parseFloat(element.qnty);
          } else {
            oldCount[key] = parseFloat(element.qnty);
          }
        });
        // Get diffrence in item quantity from Old and new (old-new)
        payload.items.forEach(element => {
          key = getItemKey(element);
          // push the Key into arraynamed as Keys if not exists
          if (!keys.includes(key)) {
            keys.push(key);
            itemCollection[key] = element;
            // push all getter to promise type array
            getCalls.push(transaction.get(inventory.doc(key)));
          }
          // populate the count for each unique item based on key
          if (!!count[key]) {
            count[key] -= parseFloat(element.qnty);
          } else {
            count[key] = parseFloat(element.qnty);
          }
        });
        // Get Inventory record
        var keyDatas = await Promise.all(getCalls);
        keyDatas.forEach(keyData => {
          var serverCount = keyData.exists && keyData.data()
            ? parseFloat(keyData.data().qnty)
            : 0;
          switch (type) {
            // For purcase (inventory + (delta))
            case "purchase":
              count[keyData.id] = serverCount + count[keyData.id] - oldCount[keyData.id];
              break;
            // For sales (inventory - (delta))
            case "sales":
              count[keyData.id] = serverCount - count[keyData.id] + oldCount[keyData.id];
              break;
            default:
              break;
          }
          if(itemCollection && itemCollection[keyData.id]) {
            itemCollection[keyData.id].qnty = count[keyData.id];
          }
          // Set the changed entry if any to inventory
          transaction.set(inventory.doc(keyData.id), {
            ...itemCollection[keyData.id]
          });
        });
      }
      // Update purchase/sales order
      transaction.set(typeRef.doc(payload.id), { ...payload });
      return doc;
    });
  } catch (e) {
    console.log("Transaction failed", e);
  }
}
