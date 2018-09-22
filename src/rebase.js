var app = window.firebase.initializeApp({
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

    return arr
}

export const auth = app.auth()
export const googleProvider = new window.firebase.auth.GoogleAuthProvider()

