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
}, false);
