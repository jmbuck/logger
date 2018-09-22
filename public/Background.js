/*global chrome*/

//sample for timing tabs found here: https://github.com/google/page-timer

import firebase from "firebase";

var SessionsArray = [];

var startOfBrowsing = Date.now();
var startYoutube;
var endYoutube;
var startNetflix;
var endNetflix;
var channel;
var endOfSession;
var timeWatchedNetflix;

var config = {
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
};

const app = firebase.initializeApp(config);
const db = app.database();

function domainRetreival(Stirng URL) {
  var resultArray = URL.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);
  return resultArray[0];
}

function initApp() {

    firebase.auth().onAuthStateChanged((user) => {
        console.log('User state change detected from the Background script of the Chrome Extension:', user);
    })
}

window.onload = function() {
    initApp();
};

function onActiveTabChange(activeInfo) {
  //Logic for when a tab is closed
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      let url = tabs[0] != undefined ? tabs[0].url : null
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
    if (changeInfo.status == "loading" && changeInfo.url != undefined) {

      //alert("URL is now: " + changeInfo.url)
      var sessionNotTracked = true;
      var tabNotTracked = true;

      for (var i = 0; i < SessionsArray.length; i++) {
        //Are we already tracking this tab?
        if (SessionsArray[i].tabid == tabId) {
          tabNotTracked = false;
          //Is the new URL in the same domain as what we were already tracking for the tab?
          if (SessionsArray[i].domain == domainRetreival(changeInfo.url)) {
            //Do nothing if it is - it's the same session
          } else {
            var finalSessionTime = Date.now() - SessionsArray[i].startOfSession;
            //HERE: This marks the end of a prior session, what to do with SessionArray[i]'s data?'
            SessionsArray.splice(i, 1); //Remove this old session.
            //Are we already tracking this new session in another tab?
            for (var i = 0; i < SessionsArray.length; i++) {
              if (SessionsArray[i].domain == domainRetreival(changeInfo.url)) {
                //We are tracking this session in another tab
              } else {
                //We are not tracking this session in another tab
                var TabSession =  = {
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
              if (SessionsArray[i].domain == domainRetreival(changeInfo.url)) {
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

    } else if (changeInfo.status == "loading") {
        //alert("URL is now: " + changeInfo.url)
        checkTab(changeInfo.url)
      //alert("URL is the same.");
    } else {
      //Do nothing
    }
}

function checkTab(url) {
  if(startYoutube) {
    endYoutube = Date.now()
    const timeWatched = endYoutube - startYoutube
    startYoutube = null;
    postYoutubeVideoData(channel, timeWatched)
  }
  if(startNetflix) {
      endNetflix = Date.now()
      const timeWatchedNetflix = endNetflix - startNetflix

  }
  if(url.includes('youtube.com/watch?')) {
    startYoutube = Date.now()
    fetchJSON(url)
  }
  if(url.includes('netflix.com/watch')) {
      startNetflix = Date.now()
  }
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
    console.log(channel)
    console.log(timeWatched)
      if(firebase.auth().currentUser)
        updateFirebaseYoutubeVideoData(firebase.auth().currentUser.uid, {channel, timeWatched})
  }

  channel = null;
}

chrome.tabs.onActivated.addListener(onActiveTabChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.runtime.onMessage.addListener((message) => {
    if(message.netflix_info) {
        console.log("Received netflix data ", firebase.auth().currentUser, message.data);
        if(startNetflix) {
            timeWatchedNetflix = Date.now() - startNetflix
            startNetflix = Date.now()
        }
        if(firebase.auth().currentUser)
            updateFirebaseNetflixData(firebase.auth().currentUser.uid, message.data, timeWatchedNetflix)
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

    let url = '/users/' + uid + '/netflix'
    let ref = db.ref(url);

    updates[url + '/' + data.title] = true;

    url = '/global/netflix/' + data.title
    ref = db.ref(url);
    var storedTime = 0

    ref.on("value", function(snapshot) {
        let stored = snapshot.val()
        if (stored) {
            storedTime = stored.watches
        }
        updates[url + '/type'] = data.type;
        updates[url + '/watches'] = storedTime++;

        db.ref().update(updates)
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
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


setInterval(() => {

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

    let url = '/users/' + uid + '/youtube/' + data.channel
    let ref = db.ref(url);
    let storedTime = 0

    ref.on("value", function(snapshot) {
        let stored = snapshot.val()
        if (stored) {
            storedTime = stored.timeWatched
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    updates[url + '/timeWatched'] = storedTime + data.timeWatched;

    url = '/global/youtube/' + data.channel
    ref = db.ref(url);
    storedTime = 0

    ref.on("value", function(snapshot) {
        let stored = snapshot.val()
        if (stored) {
            storedTime = stored.timeWatched
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    updates[url + '/timeWatched'] = storedTime + data.timeWatched;

    db.ref().update(updates)
}
