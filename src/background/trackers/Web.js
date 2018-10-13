import { getWebsiteName, db, auth } from "../Background";

let alertInterval;
let tab_sessions = {};

function domainRetrieval(URL) {
    return URL.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img)[0];
}

function getActiveTab() {
    for(let key in tab_sessions) {
        if(!tab_sessions.hasOwnProperty(key)) continue;

        if(tab_sessions[key].active) {
            return tab_sessions[key];
        }
    }
    return null;
}

function updateSiteTime(uid, url, time) {
    let hostname = getWebsiteName(url);

    if(!hostname) return;

    db.ref(`/users/${uid}/websites/${hostname}/time`).transaction((value) => {
        return time + (value ? value : 0);
    });

    db.ref(`/global/websites/${hostname}/time`).transaction((value) => {
        return time + (value ? value : 0);
    })
}

function updateSiteVisits(uid, url) {
    let hostname = getWebsiteName(url);

    if(!hostname) return;

    db.ref(`/users/${uid}/websites/${hostname}/visits`).transaction((value) => {
        return 1 + (value ? value : 0);
    });

    db.ref(`/global/websites/${hostname}/visits`).transaction((value) => {
        return 1 + (value ? value : 0);
    })
}

function shawnsFunction() {
    let hostname = getWebsiteName(getActiveTab().domain)
}

export function initWebTracker() {
    chrome.tabs.onRemoved.addListener((tabId) => {
        if(auth.currentUser) {
            updateSiteTime(auth.currentUser, tab_sessions[tabId].domain, Date.now() - tab_sessions[tabId].time);
            tab_sessions[tabId] = null;
        }
    });

    chrome.tabs.onCreated.addListener(addTabToSessions);

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if(changeInfo.url && auth.currentUser) {
            const newDomain = domainRetrieval(changeInfo.url);
            tab_sessions[tabId].url = changeInfo.url;
            if(newDomain !== tab_sessions[tabId].domain) {
                tab_sessions[tabId].domain = newDomain;
                updateSiteVisits(auth.currentUser.uid, tab_sessions[tabId].domain)
            }
        }
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
        if(auth.currentUser) {

            const activeTab = getActiveTab();
            if(activeTab) {
                updateSiteTime(auth.currentUser.uid, activeTab.domain, Date.now() - activeTab.time);
                activeTab.time = -1;
                activeTab.active = false;
            }
            tab_sessions[activeInfo.tabId].time = Date.now();
            tab_sessions[activeInfo.tabId].active = true;
        }
    });
}

function addTabToSessions(tab) {
    if(auth.currentUser) {
        tab_sessions[tab.id] = {
            id: tab.id,
            url: tab.url,
            domain: domainRetrieval(tab.url),
            time: tab.active ? Date.now() : -1,
            active: tab.active
        };
    }
}

export function initWebAuth() {
    if(auth.currentUser) {
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                addTabToSessions(tab);
            })
        });

        alertInterval = setInterval(shawnsFunction, 5000);
    }
    else {
        tab_sessions = {};
        if(alertInterval)
            clearInterval(alertInterval);
    }
}