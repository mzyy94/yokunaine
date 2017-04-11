document.addEventListener("DOMContentLoaded", function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://service.yokunaine.mzyy94.com/api/v1/statistics/dislike", true);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		if (xhr.status === 200) {
			document.getElementById("total").innerText = xhr.response.total;
		}
	}
	xhr.send();

	var dlLink = document.getElementById("download");
	if (window.chrome && chrome.webstore && typeof chrome.webstore.install === "function") {
		dlLink.addEventListener("click", function() {
			chrome.webstore.install();
		}, false);
	} else {
		dlLink.href = "https://chrome.google.com/webstore/detail/fceocghaogpidgglkglhdadcaechdeln";
	}
}, false);
