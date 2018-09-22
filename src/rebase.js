import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth'


var app = firebase.initializeApp({
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
});


// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request) {
//             auth = request.auth
//             db = request.db
//             sendResponse({auth, db});
//         }
//     });

export function retrieveFirebaseGlobalYoutubeVideoData() {

    let arr = {}

    let url = '/global/youtube'

    db.ref(url).on("value", function(snapshot) {
        snapshot.forEach((child) => {
            arr[child.key] = child.val()
        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    return arr
}

var db = firebase.database(app);
var base = Rebase.createClass(db);

export const auth = app.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export default base;

