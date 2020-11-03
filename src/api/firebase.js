// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH_OA4ccgpK4zfi6dLyyztwV0hQpjxA_o",
  authDomain: "dolj-lab.firebaseapp.com",
  databaseURL: "https://dolj-lab.firebaseio.com",
  projectId: "dolj-lab",
  storageBucket: "dolj-lab.appspot.com",
  messagingSenderId: "244965531919",
  appId: "1:244965531919:web:1714fd5b7556b0c9995e7a",
  measurementId: "G-ZT4C4BH8Z4",
};

firebase.initializeApp(firebaseConfig);

export const Auth = firebase.auth();
export const db = firebase.firestore();