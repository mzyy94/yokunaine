new Vue({ // eslint-disable-line no-new
  el: 'section',
  data: {
    savedUrl: 'https://service.yokunaine.mzyy94.com/api/v1',
    url: 'https://service.yokunaine.mzyy94.com/api/v1',
    token: '',
    report: false
  },
  created () {
    window.chrome.storage.sync.get(['service_uri', 'token', 'report'], ({service_uri: uri, token, report}) => {
      if (uri === undefined) {
        window.chrome.storage.sync.set({service_uri: this.savedUrl}, () => {})
      } else {
        this.url = uri
        this.savedUrl = uri
      }
      if (token === undefined) {
        const token = new window.URLSearchParams(window.location.search).get('token')
        if (token) {
          window.chrome.storage.sync.set({token}, () => {
            window.history.replaceState({}, document.title, window.location.pathname)
            this.token = token
          })
        }
      } else {
        this.token = token
      }
      this.report = report
    })
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
