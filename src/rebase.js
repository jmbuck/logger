import {auth, googleAuth} from "./database/Auth.js";
import {db, on} from "./database/Database.js";
import {update} from "./database/Database"

function msToString(time) {
    let seconds = Math.floor(time / 1000) % 60;
    let minutes = Math.floor(time / 1000 / 60) % 60;
    let hours = Math.floor(time / 1000 / 60 / 24);

    return (hours >= .9 ? `${hours} hours ` : '') + (minutes >= .9 ? `${minutes} minutes ` : '') + (seconds >= .9 ? `${seconds} seconds` : '');
}

/*
    Returns array data as:
    [
        "Channel1": {
            timeWatched: int
        },
        "Channel2": {
            timeWatched: int
        }
    ]
 */
export function retrieveFirebaseUserYoutubeVideoData(uid, callback) {
    on(`/users/${uid}/youtube`, (snapshot) => {
        let arr = [];
        snapshot.forEach((child) => {
            arr.push({name: child.key, time: child.val().timeWatched});
        })

        callback(arr);
    });
}

export function retrieveFirebaseWebsites(uid, callback) {
    on(`/users/${uid}/filters/data`, (snapshot) => {
	    let arr = [];

	    snapshot.forEach((child) => {
		    arr.push(child.key);
	    })

	    callback(arr);
    });
}

export function retrieveFirebaseWebsitesBlacklist(uid, callback) {
    on(`/users/${uid}/filters/blacklist`, (snapshot) => {
	    let arr = [];

	    snapshot.forEach((child) => {
		    arr.push(child.key);
	    });

	    callback(arr);
    });
}

export function retrieveFirebaseWebsitesSettings(uid, callback) {
    on(`/users/${uid}/filters/data`, (snapshot) => {
        callback(snapshot.toJSON());
    });
}

export function retrieveFirebaseUserData(uid, callback) {
    const colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];

    on(`/users/${uid}/data`, (snapshot) => {
        let data;
        let labels = [];
        let dataUsage = [];
        snapshot.forEach((child) => {
            labels.push(child.key)
            dataUsage.push(child.val())
        });
        data = {
            labels: labels,
            datasets: [{
                label: "Data usage",
                backgroundColor: colors,
                data: dataUsage,
            }]
        };
        callback(data);
    });
}

export function retrieveFirebaseUserRedditData(uid, callback) {
    let url = `/users/${uid}/reddit`

    db.ref(url).on("value", (snapshot) => {
        let arr = [];
        snapshot.forEach((child) => {
            arr.push({name: child.key, time: msToString(child.val().time)});
        });
        callback(arr);
    }, (error) => console.log("The read failed: " + error.code));
}

export function retrieveFirebaseWebsiteData(uid, callback) {
    on(`/users/${uid}/websites`, (snapshot) => {
        let arr = [];
        snapshot.forEach((child) => {
            const json = child.val();
            let data = 0;
            for(let dataType in json.data) {
                if(!json.data.hasOwnProperty(dataType)) continue;
                    data += json.data[dataType];
            }

            arr.push({name: child.key, time: msToString(json.time), visits: json.visits, data: data, category: json.category ? json.category : "not specified"});
        });
        callback(arr);
    });
}

export function retrieveFirebaseWebsitesData(uid, callback) {
    const colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];

    on(`/users/${uid}/websites`, (snapshot) => {
        let i = 0;

        let names = [];
        let dataTypes = {};

        snapshot.forEach((child) => {
            if(i < 6) {
                const jsonData = child.val().data;

                names.push(child.key);

                for(let dataType in jsonData) {
                    if(!jsonData.hasOwnProperty(dataType)) continue;

                    if(!dataTypes[dataType])
                        dataTypes[dataType] = [0, 0, 0, 0, 0, 0];

                    dataTypes[dataType][i] = jsonData[dataType];
                }

                i++;
            }
        });
        i = 0;
        callback({
            datasets : Object.entries(dataTypes).map((type) => {
                return {
                    label: type[0],
                    backgroundColor: colors[i++],
                    data: type[1]
                }
            }),
            labels : names
        });
    })
}

export function retrieveFirebaseNetflixData(uid, callback) {
    on(`/users/${uid}/netflix`, (snapshot) => {
        const json = snapshot.toJSON();
        if (json != null) {
            callback({
                timeTV: msToString(json["shows"].time),
                visitsTV: json["shows"].watches,
                timeMovies: msToString(json["movies"].time),
                visitsMovies: json["movies"].watches
            })
        }
    });
}

export function postFirebaseWebsiteFilter(uid, website) {
    let url = `/users/${uid}/filters/blacklist/${website}`;

    let updates = {};
    updates[url] = true

    update(updates)
}

export function postFirebaseWebsiteSettings(uid, website, settings) {
    let url = `/users/${uid}/filters/data/${website}`;

    let updates = {};

    updates[url] = settings;

    update(updates);
}

