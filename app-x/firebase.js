import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
}

const auth = firebase.auth();
const db = firebase.firestore();

const createUser = async (email, password, nome, tipo, superior) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection('users').doc(user.uid).set({
      nome,
      email,
      superior,
      tipo
    });

    console.log('Usuário criado com sucesso:', user.uid);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

export { auth, db, createUser };
export default firebase;