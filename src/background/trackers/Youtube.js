import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

function getAuthorID(author_url) {
    author_url = author_url.substring("https://www.youtube.com/".length, author_url.length);
    author_url = author_url.substring(0, author_url.indexOf("/")) + "-" + author_url.substring(author_url.indexOf("/") + 1);
    return author_url;
}

function fetchCallback(url, callback) {
    console.log(`https://www.youtube.com/oembed?url=${url}&format=json`);
    fetch(`https://www.youtube.com/oembed?url=${url}&format=json`, { method: 'GET' })
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
            console.log(response);
            callback(response);
        })
        .catch((error) => {
            console.log(error)
        })
}

function updateYoutubeVisits(uid, url) {
    fetchCallback(url, (json) => {
        const authorID = getAuthorID(json.author_url);

        db.ref(`/users/${uid}/youtube/${authorID}/visits`).transaction((value) => {
            return 1 + (value ? value : 0);
        });

        db.ref(`/users/${uid}/youtube/${authorID}/name`).set(json.author_name);

        db.ref(`/global/youtube/${authorID}/visits`).transaction((value) => {
            return 1 + (value ? value : 0);
        });

        db.ref(`/global/youtube/${authorID}/name`).set(json.author_name);
    });
}

function updateYoutubeTime(uid, url, time) {
    fetchCallback(url, (json) => {
        const authorID = getAuthorID(json.author_url);

        db.ref(`/users/${uid}/youtube/${authorID}/time`).transaction((value) => {
            return time + (value ? value : 0);
        });

        db.ref(`/users/${uid}/youtube/${authorID}/name`).set(json.author_name);

        db.ref(`/global/youtube/${authorID}/time`).transaction((value) => {
            return time + (value ? value : 0);
        });

        db.ref(`/global/youtube/${authorID}/name`).set(json.author_name);
    });
}

document.addEventListener("tab-removed", (e) => {
    if(e.detail.tab.url.startsWith("https://www.youtube.com/watch?") && e.detail.tab.time !== -1 && e.detail.tab.time)
        updateYoutubeTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});

document.addEventListener("tab-updated", (e) => {
    if(e.detail.old_url.startsWith("https://www.youtube.com/watch?") && e.detail.tab.time !== -1 && e.detail.tab.time)
        updateYoutubeTime(auth.currentUser.uid, e.detail.old_url, Date.now() - e.detail.tab.time);

    if(e.detail.old_url !== e.detail.new_url && e.detail.new_url.startsWith("https://www.youtube.com/watch?"))
        updateYoutubeVisits(auth.currentUser.uid, e.detail.new_url);
});

document.addEventListener("tab-deactivated", (e) => {
    if(e.detail.tab.url.startsWith("https://www.youtube.com/watch?") && e.detail.tab.time !== -1 && e.detail.tab.time)
        updateYoutubeTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});