/*global chrome*/

import {app, auth, db} from "./Background.js"
import firebase from "firebase/app";
require("firebase/auth");
require("firebase/database");

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

    firebase.auth().onAuthStateChanged((user) => {
        console.log('User state change detected from the Background script of the Chrome Extension:', user);
    })
}

window.addEventListener("load", () => {
    initApp();
});

/*function onActiveTabChange(activeInfo) {
    //Logic for when a tab is closed
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
        let url = tabs[0] !== undefined ? tabs[0].url : null;
        if(url != null) checkTab(url)
    });
    //endOfSession = Date.now(); //sessions are tab based.....for now.
    //var sessionTime = startOfSession - endOfSession;
    // We have the session time!
    //startOfSession = Date.now();
    //alert("Tab " + activeInfo.tabId + " is now the active tab!");
}

function onTabUpdate(tabId, changeInfo, tab) {
    //Logic for when a tab is updated
    //alert("Tab " + tabId + " has updated!");
    if (changeInfo.status === "loading" && changeInfo.url !== undefined) {

        //alert("URL is now: " + changeInfo.url)
        var sessionNotTracked = true;
        var tabNotTracked = true;

        for (var i = 0; i < SessionsArray.length; i++) {
            //Are we already tracking this tab?
            if (SessionsArray[i].tabid === tabId) {
                tabNotTracked = false;
                //Is the new URL in the same domain as what we were already tracking for the tab?
                if (SessionsArray[i].domain === domainRetreival(changeInfo.url)) {
                    //Do nothing if it is - it's the same session
                } else {
                    let finalSessionTime = Date.now() - SessionsArray[i].startOfSession;
                    //HERE: This marks the end of a prior session, what to do with SessionArray[i]'s data?'
                    console.log(SessionsArray);
                    postSiteData(SessionsArray[i].domain, finalSessionTime);
                    SessionsArray.splice(i, 1); //Remove this old session.
                    //Are we already tracking this new session in another tab?
                    for (var i = 0; i < SessionsArray.length; i++) {
                        if (SessionsArray[i].domain === domainRetreival(changeInfo.url)) {
                            //We are tracking this session in another tab
                        } else {
                            //We are not tracking this session in another tab
                            var TabSession = {
                                tabid: tabId,
                                startOfSession: Date.now(),
                                rawURL: changeInfo.url,
                                domain: domainRetreival(changeInfo.url)
                            };
                            SessionsArray.push(TabSession);
                        }
                    }
                }
                break;
            }
        }

        //We are not tracking this tab
        if (tabNotTracked) {
            //Are we already tracking this session (on another tab)?
            for (var i = 0; i < SessionsArray.length; i++) {
                if (SessionsArray[i].domain === domainRetreival(changeInfo.url)) {
                    sessionNotTracked = false;
                    break;
                }
            }
            if (sessionNotTracked) {
                //We're not tracking this session in any other tab
                var TabSession = {
                    tabid: tabId,
                    startOfSession: Date.now(),
                    rawURL: changeInfo.url,
                    domain: domainRetreival(changeInfo.url)
                };
                SessionsArray.push(TabSession);
            } else {
                //We're tracking this session in another tab - do nothing
            }
        }

        checkTab(changeInfo.url);

    } else if (changeInfo.status === "loading") {
        //alert("URL is now: " + changeInfo.url)
        //checkTab(changeInfo.url)
        //alert("URL is the same.");
    } else {
        //Do nothing
    }
}*/

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


function checkTab(url) {
    if(startYoutube) {
        endYoutube = Date.now();
        const timeWatched = endYoutube - startYoutube;
        startYoutube = null;
        postYoutubeVideoData(channel, timeWatched)
    } else if(startNetflix) {
        endNetflix = Date.now();
        timeWatchedNetflix = endNetflix - startNetflix
    } else if(startReddit) {
        endReddit = Date.now();
        const timeOnSubreddit = endReddit - startReddit;
        startReddit = null;
        postRedditData(subreddit, timeOnSubreddit)
    }

    if(url.includes('youtube.com/watch?')) {
        startYoutube = Date.now();
        fetchJSON(url)
    } else if(url.includes('netflix.com/watch')) {
        startNetflix = Date.now();
        var urlObj = new URL(url);
        NetflixShowData(urlObj.searchParams.get("trackId"));
    } else if(url.includes(redditBaseURL)) {
        startReddit = Date.now();
        subreddit = url.slice(url.indexOf(redditBaseURL) + redditBaseURL.length);
    }
}

