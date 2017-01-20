import {Component} from "react"
import {Store} from "./Store"

class Warning extends Component {
    constructor(props) {
        super(props)
        this.state = Store.getState()
    }

    componentWillMount() {
        Store.subscribe(() => {
            const {count} = Store.getState()
            this.setState({count: count})
        })
    }

    render() {
        const {count} = this.state
        if (count < 2) {
            return <div></div>
        }
        return (
            <div className="alert alert-danger">
                <i className="fa fa-warning"></i>
                <span>この記事には複数の<b>よくないね</b>がつけられています。</span>
            </div>
        )
    }
}

export default Warning
