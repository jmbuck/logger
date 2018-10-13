import {db} from "../../database/Database";
import {auth} from "../../database/Auth";
import {getWebsiteName} from "../Background";

const networkFilters = {
    urls: [
        "*://*/*"
    ]
};

let dataCollector = [];

function retrieveDetails(details) {
    if(details.statusCode === 200) {
        let data = { url : details.initiator, method : details.method, type : details.type };
        if(details.responseHeaders) {
            for(let i = 0; i < details.responseHeaders.length; i++) {
                if(details.responseHeaders[i].name.toLowerCase() === "content-length")
                    data["size"] = details.responseHeaders[i].value;
                else if(details.responseHeaders[i].name.toLowerCase() === "content-type")
                    data["content-type"] = details.responseHeaders[i].value;
                else if(details.responseHeaders[i].name.toLowerCase() === "date")
                    data["date"] = details.responseHeaders[i].value;
            }
        }
        else
            data["hasHeaders"] = false;

        dataCollector.push(data);
    }
}

chrome.webRequest.onCompleted.addListener(retrieveDetails, networkFilters, ["responseHeaders"]);

function updateFirebaseIntervalData(uid, data) {
    let updates = {};

    let total = {};

    for (let i = 0; i < data.length; i++) {
        let type = data[i].type;
        let size = parseInt(data[i].size);
        if (isNaN(size)) {
            size = 0
        }

        if (!data[i].url) continue;

        let hostname = getWebsiteName(data[i].url);

        if(!hostname) continue;

        let url = '/users/' + uid + '/websites/' + hostname + '/data';

        if(!updates[url + '/' + type])
            updates[url + '/' + type] = 0;

        if(!total[type])
            total[type] = 0;

        updates[url + '/' + type] += size;
        total[type] += size;
    }

    let url = '/users/' + uid + '/data';

    for(let key in total) {
        if(!total.hasOwnProperty(key)) continue;

        updates[url + '/' + key] = total[key];
    }

    for(let key in updates) {
        if(!updates.hasOwnProperty(key)) continue;

        db.ref(key).transaction((value) => {
            return updates[key] + (value ? value : 0);
        });
    }
}

setInterval(() => {
    //check uid not null
    if (auth.currentUser)
        updateFirebaseIntervalData(auth.currentUser.uid, dataCollector);
    dataCollector = [];

}, 5000);