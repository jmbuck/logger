/*global chrome*/

//sample for timing tabs found here: https://github.com/google/page-timer

import firebase from "firebase";

var SessionsArray = [];

var startOfBrowsing = Date.now();
var startYoutube;
var endYoutube;
var channel;
var endOfSession;

function domainRetreival(Stirng URL) {
  var resultArray = URL.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img);
  return resultArray[0];
}


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
    } else {
        console.error('The OAuth Token was null');
    }
});


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
        }
      }

      sessionNotTracked = true;

        //We are not tracking this tab
        if (tabNotTracked) {
          //Are we already tracking this session (on another tab)?
            for (var i = 0; i < SessionsArray.length; i++) {
              if (SessionsArray[i].domain == domainRetreival(changeInfo.url)) {
                sessionNotTracked = false;
              }
            }
            if (sessionNotTracked) {
              //We're not tracking this session in any other tab
              var TabSession =  = {
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
    postVideoData(channel, timeWatched)
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

function postVideoData(channel, timeWatched) {
  if(channel) {
    //Post data to firebase
    console.log(channel)
    console.log(timeWatched)
  }

  channel = null;
}

chrome.tabs.onActivated.addListener(onActiveTabChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);
