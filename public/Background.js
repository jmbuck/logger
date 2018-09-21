/*global chrome*/

//sample for timing tabs found here: https://github.com/google/page-timer

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
    alert("Tab " + activeInfo.tabId + " is now the active tab!");
}

function onTabUpdate(tabId, changeInfo, tab) {
  //Logic for when a tab is updated
    //alert("Tab " + tabId + " has updated!");
    if (changeInfo.status == "loading" && changeInfo.url != undefined) {
      alert("URL is now: " + changeInfo.url)
    } else if (changeInfo.status == "loading") {
      alert("URL is the same.");
    } else {
      //Do nothing
    }
}

chrome.tabs.onActivated.addListener(onActiveTabChange);
chrome.tabs.onUpdated.addListener(onTabUpdate);
