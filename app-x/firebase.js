import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

let firebaseConfig = {
  apiKey: "AIzaSyDZOkFnShGeGTXYJJBIaRkJVbU3_U6VZe4",
  authDomain: "app-x-d2606.firebaseapp.com",
  projectId: "app-x-d2606",
  storageBucket: "app-x-d2606.appspot.com",
  messagingSenderId: "605201586074",
  appId: "1:605201586074:web:b0606d51436fc16beb0c23",
  measurementId: "G-VKBZWVK2HV"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log(`Conectado: ${firebase.apps.length}`);
} else {
  console.log(`Conectando... ${firebase.apps.length}`);
}

const auth = firebase.auth();

export { auth };
export default firebase;
