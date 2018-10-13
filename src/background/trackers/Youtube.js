import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

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
            console.log(response);
            return response.json();
        })
        .then((response) => {
            console.log(response);
            callback(response.author_name);
        })
        .catch((error) => {
            console.log(error)
        })
}

function updateYoutubeVisits(uid, url) {
    fetchCallback(url, (author_name) => {
        db.ref(`/users/${uid}/youtube/${author_name}/visits`).transaction((value) => {
            return 1 + (value ? value : 0);
        });

        db.ref(`/global/youtube/${author_name}/visits`).transaction((value) => {
            return 1 + (value ? value : 0);
        })
    });
}

function updateYoutubeTime(uid, url, time) {
    fetchCallback(url, (author_name) => {
        db.ref(`/users/${uid}/youtube/${author_name}/timeWatched`).transaction((value) => {
            return time + (value ? value : 0);
        });

        db.ref(`/global/youtube/${author_name}/timeWatched`).transaction((value) => {
            return time + (value ? value : 0);
        })
    });
}

document.addEventListener("tab-removed", (e) => {
    if(e.detail.tab.url.startsWith("https://www.youtube.com/watch?"))
        updateYoutubeTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});

document.addEventListener("tab-updated", (e) => {
    if(e.detail.tab.url.startsWith("https://www.youtube.com/watch?"))
        updateYoutubeVisits(auth.currentUser.uid, e.detail.tab.url)
});

document.addEventListener("tab-deactivated", (e) => {
    if(e.detail.tab.url.startsWith("https://www.youtube.com/watch?"))
        updateYoutubeTime(auth.currentUser.uid, e.detail.tab.url, Date.now() - e.detail.tab.time);
});