const networkFilters = {
	urls: [
		"*://*/*"
	]
};

let dataCollector = [];

chrome.webRequest.onCompleted.addListener((details) => {
	/*const { tabId, requestId } = details;
	if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
		return;
	}

	const request = tabStorage[tabId].requests[requestId];

	Object.assign(request, {
		endTime: details.timeStamp,
		requestDuration: details.timeStamp - request.startTime,
		status: 'complete'
	});*/
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
}, networkFilters, ["responseHeaders"]);

setInterval(() => {

    //add to database

    dataCollector = [];
}, 5000);