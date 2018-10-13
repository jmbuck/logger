import {getWebsiteName, getActiveTab} from "../Background";
import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

let alertInterval;

function updateSiteTime(uid, url, time) {
    let hostname = getWebsiteName(url);

    if(!hostname) return;

    db.ref(`/users/${uid}/websites/${hostname}/time`).transaction((value) => {
        return time + (value ? value : 0);
    });

    //Always overwrite timestamp - this'll show timestamp of most recent visit
    db.ref(`/users/${uid}/websites/${hostname}/timestamp`).transaction((value) => {
        return Date.now();
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

document.addEventListener("init-auth", () => {
    if(auth.currentUser)
        alertInterval = setInterval(shawnsFunction, 5000);
    else if(alertInterval)
        clearInterval(alertInterval);
});

document.addEventListener("tab-removed", (e) => {
    updateSiteTime(auth.currentUser.uid, e.detail.tab.domain, Date.now() - e.detail.tab.time);
});

document.addEventListener("tab-updated", (e) => {
    if(e.detail.old_domain !== e.detail.new_domain)
        updateSiteVisits(auth.currentUser.uid, e.detail.tab.domain)
});

document.addEventListener("tab-deactivated", (e) => {
    updateSiteTime(auth.currentUser.uid, e.detail.tab.domain, Date.now() - e.detail.tab.time);
});
