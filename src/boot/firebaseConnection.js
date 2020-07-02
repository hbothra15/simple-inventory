// import something here
import firebaseService from '../services/firebase'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async (/* { app, router, Vue ... } */) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBd5Xo5zvaoaFw6Ml36QrMmkQga2F7rWnc",
    authDomain: "simple-inventory-rs.firebaseapp.com",
    databaseURL: "https://simple-inventory-rs.firebaseio.com",
    projectId: "simple-inventory-rs",
    storageBucket: "simple-inventory-rs.appspot.com",
    messagingSenderId: "538793562866",
    appId: "1:538793562866:web:e4f84f45527ce79862f66b"
  };
  firebaseService.fBInit(firebaseConfig)
  console.log(firebaseService.auth());
}
