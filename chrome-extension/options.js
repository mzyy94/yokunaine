document.addEventListener("DOMContentLoaded", () => {
    const defaultUri = "http://localhost:3000/api/v1"
    const $ = document.querySelector.bind(document)

    // Service URL setting

    chrome.storage.sync.get("service_uri", ({service_uri}) => {
        if (service_uri === undefined) {
            chrome.storage.sync.set({service_uri: defaultUri}, () => {
                $("input[name=uri]").value = defaultUri
            })
        } else {
            $("input[name=uri]").value = service_uri
        }
    })

    $("button[name=reset]").addEventListener("click", (eve) => {
        chrome.storage.sync.set({service_uri: defaultUri}, () => {
            $("input[name=uri]").value = defaultUri
            $("button[name=update]").disabled = true
            $("button[name=token]").disabled = false
        })
    }, false)

    $("button[name=update]").addEventListener("click", (eve) => {
        chrome.storage.sync.set({service_uri: $("input[name=uri]").value}, () => {
            $("button[name=update]").disabled = true
            $("button[name=token]").disabled = false
        })
    }, false)

    $("input[name=uri]").addEventListener("input", (eve) => {
        $("button[name=update]").disabled = false
        $("button[name=token]").disabled = true
    }, false)


    // Token setting

    chrome.storage.sync.get("token", ({token}) => {
        if (token === undefined) {
            if (location.search) {
                const queries = location.search.replace(/^\?/, "").split("&")
                for (const query of queries) {
                    if (query.search(/^token=/) === 0) {
                        const token = query.split("=")[1]
                        if (!token) {
                            continue
                        }
                        chrome.storage.sync.set({token: token}, () => {
                            $("input[name=token]").value = token
                        })
                        return
                    }
                }
            }
            $("button[name=token]").innerText = "Get Token"
        } else {
            $("input[name=token]").value = token
        }
    })

    $("button[name=token]").addEventListener("click", (eve) => {
        switch (eve.target.innerText) {
            case "Revoke Token":
                chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                    fetch(`${service_uri}/auth/token/${token}`, {
                        method: "DELETE"
                    })
                    .then(() => chrome.storage.sync.remove("token", () => {
                        $("input[name=token]").value = ""
                        eve.target.innerText = "Get Token"
                    }))
                    .catch((e) => {
                        alert(`Failed to send revoke request.`)
                    })
                })
                break
            case "Get Token":
                const callbackUrl = chrome.extension.getURL("options.html")
                chrome.storage.sync.get("service_uri", ({service_uri}) => {
                    chrome.tabs.getCurrent(cur => {
                        chrome.tabs.update(cur.id, {url: `${service_uri}/auth?callback=${callbackUrl}`})
                    })
                })
                break
            default:
                throw new Error()
        }
    }, false)
}, false)
