// Initialize Firebase
var config = {
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
};
firebase.initializeApp(config);

window.onload = function() {
    initApp();
};

function initApp() {
    document.getElementById('send-user-data').addEventListener('click', writeUserData, false);
}

function writeUserData() {
    firebase.database().ref('users/' + firebase.auth().username).set({
        username: firebase.auth().username,
        email: firebase.auth().email
    });
}