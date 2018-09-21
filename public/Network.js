const tabStorage = {};
const networkFilters = {
	urls: [
		"*://developer.mozilla.org/*"
	]
};
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
	console.log(details);
}, networkFilters, ["responseHeaders"]);