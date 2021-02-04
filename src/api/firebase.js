// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZoYoOOsXMygmY78pQSv_NHhOy6v3qQTQ",
  authDomain: "plugin-ef7c3.firebaseapp.com",
  databaseURL: "https://plugin-ef7c3.firebaseio.com",
  projectId: "plugin-ef7c3",
  storageBucket: "plugin-ef7c3.appspot.com",
  messagingSenderId: "185585367733",
  appId: "1:185585367733:web:ecc0501cd0dd1844fadcfc"
};

firebase.initializeApp(firebaseConfig);

export const Auth = firebase.auth();
export const db = firebase.firestore();