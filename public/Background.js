/*global chrome*/

//sample for timing tabs found here: https://github.com/google/page-timer

import firebase from "firebase";

var TabSessions = {};

var startOfBrowsing = Date.now();
var startOfSession = Date.now();
var endOfSession;


function onActiveTabChange(activeInfo) {
  //Logic for when a tab is closed
    endOfSession = Date.now(); //sessions are tab based.....for now.
    var sessionTime = startOfSession - endOfSession;
    // We have the session time!
    startOfSession = Date.now();
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
    console.log('hello')
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
    console.log('here1')
    callback()
}

/**
 * Starts the sign-in process.
 */
export function startSignIn(auth, callback) {
    auth.signOut();
    console.log('hello2')
    document.getElementById('quickstart-button').disabled = true;
    if (auth.currentUser) {
        console.log('currentUser')
        auth.signOut();
    } else {
        console.log('no user')
        startAuth(true, callback);
    }
}

chrome.tabs.onActivated.addListener(onActiveTabChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);
