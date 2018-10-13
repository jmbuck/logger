import { getWebsiteName, db, auth } from "../Background";

let tab_sessions = {};

function domainRetrieval(URL) {
    return URL.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img)[0];
}

function updateSiteTime(uid, url, time) {
    let hostname = getWebsiteName(url);

    if(!hostname) return;

    db.ref(`/users/${uid}/websites/${hostname}/time`).transaction((value) => {
        return time + (value ? value : 0);
    });
}

function updateSiteVisits(uid, url) {
    let hostname = getWebsiteName(url);

    if(!hostname) return;

    db.ref(`/users/${uid}/websites/${hostname}/visits`).transaction((value) => {
        return 1 + (value ? value : 0);
    });
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
            for(let key in tab_sessions) {
                if(!tab_sessions.hasOwnProperty(key)) continue;

                if(tab_sessions[key].active) {
                    updateSiteTime(auth.currentUser.uid, tab_sessions[key].domain, Date.now() - tab_sessions[key].time);
                    tab_sessions[key].time = -1;
                    tab_sessions[key].active = false;
                    break;
                }
            }

            tab_sessions[activeInfo.tabId].time = Date.now();
            tab_sessions[activeInfo.tabId].active = true;
        }
    });
}

function addTabToSessions(tab) {
    if(auth.currentUser) {
        let domain = domainRetrieval(tab.url);
        if(domain === "chrome")
            return;

        tab_sessions[tab.id] = {
            id: tab.id,
            url: tab.url,
            domain: domain,
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
        })
    }
    else {
        tab_sessions = {};
    }
}