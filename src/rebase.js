var app = window.firebase.initializeApp({
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
});

/*
    Returns array data as:
    [
        "Channel1": {
            timeWatched: int
        },
        "Channel2": {
            timeWatched: int
        }
    ]
 */
export function retrieveFirebaseUserYoutubeVideoData(uid) {

    let arr = {}
    let url = '/users/' + uid + '/youtube'

    db.ref(url).on("value", function(snapshot) {
        snapshot.forEach((child) => {
            arr[child.key] = child.val()
        });
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    return arr
}

/*
    Returns array data as:
    [
        "Channel1": {
            timeWatched: int
        },
        "Channel2": {
            timeWatched: int
        }
    ]
 */
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

export const auth = app.auth()
export const db = app.database()
export const googleProvider = new window.firebase.auth.GoogleAuthProvider()

