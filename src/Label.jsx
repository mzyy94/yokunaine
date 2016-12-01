import {Component} from "react";

class Label extends Component {
    state={
        liked: false,
        disliked: false,
        count: 0
    }

    componentWillMount() {
        this.setState({liked: !!this.props.liked, disliked: !!this.props.disliked, count: this.props.count || 0})
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
