/*global chrome*/

//sample for timing tabs found here: https://github.com/google/page-timer

var TabSessions = {};

function onTabRemoval(tabId, removeInfo) {
  //Logic for when a tab is closed
}

function onTabUpdate(tabId, changeInfo, tab) {
  //Logic for when a tab is updated
}

function onTabReplacement(addedTabId, removedTabId) {
  //Logic for when a tab is replaced (??)
}

chrome.tabs.onRemoved.addListener(onTabRemoval);
chrome.tabs.onUpdated.addListener(onTabUpdate);
chrome.tabs.onReplaced.addListener(onTabReplacement);
