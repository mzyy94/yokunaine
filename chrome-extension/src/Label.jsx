import {Component} from "react"
import {Store} from "./Store"

class Label extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0
        }
    }

    componentWillMount() {
        Store.subscribe(() => {
            const {count} = Store.getState()
            this.setState({count: count})
        })
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
