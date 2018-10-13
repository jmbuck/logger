import "./trackers/Web"
import "./trackers/Reddit"
import "./trackers/Youtube"
import "./trackers/Netflix"

export let tab_sessions = {};

export function getWebsiteName(url) {
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

export function domainRetrieval(URL) {
    return URL.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img)[0];
}

export function getActiveTab() {
    for(let key in tab_sessions) {
        if(!tab_sessions.hasOwnProperty(key)) continue;

        if(tab_sessions[key].active) {
            return tab_sessions[key];
        }
    }
    return null;
}

export function addTabToSessions(tab) {
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

window.addEventListener("load", () => {
    auth.onAuthStateChanged((user) => {
        console.log('User state change detected from the Background script of the Chrome Extension:', user);
        if(auth.currentUser) {
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    addTabToSessions(tab);
                })
            });

        }
        else {
            tab_sessions = {};
        }
        document.dispatchEvent(new Event("init-auth"));
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
        if(auth.currentUser) {
            console.log(tab_sessions, tabId, tab_sessions[tabId]);
            document.dispatchEvent(new CustomEvent("tab-removed", { detail: { tab: tab_sessions[tabId] } } ));
            tab_sessions[tabId] = null;
            delete tab_sessions[tabId];
        }
    });

    chrome.tabs.onCreated.addListener((tab) => {
        addTabToSessions(tab);
        document.dispatchEvent(new CustomEvent("tab-created", { detail: { tab: tab_sessions[tab.id] } } ));
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
        if(changeInfo.url && auth.currentUser) {
            const oldDomain = tab_sessions[tabId].domain;
            const newDomain = domainRetrieval(changeInfo.url);
            const oldURL = tab_sessions[tabId].url;

            tab_sessions[tabId].url = changeInfo.url;
            tab_sessions[tabId].domain = newDomain;

            document.dispatchEvent(new CustomEvent("tab-updated", { detail: { tab: tab_sessions[tabId], old_domain: oldDomain, new_domain: newDomain, old_url: oldURL, new_url: tab_sessions[tabId].url } } ))
        }
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
        if(auth.currentUser) {

            const activeTab = getActiveTab();
            if(activeTab && activeTab.id !== activeInfo.tabId) {
                document.dispatchEvent(new CustomEvent("tab-deactivated", { detail: { tab: activeTab } } ));
                activeTab.time = -1;
                activeTab.active = false;
            }
            tab_sessions[activeInfo.tabId].time = Date.now();
            tab_sessions[activeInfo.tabId].active = true;
            if(!activeTab || activeTab.id !== activeInfo.tabId)
                document.dispatchEvent(new CustomEvent("tab-activated", { detail: { tab: tab_sessions[activeInfo.tabId] } } ));
        }
    });
});