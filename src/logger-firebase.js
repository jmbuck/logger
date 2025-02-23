import {db, on, once, update} from "./database/Database"
import {auth, googleAuth} from "./database/Auth"

export function msToString(totalTime) {
    let milliseconds = totalTime
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60
    let days = Math.floor(hours / 24)
    hours = hours % 24
    let output = ""
    if(days) output += `${days} ${days === 1 ? 'day' : 'days'}, `
    if(hours) output += `${hours} ${hours === 1 ? 'hour' : 'hours'}, `
    if(minutes) output += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, `
    if(seconds) {
      output += `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
    } else {
      //Cut out ending comma and space
      output = output.substr(0, output.length-2)
    }
    return output
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
            const json = child.val();
            arr.push({id: child.key, name: json.name, time: json.time, visits: json.visits});
        });

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
        let arr = {}
        snapshot.forEach((child) => {
            arr[child.key] = child.val()
        })
        callback(arr)
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

            arr.push({name: child.key, time: json.time, visits: json.visits, timestamp: json.timestamp, data: data, month: json.month, category: json.category ? json.category : undefined});
        });
        callback(arr);
    });
}

export function retrieveDefaultCategories(websites, callback) {
    once(`/global/websites`, (snapshot) => {
        let arr = {};
        snapshot.forEach((child) => {
            if(!websites.includes(child.key)) return;

            const json = child.val();
            let category = "other";

            if(json.category) {
                for(let key in json.category) {
                    if(!json.category.hasOwnProperty(key)) continue;

                    if(!json.category[category] || json.category[category] < json.category[key])
                        category = key;
                }
            }

            arr[child.key] = category;
        });
        callback(arr);
    });
}

