import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth"
var config = require('./config');
console.log(config.default.REACT_APP_FIREBASE_KEY)
const app = firebase.initializeApp({
    apiKey: config.default.REACT_APP_FIREBASE_KEY,
    authDomain: config.default.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: config.default.REACT_APP_FIREBASE_DATABASE,
    projectId: config.default.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: config.default.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.default.REACT_APP_FIREBASE_SENDER_ID,
    appId: config.default.REACT_APP_MESSAGING_APP_ID,
})
export const auth = app.auth()
export var db = firebase.firestore();
export default app