import {auth, db} from "../rebase";

function load(evt) {
    var timer = setInterval(retrieveNetflixInfo, 500);

    function retrieveNetflixInfo() {
        if(document.querySelector(".video-title")) {
            const video = document.querySelector(".video-title").querySelector("h4");
            console.log(video.innerHTML);
            console.log(document.querySelector(".button-nfplayerEpisodes"));
            let type = 1
            if (document.querySelector(".button-nfplayerEpisodes")) {
                type = 0
            }
            updateFirebaseNetflixData(auth.currentUser.uid, {title: video.innerHTML, type})
            clearInterval(timer);
        }
    }
}

/*
    Expects data to be:
    {
        title: string,
        type: integer [0: show, 1: movie]
    }

    Stores data as:
    /global
        /netflix
            /title
                type
                watches
    /users
        /uid
            /netflix
                title

 */
function updateFirebaseNetflixData(uid, data) {
    let updates = {};

    let url = '/users/' + uid + '/netflix'
    let ref = db.ref(url);

    updates[url + '/' + data.title] = true;

    url = '/global/netflix/' + data.title
    ref = db.ref(url);
    var storedTime = 0

    ref.on("value", function(snapshot) {
        let stored = snapshot.val()
        if (stored) {
            storedTime = stored.watches
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    updates[url + '/type'] = data.type;
    updates[url + '/watches'] = storedTime++

    db.ref().update(updates)
}

if(location.hostname.indexOf("netflix") !== -1)
    load();
