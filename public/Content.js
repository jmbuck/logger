function load(evt) {
    var timer = setInterval(retrieveNetflixInfo, 500);

    function retrieveNetflixInfo() {
        if(document.querySelector(".video-title")) {
            const video = document.querySelector(".video-title").querySelector("h4");
            let type = 1
            if (document.querySelector(".button-nfplayerEpisodes")) {
                type = 0
            }
            chrome.runtime.sendMessage({netflix_info: true, data : {title: video.innerHTML, type: type}});
            clearInterval(timer);
        }
    }
}

window.addEventListener("load", load, false);
