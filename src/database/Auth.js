
import firebase from "firebase/app";
require("firebase/auth");

export const config = {
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
};

export const app = firebase.initializeApp(config);
export const googleAuth = new firebase.auth.GoogleAuthProvider()
export const auth = app.auth();