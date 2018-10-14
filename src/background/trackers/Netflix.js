import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

console.log("Netflix tracker started");

function fetchCallback(id, callback) {
    fetch(`https://www.netflix.com/api/shakti/57e85dca/metadata?movieid=${id}`, { method: 'GET' })
        .then((response) => {
            if (!response.ok) {
                console.log(response.statusText);
                return;
            }
            return response;
        })
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            console.log(error)
        })
}

function updateNetflixTime(uid, url, time) {
    let id = url.substring("https://www.netflix.com/watch/".length, url.length);
    id = id.substring(0, id.indexOf("?"));
    fetchCallback(id, (json) => {
        db.ref(`/users/${uid}/netflix/${json.video.type}/time`).transaction((value) => {
            return time + (value ? value : 0);
        });

        db.ref(`/global/netflix/${json.video.id}/time`).transaction((value) => {
            return time + (value ? value : 0);
        });

        db.ref(`/global/netflix/${json.video.id}/title`).set(json.video.title);
    });
}

function updateNetflixVisits(uid, url) {
    let id = url.substring("https://www.netflix.com/watch/".length, url.length);
    id = id.substring(0, id.indexOf("?"));
    fetchCallback(id, (json) => {
        db.ref(`/users/${uid}/netflix/${json.video.type}/visits`).transaction((value) => {
            return 1 + (value ? value : 0)
        });

        db.ref(`/global/netflix/${json.video.id}/visits`).transaction((value) => {
            return 1 + (value ? value : 0)
        });

        db.ref(`/global/netflix/${json.video.id}/title`).set(json.video.title);
    });
}

document.addEventListener("tab-removed", (e) => {
    if(e.detail.tab.url.startsWith("https://www.netflix.com/watch/") && e.detail.tab.time !== -1 && e.detail.tab.time)
        updateNetflixTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});

document.addEventListener("tab-updated", (e) => {
    if(e.detail.old_url.startsWith("https://www.netflix.com/watch/") && e.detail.tab.time !== -1 && e.detail.tab.time)
        updateNetflixTime(auth.currentUser.uid, e.detail.old_url, Date.now() - e.detail.tab.time);

    if(e.detail.old_url !== e.detail.new_url && e.detail.new_url.startsWith("https://www.netflix.com/watch/"))
        updateNetflixVisits(auth.currentUser.uid, e.detail.new_url);
});

document.addEventListener("tab-deactivated", (e) => {
    if(e.detail.tab.url.startsWith("https://www.netflix.com/watch/") && e.detail.tab.time !== -1 && e.detail.tab.time)
        updateNetflixTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});