import {Component} from "react"
import {Button, Input, Form} from "semantic-ui-react"

class Service extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultUri: "https://service.yokunaine.mzyy94.com/api/v1",
            url: "service.yokunaine.mzyy94.com/api/v1",
            modified: false
        }
    }

    componentWillMount() {
        chrome.storage.sync.get("service_uri", ({service_uri}) => {
            if (service_uri === undefined) {
                chrome.storage.sync.set({service_uri: this.state.defaultUri}, () => {})
            } else {
                const [,url] = service_uri.split("//")
                this.setState({url})
            }
        })
    }

    changeText(e) {
        this.setState({url: e.target.value, modified: true})
    }

    updateAction() {
        chrome.storage.sync.set({service_uri: `https://${this.state.url}`}, () => {
            this.setState({modified: false})
        })
    }

    resetAction() {
        this.setState({url: this.state.defaultUri.split("//").pop(), modified: false})
    }

    render() {
        const {url, modified} = this.state
        return (
            <Form.Field>
                <label>Service URL</label>
                <Form.Group inline={true}>
                    <Input label="https://" placeholder="service.yokunaine.example.com" name="url" value={url} onChange={this.changeText.bind(this)} />
                    <Button.Group>
                        <Button disabled={!modified} onClick={this.resetAction.bind(this)}>Cancel</Button>
                        <Button.Or />
                        <Button positive disabled={!modified} onClick={this.updateAction.bind(this)}>Save</Button>
                    </Button.Group>
                </Form.Group>
            </Form.Field>
        )
    }
}

export default Service
