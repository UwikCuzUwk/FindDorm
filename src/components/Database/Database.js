
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAlu7kUUEs8mVwvsteZ0l2y9MAh9iMrNtk",
    authDomain: "dormfinder-401121.firebaseapp.com",
    projectId: "dormfinder-401121",
    storageBucket: "dormfinder-401121.appspot.com",
    messagingSenderId: "450887013875",
    appId: "1:450887013875:web:0b718b36baba45fdf66e86"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const storage = getStorage();