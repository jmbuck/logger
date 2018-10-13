import {getWebsiteName, getActiveTab} from "../Background";
import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

let alertInterval;
let settings = undefined

function retrieveFirebaseWebsiteSettings(uid, callback) {
    let settings = {}
    db.ref(`/users/${uid}/filters/data`).once("value").then( (snapshot) => {
        snapshot.forEach( (child) => {
            let key = child.key
            const json = child.val()
            let childJson = {
                data: (json.data)? json.data: true,
                time: (json.time)? json.time: true,
                visits: (json.visits)? json.visits: true,
                timeLimit: (json.timeLimit)? json.timeLimit: -1,
                warningMessage: (json.warningMessage)? json.warningMessage: "Warning message for time limit"
            }
            settings[key] = childJson
        });
        callback(settings)
    });
}

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

document.addEventListener("init-auth", () => {
    if(auth.currentUser)
        alertInterval = setInterval(checkTimeLimitViolation, 60000);
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
