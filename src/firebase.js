import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.initializeApp({
    apiKey: "AIzaSyDnIoFSF4DrESW5h_dVMx4OE3P5cSmysjw",
    authDomain: "code-cd677.firebaseapp.com",
    projectId: "code-cd677",
    storageBucket: "code-cd677.appspot.com",
    messagingSenderId: "310624677463",
    appId: "1:310624677463:web:13c5cdecbbb2d14a91bd12",
    measurementId: "G-2RCK7373FQ"
}).firestore().collection("2code")

export {db}