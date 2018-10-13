import "./trackers/Web"
import "./trackers/Reddit"
import "./trackers/Youtube"
import "./trackers/Netflix"
import {initWebAuth, initWebTracker} from "./trackers/Web";
import firebase from "firebase";

const config = {
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
};

export const app = firebase.initializeApp(config);
export const db = app.database();
export const auth = firebase.auth();

window.addEventListener("load", () => {
    firebase.auth().onAuthStateChanged((user) => {
        console.log('User state change detected from the Background script of the Chrome Extension:', user);
        initWebAuth();
    });

    initWebTracker();
});

export function getWebsiteName(url) {
    let hostname = url.match(/\/\/(.*)(?=\.)(.*)(?=\.)/g);
    if (!hostname) {
        console.log("Could not find hostname");
        return undefined;
    }
    hostname = (hostname[0] !== undefined)? hostname[0].split('.').join('-'): null;
    hostname = hostname.substring(2);
    if (!hostname) {
        console.log("Could not find hostname");
        return undefined;
    }

    if (hostname.startsWith('www')) hostname = hostname.substring(4);
    return hostname;
}

export function retrieveFirebaseWebsiteSettings(uid, callback) {
    let settings = {}
    db.ref(`/users/${uid}/filters/data`).once("value").then((snapshot) => {
        snapshot.forEach( (child) => {
            let key = child.key
            const json = child.val()
            let childJson = {
                data: (json.data)? json.data: true,
                time: (json.time)? json.time: true,
                visits: (json.visits)? json.visits: true,
                timeLimit: (json.timeLimit)? json.timeLimit: -1,
                warningMessage: (json.warningMessage)? json.warningMessage: "Warning message for time limit"
            }
            settings[key] = childJson
        });
        callback(settings)
    });
}