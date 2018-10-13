import {db} from "../../database/Database"
import {auth} from "../../database/Auth"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.netflix_info) {

    }
    console.log(request, sender);
});