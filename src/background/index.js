/*global chrome*/

import {db} from "../database/Database"
import "./Background"

//sample for timing tabs found here: https://github.com/google/page-timer

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
function updateFirebaseNetflixData(uid, data, timeWatchedNetflix) {
    let updates = {};
    let type = (data.type === 0)? "shows": "movies";

    let url = '/users/' + uid + '/netflix/' + type;
    let ref = db.ref(url);

    let storedWatches = 0;
    let storedTime = 0;
    ref.on("value", function(snapshot) {
        let stored = snapshot.val();
        if (stored) {
            storedWatches = stored.watches;
            storedTime = stored.time
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    updates[url + '/watches'] = ++storedWatches;
    updates[url + '/time'] = storedTime + timeWatchedNetflix;

    db.ref().update(updates).catch((error) => {
        console.log("Error updating Firebase: " + error)
    })
}

