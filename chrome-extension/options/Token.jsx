import {Component} from "react"

class Token extends Component {

    constructor(props) {
        super(props)
        this.state = {
            token: ""
        }
    }

    componentWillMount() {
        chrome.storage.sync.get("token", ({token}) => {
            if (token === undefined) {
                if (location.search) {
                    const queries = location.search.slice(1).split("&")
                    for (const query of queries) {
                        if (query.search(/^token=/) === 0) {
                            const token = query.split("=")[1]
                            if (!token) {
                                continue
                            }
                            chrome.storage.sync.set({token}, () => {
                                this.setState({token})
                            })
                            return
                        }
                    }
                }
            } else {
                this.setState({token})
            }
        })
    }

    tokenAction() {
        if (this.state.token) {
            chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                fetch(`${service_uri}/auth/token/${token}`, {
                    method: "DELETE"
                })
                .then(() => chrome.storage.sync.remove("token", () => {
                    this.setState({token: ""})
                }))
                .catch((e) => {
                    alert(`Failed to send revoke request.`)
                })
            })
        } else {
            const callbackUrl = chrome.extension.getURL("options.html")
            chrome.storage.sync.get("service_uri", ({service_uri}) => {
                chrome.tabs.getCurrent(cur => {
                    chrome.tabs.update(cur.id, {url: `${service_uri}/auth?callback=${callbackUrl}`})
                })
            })
        }
    }

    render() {
        const {token} = this.state
        return (
            <fieldset name="token">
                <label htmlFor="token">Token:</label>
                <input type="text" name="token" value={token} disabled />
                <button name="token" onClick={this.tokenAction.bind(this)}>
                    {token ? "Revoke Token" : "Get Token"}
                </button>
            </fieldset>

        )
    }
}

export default Token
