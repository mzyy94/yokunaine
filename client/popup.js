document.addEventListener('DOMContentLoaded', function () {
  window.chrome.storage.sync.get(['service_uri'], ({service_uri: uri}) => {
    window.fetch(`${uri}/statistics/dislike`)
    .then(response => response.json())
    .then(json => { document.querySelector('#total').innerText = json.total })
    .catch(console.error)
  })
  document.querySelector("[src='configuration.svg']").addEventListener('click', function () {
    window.chrome.runtime.openOptionsPage()
  })
  window.chrome.storage.sync.get(['service_uri', 'token'], ({service_uri: uri, token}) => {
    if (!uri || !token) {
      window.chrome.runtime.openOptionsPage()
    }
  })
}, false)
