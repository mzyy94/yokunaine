import {Component} from "react";

class Button extends Component {
    state={
        liked: false,
        disliked: false,
        count: 0
    }

    componentWillMount() {
        this.setState({liked: !!this.props.liked, disliked: !!this.props.disliked})
    }

    toggleStatus = () => {
        if (this.state.liked) {
            return;
        }
        const {count, disliked} = this.state;
        if (disliked) {
            this.setState({count: count - 1, disliked: !disliked})
        } else {
            this.setState({count: count + 1, disliked: !disliked})
        }
    }


    render() {
        const {liked, disliked} = this.state;
        return (
            <div className="LikeButton DislikeButton">
                <button className={`p-button ${liked ? "disabled" : ""} ${disliked ? "liked" : ""}`} onClick={this.toggleStatus}>
                    <span className={`fa fa-fw ${disliked ? "fa-check" : "fa-thumbs-down"}`}></span>
                    <span>よくないね</span>
                </button>
            </div>
        );
    }
}

export default Button;
