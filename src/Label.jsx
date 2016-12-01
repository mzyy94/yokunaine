import {Component} from "react"
import {Store} from "./Store"

class Label extends Component {
    state = {
        count: 0
    }

    listener = () => {
        const {count} = Store.getState()
        this.setState({count: count})
    }

    componentWillMount() {
        Store.subscribe(this.listener)
    }

    render() {
        const {count} = this.state
        return (
            <div>
                <div className="itemsShowHeaderStock_count">
                    <span className="fa fa-thumbs-down"></span>
                    <span id="yokunaine-counter">{count}</span>
                </div>
                <div className="itemsShowHeaderStock_countText">よくないね</div>
            </div>
        )
    }
}

export default Label
