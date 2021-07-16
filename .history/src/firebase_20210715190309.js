import firebase from 'firebase/app'
import "firebase/auth"
const app = firebase.initializeApp({
    apiKey: "AIzaSyA7JEfrmQYYJ8zPTDBvIiA-2Ma6yqOzYNY",
    authDomain: "quick-type-dev.firebaseapp.com",
    databaseURL: "https://quick-type-dev-default-rtdb.firebaseio.com",
    projectId: "quick-type-dev",
    storageBucket: "quick-type-dev.appspot.com",
    messagingSenderId: "852960131480",
    appId: "1:852960131480:web:fbb7ad852d17b596bf13ed"
})
export const auth = app.auth()

export default app