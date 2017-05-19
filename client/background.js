window.chrome.runtime.onInstalled.addListener(details => {
  const getMinorVer = (version) => parseInt(version.split('.')[1], 10)
  if (details.reason === 'update' &&
    getMinorVer(details.previousVersion) < getMinorVer(window.chrome.runtime.getManifest().version)) {
    window.chrome.browserAction.setBadgeText({text: 'new'})
  } else if (details.reason === 'install') {
    window.chrome.runtime.openOptionsPage()
  }
})
