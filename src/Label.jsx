import {Component} from "react";
import {Store} from "./Store";

class Label extends Component {
    state={
        liked: false,
        disliked: false,
        count: 0
    }

    listener = () => {
        const {liked, disliked, count} = Store.getState();
        this.setState({liked: liked, disliked: disliked, count: count})
    }

    componentWillMount() {
        Store.subscribe(this.listener);
    }

    render() {
        const {count} = this.state;
        return (
            <div>
                <div className="itemsShowHeaderStock_count">
                    <span className="fa fa-thumbs-down"></span>
                    <span id="yokunaine-counter">{count}</span>
                </div>
                <div className="itemsShowHeaderStock_countText">よくないね</div>
            </div>
        );
    }
}

export default Label;
