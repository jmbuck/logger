function load(evt) {
    var timer = setInterval(retrieveNetflixInfo, 500);

    function retrieveNetflixInfo() {
        if(document.querySelector(".video-title")) {
            const video = document.querySelector(".video-title").querySelector("h4");
            console.log(video.innerHTML);
            console.log(document.querySelector(".button-nfplayerEpisodes"));
            clearInterval(timer);
        }
    }
}

if(location.hostname.indexOf("netflix") !== -1)
    load();
