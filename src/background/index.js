/*global chrome*/

import {db} from "../database/Database"
import {auth} from "../database/Auth"
import "./Background"

//sample for timing tabs found here: https://github.com/google/page-timer

var SessionsArray = [];

var startOfBrowsing = Date.now();
var startYoutube;
var endYoutube;
var startNetflix;
var endNetflix;
var redditBaseURL = "reddit.com/r/";
var startReddit;
var endReddit;
var channel;
var subreddit;
var endOfSession;
var timeWatchedNetflix;

function initApp() {

    auth.onAuthStateChanged((user) => {
        console.log('User state change detected from the Background script of the Chrome Extension:', user);
    })
}

window.addEventListener("load", () => {
    initApp();
});

function getWebsiteName(url) {
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

//chrome.tabs.onActivated.addListener(onActiveTabChange);
//chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.runtime.onMessage.addListener((message) => {
    if(message.netflix_info) {
        if(startNetflix) {
            timeWatchedNetflix = Date.now() - startNetflix;
            startNetflix = Date.now()
        }
        if(auth.currentUser) {
            //updateFirebaseNetflixData(auth.currentUser.uid, message.data, timeWatchedNetflix)
        }
    }
});

/*
Expects data to be:
{
title: string,
type: integer [0: show, 1: movie]
}

Stores data as:
/global
/netflix
    /title
        type
        watches
/users
/uid
    /netflix
        title

*/
function updateFirebaseNetflixData(uid, data, timeWatchedNetflix) {
    let updates = {};
    let type = (data.type === 0)? "shows": "movies";

    let url = '/users/' + uid + '/netflix/' + type;
    let ref = db.ref(url);

    let storedWatches = 0;
    let storedTime = 0;
    ref.on("value", function(snapshot) {
        let stored = snapshot.val();
        if (stored) {
            storedWatches = stored.watches;
            storedTime = stored.time
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    updates[url + '/watches'] = ++storedWatches;
    updates[url + '/time'] = storedTime + timeWatchedNetflix;

    db.ref().update(updates).catch((error) => {
        console.log("Error updating Firebase: " + error)
    })
}

const networkFilters = {
    urls: [
        "*://*/*"
    ]
};

let dataCollector = [];

function retrieveDetails(details) {
    if(details.statusCode === 200) {
        let data = { url : details.initiator, method : details.method, type : details.type };
        if(details.responseHeaders) {
            for(let i = 0; i < details.responseHeaders.length; i++) {
                if(details.responseHeaders[i].name.toLowerCase() === "content-length")
                    data["size"] = details.responseHeaders[i].value;
                else if(details.responseHeaders[i].name.toLowerCase() === "content-type")
                    data["content-type"] = details.responseHeaders[i].value;
                else if(details.responseHeaders[i].name.toLowerCase() === "date")
                    data["date"] = details.responseHeaders[i].value;
            }
        }
        else
            data["hasHeaders"] = false;

        dataCollector.push(data);
    }
}

chrome.webRequest.onCompleted.addListener(retrieveDetails, networkFilters, ["responseHeaders"]);

function updateFirebaseIntervalData(uid, data) {
    let updates = {};

    let total = {};

    for (let i = 0; i < data.length; i++) {
        let type = data[i].type;
        let size = parseInt(data[i].size);
        if (isNaN(size)) {
            size = 0
        }

        if (!data[i].url) continue;

        let hostname = getWebsiteName(data[i].url);

        if(!hostname) continue;

        let url = '/users/' + uid + '/websites/' + hostname + '/data';

        if(!updates[url + '/' + type])
            updates[url + '/' + type] = 0;

        if(!total[type])
            total[type] = 0;

        updates[url + '/' + type] += size;
        total[type] += size;
    }

    let url = '/users/' + uid + '/data';

    for(let key in total) {
        if(!total.hasOwnProperty(key)) continue;

        updates[url + '/' + key] = total[key];
    }

    for(let key in updates) {
        if(!updates.hasOwnProperty(key)) continue;

        db.ref(key).transaction((value) => {
            return updates[key] + (value ? value : 0);
        });
    }
}

setInterval(() => {
    //check uid not null
    if (auth.currentUser)
        updateFirebaseIntervalData(auth.currentUser.uid, dataCollector);
    dataCollector = [];

}, 5000);