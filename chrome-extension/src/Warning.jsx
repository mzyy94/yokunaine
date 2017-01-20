import {Component} from "react"

class Warning extends Component {
    render() {
        return (
            <div className="alert alert-danger">
                <i className="fa fa-warning"></i>
                <span>この記事には複数の<b>よくないね</b>がつけられています。</span>
            </div>
        )
    }
}

export default Warning