function postRedditData(subreddit, timeWatched) {
    if(subreddit) {
        console.log(subreddit);
        console.log(timeWatched);
        if(firebase.auth().currentUser)
            updateFirebaseRedditData(firebase.auth().currentUser.uid, subreddit, timeWatched)
    }

    subreddit = null
}

function updateFirebaseRedditData(uid, subreddit, timeonSubreddit) {
    let updates = {};

    let url = '/users/' + uid + '/reddit/' + subreddit;
    let ref = db.ref(url);
    let storedTime = 0;

    ref.on("value", function(snapshot) {
        let stored = snapshot.val();
        if (stored) {
            storedTime = stored.time
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    updates[url + '/time'] = storedTime + timeonSubreddit;

    db.ref().update(updates).catch((error) => {
        console.log("Error updating Firebase: " + error)
    })
}

function NetflixShowData(trackId) {
    //Corey's function goes here to extraxt show data
}

function postSiteData(sessionName, timeSpent) {
    if(sessionName) {
        if(firebase.auth().currentUser)
            updateFirebaseSiteData(firebase.auth().currentUser.uid, sessionName, timeSpent)
    }
}

function updateFirebaseSiteData(uid, url, time) {
    let updates = {};

    let hostname = getWebsiteName(url);

    if(!hostname) return;

    let db_url = '/users/' + uid + '/websites/' + hostname;
    let db_url2 = '/users/' + uid + '/filters/data/' + hostname;
    let ref = db.ref(db_url);

    ref.transaction((value) => {
        if(value) {
            value.time = time + (value.time ? value.time : 0);
            value.visits = 1 + (value.visits ? value.visits : 1);
            return value;
        }
        return {
            time: time,
            visits: 1,
            url: url
        }
    });

    updates[db_url2] = { visits: true, data: true, time: true };

    console.log("UPDATES: " + JSON.stringify(updates), url);
    db.ref().update(updates).catch((error) => {
        console.log("Error updating Firebase: " + error)
    })
}

function fetchJSON(url) {
    fetch(`https://www.youtube.com/oembed?url=${url}&format=json`, { method: 'GET' })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            channel = data.author_name
        })
        .catch((error) => {
            console.log(error)
        })
}

function postYoutubeVideoData(channel, timeWatched) {
    if(channel) {
        console.log(channel);
        console.log(timeWatched);
        if(firebase.auth().currentUser)
            updateFirebaseYoutubeVideoData(firebase.auth().currentUser.uid, {channel, timeWatched})
    }

    channel = null;
}

//chrome.tabs.onActivated.addListener(onActiveTabChange);
//chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.runtime.onMessage.addListener((message) => {
    if(message.netflix_info) {
        if(startNetflix) {
            timeWatchedNetflix = Date.now() - startNetflix;
            startNetflix = Date.now()
        }
        if(firebase.auth().currentUser) {
            updateFirebaseNetflixData(firebase.auth().currentUser.uid, message.data, timeWatchedNetflix)
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
    if (firebase.auth().currentUser)
        updateFirebaseIntervalData(firebase.auth().currentUser.uid, dataCollector);
    dataCollector = [];

}, 5000);

/*
    Expects data to be:
    {
        channel: string,
        timeWatched: integer
    }

    Stores data as:
    /global
        /youtube
            /channel
                timeWatched
    /users
        /uid
            /youtube
                /channel
                    timeWatched

 */
function updateFirebaseYoutubeVideoData(uid, data) {
    console.log(uid, data);
    let updates = {};

    let url = '/users/' + uid + '/youtube/' + data.channel;
    let ref = db.ref(url);
    let storedTime = 0;

    ref.on("value", function(snapshot) {
        let stored = snapshot.val();
        if (stored) {
            storedTime = stored.timeWatched
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    updates[url + '/timeWatched'] = storedTime + data.timeWatched;

    url = '/global/youtube/' + data.channel;
    ref = db.ref(url);
    storedTime = 0;

    ref.on("value", function(snapshot) {
        let stored = snapshot.val();
        if (stored) {
            storedTime = stored.timeWatched
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    updates[url + '/timeWatched'] = storedTime + data.timeWatched;

    db.ref().update(updates)
}
