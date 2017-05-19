window.chrome.storage.sync.get(['service_uri', 'token', 'report'], ({ service_uri: url, token, report }) => {
  new Vue({ // eslint-disable-line no-new
    el: 'main',
    data: {
      savedUrl: 'https://service.yokunaine.mzyy94.com/api/v1',
      url,
      token,
      report
    },
    created () {
      if (this.url === undefined) {
        window.chrome.storage.sync.set({service_uri: this.savedUrl}, () => {})
        this.url = this.savedUrl
      } else {
        this.savedUrl = this.url
      }
      if (this.token === undefined) {
        const token = new window.URLSearchParams(window.location.search).get('token')
        if (token) {
          window.chrome.storage.sync.set({token}, () => {
            window.history.replaceState({}, document.title, window.location.pathname)
            this.token = token
          })
        }
      }
    },
    watch: {
      report: (newVal) => {
        window.chrome.storage.sync.set({report: newVal}, () => {})
      }
    },
    methods: {
      save () {
        window.chrome.storage.sync.set({service_uri: this.url}, () => {
          this.savedUrl = this.url
        })
      },
      cancel () {
        this.url = this.savedUrl
      },
      revokeToken () {
        window.fetch(`${this.savedUrl}/auth/token/${this.token}`, {
          method: 'DELETE',
          mode: 'cors'
        })
        .then(() => window.chrome.storage.sync.remove('token', () => {
          this.token = ''
        }))
        .catch((e) => {
          window.alert(e)
        })
      },
      getToken () {
        const callbackUrl = window.chrome.extension.getURL('options.html')
        window.chrome.tabs.getCurrent(cur => {
          window.chrome.tabs.update(cur.id, {url: `${this.savedUrl}/auth?callback=${callbackUrl}`})
        })
      }
    }
  })
})
