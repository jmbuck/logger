/*global chrome*/

//sample for timing tabs found here: https://github.com/google/page-timer

var TabSessions = {};

var startOfBrowsing = Date.now();
var startOfSession = Date.now();
var startYoutube;
var endYoutube;
var channel;
var endOfSession;

var app = firebase.initializeApp({
    apiKey: "AIzaSyAWi4vgQmLJqYCaVjwqXygDcD8PERfafRM",
    authDomain: "logger-216718.firebaseapp.com",
    databaseURL: "https://logger-216718.firebaseio.com",
    projectId: "logger-216718",
    storageBucket: "logger-216718.appspot.com",
    messagingSenderId: "870302921200"
});

var db = firebase.database(app);
var auth = app.auth();

function onActiveTabChange(activeInfo) {
  //Logic for when a tab is closed
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
      let url = tabs[0] != undefined ? tabs[0].url : null
      if(url != null) checkTab(url)
    });
    endOfSession = Date.now(); //sessions are tab based.....for now.
    var sessionTime = startOfSession - endOfSession;
    // We have the session time!
    startOfSession = Date.now();
    //alert("Tab " + activeInfo.tabId + " is now the active tab!");
}

chrome.identity.getAuthToken({interactive: false}, function(token) {
    if (chrome.runtime.lastError) {
        console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    } else if (token) {
        // Authorize Firebase with the OAuth Access Token.
        var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
        firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function(error) {
            // The OAuth token might have been invalidated. Lets' remove it from cache.
            if (error.code === 'auth/invalid-credential') {
                chrome.identity.removeCachedAuthToken({token: token}, function() {
                    startAuth(false, callback);
                });
            }
        });
        chrome.runtime.sendMessage({auth, db}, function(response) {
            console.log(response);
        });
    } else {
        console.error('The OAuth Token was null');
    }
});

function onTabUpdate(tabId, changeInfo, tab) {
  //Logic for when a tab is updated
    //alert("Tab " + tabId + " has updated!");
    if (changeInfo.status == "loading" && changeInfo.url != undefined) {
      //alert("URL is now: " + changeInfo.url)
      checkTab(changeInfo.url)
    } else if (changeInfo.status == "loading") {
      //alert("URL is the same.");
    } else {
      //Do nothing
    }
}

/**
 * Start the auth flow and authorizes to Firebase.
 * @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
 */
function startAuth(interactive, callback) {
    console.log("Inside startAuth function")
    // Request an OAuth token from the Chrome Identity API.
    chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
        if (chrome.runtime.lastError && !interactive) {
            console.log('It was not possible to get a token programmatically.');
        } else if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else if (token) {
            // Authorize Firebase with the OAuth Access Token.
            var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function(error) {
                // The OAuth token might have been invalidated. Lets' remove it from cache.
                if (error.code === 'auth/invalid-credential') {
                    chrome.identity.removeCachedAuthToken({token: token}, function() {
                        startAuth(interactive);
                    });
                }
            });
            chrome.runtime.sendMessage({auth, db}, function(response) {
                console.log(response);
            });
        } else {
            console.error('The OAuth Token was null');
        }
    });
    callback()
}

function checkTab(url) {
  if(startYoutube) {
    endYoutube = Date.now()
    timeWatched = endYoutube - startYoutube
    startYoutube = null;
    postYoutubeVideoData(channel, timeWatched)
  }
  if(url.includes('youtube.com/watch?')) {
    startYoutube = Date.now()
    fetchJSON(url)
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
    updateFirebaseYoutubeVideoData(auth.currentUser.uid, {channel, timeWatched})
  }
  
  channel = null;
}

chrome.tabs.onActivated.addListener(onActiveTabChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);

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

/*
    Expects data to be:
    {
        channel: string,
        timeWatched: integer
    }

    Stores data as:
    /global/
        youtube/
            channel/
                timeWatched
    /users/
        uid/
            channel/
                timeWatched

 */
function updateFirebaseYoutubeVideoData(uid, data) {
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
function retrieveFirebaseUserYoutubeVideoData(uid) {

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
function retrieveFirebaseGlobalYoutubeVideoData() {
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


setInterval(() => {


    dataCollector = [];
}, 5000);
