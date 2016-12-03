import {Component} from "react"
import {Store, SET_DISLIKE, UNSET_DISLIKE} from "./Store"

class Button extends Component {

    constructor(props) {
        super(props)
        this.state = Store.getState()
    }

    componentWillMount() {
        Store.subscribe(() => {
            const {liked, disliked} = Store.getState()
            this.setState({liked: liked, disliked: disliked})
        })
    }

    toggleStatus() {
        const {liked, disliked} = this.state
        const [username, itemId] = location.pathname.slice(1).split("/items/")
        if (liked) {
            return
        }
        if (disliked) {
            // HTTP request to server with DELETE method
            chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                fetch(`${service_uri}/${username}/items/${itemId}`, {
                    method: "DELETE",
                    headers: {"Authorization": `Bearer ${token}`}
                })
                .then(response => {
                    if (response.ok) {
                        Store.dispatch({type: UNSET_DISLIKE})
                    }
                })
                .catch(console.error)
            })
        } else {
            // HTTP request to server with POST method
            chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
                fetch(`${service_uri}/${username}/items/${itemId}`, {
                    method: "POST",
                    headers: {"Authorization": `Bearer ${token}`}
                })
                .then(response => {
                    if (response.ok) {
                        Store.dispatch({type: SET_DISLIKE})
                    }
                })
                .catch(console.error)
            })
        }
    }


    render() {
        const {liked, disliked} = this.state
        return (
            <div className="LikeButton DislikeButton">
                <button className={`p-button ${liked ? "disabled" : ""} ${disliked ? "liked" : ""}`} onClick={this.toggleStatus.bind(this)}>
                    <span className={`fa fa-fw ${disliked ? "fa-check" : "fa-thumbs-down"}`}></span>
                    <span>よくないね</span>
                </button>
            </div>
        )
    }
}

export default Button
