new Vue({
	el: "section",
	data: {
		savedUrl: "https://service.yokunaine.mzyy94.com/api/v1",
		url: "https://service.yokunaine.mzyy94.com/api/v1",
		token: ""
	},
	created() {
		chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
			if (service_uri === undefined) {
				chrome.storage.sync.set({service_uri: this.savedUrl}, () => {})
			} else {
				this.url = service_uri
				this.savedUrl = service_uri
			}
			if (token === undefined) {
				const token = location.search.slice(1).split("&")
				.filter(query => query.startsWith("token="))
				.map(param => param.split("=").pop())
				.reduce((first, second) => first || second, "")
				if (token) {
					chrome.storage.sync.set({token}, () => {
						history.replaceState({}, document.title, location.pathname)
						this.token = token
					})
				}
			} else {
				this.token = token
			}
		})
	},
	methods: {
		save() {
			chrome.storage.sync.set({service_uri: this.url}, () => {
				this.savedUrl = this.url
			})
		},
		cancel() {
			this.url = this.savedUrl
		},
		revokeToken() {
			fetch(`${this.savedUrl}/auth/token/${this.token}`, {
				method: "DELETE",
				mode: "cors"
			})
			.then(() => chrome.storage.sync.remove("token", () => {
				this.token = ""
			}))
			.catch((e) => {
				alert(e)
			})
		},
		getToken() {
			const callbackUrl = chrome.extension.getURL("options.html")
			chrome.tabs.getCurrent(cur => {
				chrome.tabs.update(cur.id, {url: `${this.savedUrl}/auth?callback=${callbackUrl}`})
			})
		}
	}
})
