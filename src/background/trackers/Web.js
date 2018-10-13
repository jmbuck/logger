import { retrieveFirebaseWebsiteSettings, getWebsiteName, db, auth } from "../Background";

let alertInterval;
let tab_sessions = {};
let settings = undefined;

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

function checkTimeLimitViolation() {
    if (!settings) {
        retrieveFirebaseWebsiteSettings(auth.currentUser.uid, (data) => {
            settings = data
        })
    }

    let hostname = getWebsiteName(getActiveTab().domain)
    if (hostname) {
        let current = getActiveTab().time
        let elapsed = (Date.now() - current) / 1000
        let timeLimit = settings[hostname].timeLimit
        if (timeLimit !== -1) {
            if ( timeLimit / 1000 < elapsed ) {
                alert(`${settings[hostname].warningMessage}: \nYour time limit is ${timeLimit / 1000} and you have been on for ${elapsed}`)
            }
        }
    }
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

        alertInterval = setInterval(checkTimeLimitViolation, 15000);
    }
    else {
        tab_sessions = {};
        if(alertInterval)
            clearInterval(alertInterval);
    }
}