export function setWebsiteCategory(uid, website, category) {

    if(category.length === 0) {
        let url = `/users/${uid}/websites/${website}/category`
        let updates = {}

        updates[url] = 'other'

        update(updates);

        db.ref(`/global/websites/${website}/category/other`).transaction((value) => {
            return 1 + (value ? value : 0);
        });
    }
    else {
        let url = `/users/${uid}/websites/${website}/category`
        let updates = {}

        updates[url] = category

        update(updates);

        db.ref(`/global/websites/${website}/category/${category}`).transaction((value) => {
            return 1 + (value ? value : 0);
        });
    }
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

        let json = snapshot.toJSON();

        if(json) {
            let sixJson = Object.keys(json).sort((website1, website2) => {
                let dataTotal1 = 0;
                let dataTotal2 = 0;
                for(let data in json[website1].data) {
                    if(!json[website1].data.hasOwnProperty(data)) continue;

                    dataTotal1 += json[website1].data[data];
                }

                for(let data in json[website2].data) {
                    if(!json[website2].data.hasOwnProperty(data)) continue;

                    dataTotal2 += json[website2].data[data];
                }

                return dataTotal2 - dataTotal1;
            });

            sixJson = sixJson.slice(0, 6).map((website) => {
                return { name: website, data: json[website].data }
            });

            for(i = 5; i > -1; i--)
            {
                names.push(sixJson[i].name);

                for (let dataType in sixJson[i].data)
                {
                    if (! sixJson[i].data.hasOwnProperty(dataType)) continue;

                    if (! dataTypes[dataType])
                        dataTypes[dataType] = [0, 0, 0, 0, 0, 0];

                    dataTypes[dataType][i] = sixJson[i].data[dataType];
                }
            }
        }

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

export function retrieveFirebaseWebsiteSettings(uid, callback) {
    let settings = {}
    on(`/users/${uid}/filters/data`, (snapshot) => {
        snapshot.forEach( (child) => {
            let key = child.key
            const json = child.val()
            let childJson = {
                data: (json.data !== undefined)? json.data: true,
                time: (json.time !== undefined)? json.time: true,
                visits: (json.visits !== undefined)? json.visits: true,
                timestamp: (json.timestamp !== undefined)? json.timestamp: true,
                timeLimit: (json.timeLimit)? json.timeLimit: -1,
                warningMessage: (json.warningMessage)? json.warningMessage: "Warning message for time limit"
            }
            settings[key] = childJson
        });
        callback(settings)
    });
}

export function retrieveFirebaseNetflixData(uid, callback) {
    on(`/users/${uid}/netflix`, (snapshot) => {
        const json = snapshot.toJSON();
        if (json != null) {
            callback({
                timeTV: json.show && json.show.time ? msToString(json["show"].time) : "",
                visitsTV: json.show && json.show.time ? json["show"].visits : "",
                timeMovies: json.movie && json.movie.time ? msToString(json["movie"].time) : "",
                visitsMovies: json.movie && json.movie.visits ? json["movie"].visits : ""
            })
        }
    });
}

export function retrieveTopNetflix(callback) {
    db.ref(`/global/netflix`).orderByChild("time").limitToLast(10).once("value", (snapshot) => {
        let arr = [];
        const json = snapshot.toJSON();
        for(let key in json) {
            if(!json.hasOwnProperty(key)) continue;

            arr.push(json[key]);
        }
        arr.sort((t, t1) => t1.time - t.time);
        callback({topShows: arr.map((t) => t.title)});
    })
}

export function retrieveTopWebsites(callback) {
    db.ref("/global/websites").orderByChild("time").limitToLast(10).once("value", (snapshot) => {
        let arr = [];
        const json = snapshot.toJSON();
        for(let key in json) {
            if(!json.hasOwnProperty(key)) continue;

            arr.push(key);
        }
        arr.sort((t, t1) => json[t1].time - json[t].time);
        callback({topSites: arr});
    });
}

export function retrieveTopSubreddits(callback) {
    db.ref("/global/reddit").orderByChild("time").limitToLast(10).once("value", (snapshot) => {
        let arr = [];

        const json = snapshot.toJSON();
        for(let key in json) {
            if(!json.hasOwnProperty(key)) continue;

            arr.push(key);
        }
        arr.sort((t, t1) => json[t1].time - json[t].time);
        callback({topSubreddits: arr});
    })
}

export function retrieveTopYoutubeChannels(callback) {
    db.ref("/global/youtube").orderByChild("time").limitToLast(10).once("value", (snapshot) => {
        let arr = [];

        const json = snapshot.toJSON();
        for(let key in json) {
            if(!json.hasOwnProperty(key)) continue;

            arr.push(json[key]);
        }
        arr.sort((t, t1) => t1.time - t.time);
        callback({topChannels: arr.map((t) => t.name)});
    })
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

export function deleteFirebaseAccount() {
    const user = auth.currentUser;
    const provider = googleAuth;

    user.reauthenticateWithPopup(provider).then((result) => {
        var token = result.credential.accessToken;
        var currUser = result.user;

        deleteFirebaseAllWebsites(currUser.uid);
        deleteFirebaseAllReddit(currUser.uid);
        deleteFirebaseAllYoutube(currUser.uid);

        let url = `/users/${currUser.uid}`
        let updates = {}
        updates[url] = null
        update(updates)

        currUser.delete().then(() => {
            console.log("User deleted: ", currUser)
            this.props.history.push('/login')
        }).catch(function(error) {
            console.log("User not deleted: ", error)
        });

    }).catch( (error) => {
        var errorCode = error.code;
        var errorMessage = error.onmessageerror;
        var email = error.email;
        var credential = error.credential;
    });
}

export function deleteFirebaseAllWebsites(uid) {
    on(`/users/${uid}/websites`, (snapshot) => {
        snapshot.forEach((child) => {
            const json = child.val();
            db.ref(`/global/websites/${child.key}/time`).transaction((value) => {
                if (json.time) {
                    return (value ? value : json.time) - json.time;
                }
            })
            db.ref(`/global/websites/${child.key}/visits`).transaction((value) => {
                if (json.visits) {
                    return (value ? value : json.visits) - json.visits;
                }
            })
        });
    });

    let url = `/users/${uid}/websites`
    let url2 = `/users/${uid}/filters/data`
    let updates = {}

    updates[url] = null
    updates[url2] = null

    update(updates);
}

export function deleteFirebaseAllReddit(uid) {
    on(`/users/${uid}/reddit`, (snapshot) => {
        snapshot.forEach((child) => {
            const json = child.val();

            db.ref(`/global/reddit/${child.key}/time`).transaction((value) => {
                if (json.time) {
                    return (value ? value : json.time) - json.time;
                }
            })
            db.ref(`/global/reddit/${child.key}/visits`).transaction((value) => {
                if (json.visits) {
                    return (value ? value : json.visits) - json.visits;
                }
            })
        });
    });

    let url = `/users/${uid}/reddit`
    let updates = {}

    updates[url] = null

    update(updates);
}

export function deleteFirebaseAllYoutube(uid) {
    on(`/users/${uid}/youtube`, (snapshot) => {
        snapshot.forEach((child) => {
            const json = child.val();

            db.ref(`/global/youtube/${child.key}/time`).transaction((value) => {
                if (json.time) {
                    return (value ? value : json.time) - json.time;
                }
            })
            db.ref(`/global/youtube/${child.key}/visits`).transaction((value) => {
                if (json.visits) {
                    return (value ? value : json.visits) - json.visits;
                }
            })
        });
    });

    let url = `/users/${uid}/youtube`
    let updates = {}

    updates[url] = null

    update(updates);
}

export function deleteFirebaseWebsite(uid, website) {
    let url = `/users/${uid}/websites/${website}`
    let url2 = `/users/${uid}/filters/data/${website}`
    let updates = {}

    updates[url] = null
    updates[url2] = null

    update(updates);
}

export function deleteFirebaseRedditData(uid, subreddit) {
    let url = `/users/${uid}/reddit/${subreddit}`
    let updates = {}

    updates[url] = null

    update(updates);
}

export function deleteFirebaseYoutubeData(uid, channel) {
    let url = `/users/${uid}/youtube/${channel}`
    let updates = {}

    updates[url] = null

    update(updates);
}
