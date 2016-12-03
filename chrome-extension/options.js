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
                        document.querySelector("input").value = token
                    })
                    return
                }
            }
        }
        document.querySelector("button").innerText = "Get Token"
    } else {
        document.querySelector("input").value = token
    }
})

document.querySelector("button").addEventListener("click", (eve) => {
    switch (eve.target.innerText) {
        case "Revoke Token":
            chrome.storage.sync.remove("token", () => {
                document.querySelector("input").value = ""
                document.querySelector("button").innerText = "Get Token"
            })
            break
        case "Get Token":
            const callbackUrl = chrome.extension.getURL("options.html")
            // TODO: Get token from OAuth
            console.log(callbackUrl)
            break
        default:
            throw new Error()
    }
})
