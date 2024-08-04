import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAk832ZLwL_Yb2uveUTr-jgpX42XY3hzq4",
    authDomain: "todo-reactnative-91d5e.firebaseapp.com",
    projectId: "todo-reactnative-91d5e",
    storageBucket: "todo-reactnative-91d5e.appspot.com",
    messagingSenderId: "52237848067",
    appId: "1:52237848067:web:08a781ecf0cd0e45cd8836",
    measurementId: "G-1JKC92KD8T"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export { firebase };