
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage'

{/*const firebaseConfig = {
  apiKey: "AIzaSyDLxaZMYRSo6eBgIr8VVS62yB6ADYf8XIk",
  authDomain: "dormifind.firebaseapp.com",
  projectId: "dormifind",
  storageBucket: "dormifind.appspot.com",
  messagingSenderId: "175212554402",
  appId: "1:175212554402:web:07e860d1079e8eec210ffb"
};
*/}
 //Final Database
  const firebaseConfig = {
    apiKey: "AIzaSyBEbc7pGy613wopUp-73TP3t2rzAf_v_iM",
    authDomain: "backupdrmfind.firebaseapp.com",
  projectId: "backupdrmfind",
  storageBucket: "backupdrmfind.appspot.com",
   messagingSenderId: "84450804315",
   appId: "1:84450804315:web:9cf1fae00b824d1b33f57e"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const storage = getStorage();