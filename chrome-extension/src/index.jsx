import React from "react"
import ReactDOM from "react-dom"
import Button from "./Button"
import Label from "./Label"
import {Store, INITIAL_STATE, LIKED_STATE} from "./Store"
window.React = React

// Like button
const likeButton = document.querySelector(".ArticleMainHeader .LikeButton > button")
if (likeButton) { // not my self post
    likeButton.addEventListener("click", (eve) => {
        Store.dispatch({type: LIKED_STATE, data: !likeButton.classList.contains("liked")})
    })
    Store.dispatch({type: LIKED_STATE, data: likeButton.classList.contains("liked")})
    Store.subscribe(() => {
        const {disliked} = Store.getState()
        if (disliked) {
            likeButton.classList.add("disabled")
        } else {
            likeButton.classList.remove("disabled")
        }
    })


    // Button
    const buttonWrapper = document.createElement("div")
    const userList = document.querySelector(".list-inline.ArticleMainHeader__users")

    buttonWrapper.id = "dislike-button"
    userList.parentNode.insertBefore(buttonWrapper, userList)

    ReactDOM.render(
        <Button />,
        document.getElementById("dislike-button")
    )
}


// Label
const labelWrapper = document.createElement("li")
const statusList = document.querySelector("ul.list-unstyled.itemsShowHeaderStock_statusList")

labelWrapper.id = "dislike-label"
statusList.insertBefore(labelWrapper, statusList.children[1])

ReactDOM.render(
    <Label />,
    document.getElementById("dislike-label")
)

chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
    const [username, itemId] = location.pathname.slice(1).split("/items/")
    fetch(`${service_uri}/${username}/items/${itemId}`, {
        headers: {"Authorization": `Bearer ${token}`}
    })
    .then(response => response.json())
    .then(status => Store.dispatch({type: INITIAL_STATE, data: status}))
    .catch(console.error)
})
