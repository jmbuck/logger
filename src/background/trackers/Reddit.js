import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

function getSubreddit(url) {
    url = url.substr("https://www.reddit.com/r/".length, url.length);
    url = url.substr(0, url.indexOf("/"));
    if(!url || url.length === 0)
        return "all";
    return url;
}

function updateSubredditTime(uid, url, time) {
    db.ref(`/users/${uid}/reddit/${getSubreddit(url)}/time`).transaction((value) => {
        return time + (value ? value : 0);
    });

    db.ref(`/global/reddit/${getSubreddit(url)}/time`).transaction((value) => {
        return time + (value ? value : 0);
    })
}

function updateSubredditVisits(uid, url) {
    db.ref(`/users/${uid}/reddit/${getSubreddit(url)}/visits`).transaction((value) => {
        return 1 + (value ? value : 0);
    });

    db.ref(`/global/reddit/${getSubreddit(url)}/visits`).transaction((value) => {
        return 1 + (value ? value : 0);
    })
}

document.addEventListener("tab-removed", (e) => {
    if(e.detail.tab.url.startsWith("https://www.reddit.com/r/"))
        updateSubredditTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});

document.addEventListener("tab-updated", (e) => {
    if(e.detail.tab.url.startsWith("https://www.reddit.com/r/") && getSubreddit(e.detail.old_url) !== getSubreddit(e.detail.new_url))
        updateSubredditVisits(auth.currentUser.uid, e.detail.tab.url)
});

document.addEventListener("tab-deactivated", (e) => {
    if(e.detail.tab.url.startsWith("https://www.reddit.com/r/"))
        updateSubredditTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});