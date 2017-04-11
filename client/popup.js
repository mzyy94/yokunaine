document.addEventListener("DOMContentLoaded", function() {
	chrome.storage.sync.get(["service_uri"], ({service_uri}) => {
		fetch(`${service_uri}/statistics/dislike`)
		.then(response => response.json())
		.then(json => document.querySelector("#total").innerText = json.total)
		.catch(console.error)
	})
	document.querySelector("[src='configuration.svg']").addEventListener('click', function() {
		chrome.runtime.openOptionsPage()
	})
	chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
		if (!service_uri || !token) {
			chrome.runtime.openOptionsPage()
		}
	})
}, false);
