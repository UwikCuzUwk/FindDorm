
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDLxaZMYRSo6eBgIr8VVS62yB6ADYf8XIk",
  authDomain: "dormifind.firebaseapp.com",
  projectId: "dormifind",
  storageBucket: "dormifind.appspot.com",
  messagingSenderId: "175212554402",
  appId: "1:175212554402:web:07e860d1079e8eec210ffb"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const storage = getStorage();