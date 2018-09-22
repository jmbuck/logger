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
export function retrieveFirebaseUserYoutubeVideoData(uid, callback) {

    let arr = []
    let url = '/users/' + uid + '/youtube'

    db.ref(url).on("value", function(snapshot) {
        snapshot.forEach((child) => {
            arr.push({name: child.key, time: child.val().timeWatched})
        });
        callback(arr);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    return arr
}

export function retrieveFirebaseWebsiteData(uid, callback) {
    let url = `/users/${uid}/website`

    db.ref(url).on("value", (snapshot) => {
        let arr = [];
        snapshot.forEach((child) => {
            const json = child.val();
            arr.push({name: json.name, time: json.time, visits: json.time, data: json.data, category: json.category ? json.category : "not specified"});
        })
        callback(arr);
    }, (error) => console.log("The read failed: " + error.code));
}

export function retrieveFirebaseNetflixData(uid, callback) {
    let url = `/users/${uid}/netflix`;

    db.ref(url).on("value", (snapshot) => {
        const json = snapshot.toJSON();
        callback({
            timeTV: json["type0"].time,
            visitsTV: json["type0"].watches,
            timeMovies: json["type1"].time,
            visitsMovies: json["type1"].watches
        })
    }, (error) => console.log("The read failed: " + error.code));
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
export function retrieveFirebaseGlobalYoutubeVideoData(callback) {
    let arr = []

    let url = '/global/youtube'

    db.ref(url).on("value", function(snapshot) {
        snapshot.forEach((child) => {
            arr.push({name: child.key, time: child.val().timeWatched})
        });
        callback(arr);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    return arr
}

export const auth = app.auth()
export const db = app.database()
export const googleProvider = new window.firebase.auth.GoogleAuthProvider()

