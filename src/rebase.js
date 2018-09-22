var app = window.firebase.initializeApp({
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
});

function msToString(time) {
    return time;
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

export function retrieveFirebaseUserData(uid, callback) {
    let url = `/users/${uid}/data`

    const colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];

    db.ref(url).on("value", (snapshot) => {
        let data = {};
        let labels = [];
        let dataUsage = [];
        snapshot.forEach((child) => {
            labels.push(child.key)
            dataUsage.push(child.val())
        });
        data = {
            labels: labels,
            datasets: [{
                label: "Data usage",
                backgroundColor: colors,
                data: dataUsage,
            }]
        };
        console.log(data);
        callback(data);
    }, (error) => console.log("The read failed: " + error.code));
}

export function retrieveFirebaseUserRedditData(uid, callback) {
    let url = `/users/${uid}/reddit`

    db.ref(url).on("value", (snapshot) => {
        let arr = [];
        snapshot.forEach((child) => {
            arr.push({name: child.key, time: child.val().time});
        });
        callback(arr);
    }, (error) => console.log("The read failed: " + error.code));
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
            timeTV: msToString(json["0"].time),
            visitsTV: json["0"].watches,
            timeMovies: msToString(json["1"].time),
            visitsMovies: json["1"].watches
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

