// Firebase config (COMPAT VERSION)
const firebaseConfig = {
  apiKey: "AIzaSyDAnmspfWqxjy3F8DKffTmiGXSyzYWu7Pc",
  authDomain: "keuangan-kost.firebaseapp.com",
  projectId: "keuangan-kost",
  storageBucket: "keuangan-kost.appspot.com",
  messagingSenderId: "992876085296",
  appId: "1:992876085296:web:c1e683eb5b917800f8edf5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();
