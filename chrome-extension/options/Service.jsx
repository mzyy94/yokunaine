import {Component} from "react"

class Service extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultUri: "http://localhost:3000/api/v1",
            uri: "http://localhost:3000/api/v1",
            modified: false
        }
    }

    componentWillMount() {
        chrome.storage.sync.get("service_uri", ({service_uri}) => {
            if (service_uri === undefined) {
                chrome.storage.sync.set({service_uri: this.state.defaultUri}, () => {})
            } else {
                this.setState({uri: service_uri})
            }
        })
    }

    changeText(e) {
        this.setState({uri: e.target.value, modified: true})
    }

    updateAction() {
        chrome.storage.sync.set({service_uri: this.state.uri}, () => {
            this.setState({modified: false})
        })
    }

    resetAction() {
        this.setState({uri: this.state.defaultUri, modified: false})
    }

    render() {
        const {uri, modified} = this.state
        return (
            <fieldset name="service">
                <label htmlFor="uri">Service URL:</label>
                <input type="text" name="uri" value={uri} onChange={this.changeText.bind(this)} />
                <button name="update" disabled={!modified} onClick={this.updateAction.bind(this)}>Update</button>
                <button name="reset" disabled={!modified} onClick={this.resetAction.bind(this)}>Reset</button>
            </fieldset>
        )
    }
}

export default Service
