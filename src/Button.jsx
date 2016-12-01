import {Component} from "react";
import {Store, SET_DISLIKE, UNSET_DISLIKE} from "./Store";

class Button extends Component {
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

    toggleStatus = () => {
        if (this.state.liked) {
            return;
        }
        const {count, disliked} = this.state;
        if (disliked) {
            // TODO: HTTP request to server with DELETE method
            Store.dispatch({type: UNSET_DISLIKE});
        } else {
            // TODO: HTTP request to server with POST method
            Store.dispatch({type: SET_DISLIKE});
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
