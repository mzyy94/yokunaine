import React from "react"
import ReactDOM from "react-dom"
import Button from "./Button"
import Label from "./Label"
import {Store, INITIAL_STATE, LIKED_STATE} from "./Store"
window.React = React

document.addEventListener("DOMContentLoaded", () => {
    // Label
    const labelWrapper = document.createElement("li")
    const statusList = document.querySelector("ul.list-unstyled.itemsShowHeaderStock_statusList")

    labelWrapper.id = "dislike-label"
    statusList.insertBefore(labelWrapper, statusList.children[1])

    ReactDOM.render(
        <Label />,
        document.getElementById("dislike-label")
    )

    // Like button
    const likeButton = document.querySelector(".ArticleMainHeader .js-likebutton")
    if (!likeButton) { // not my self post
        return
    }
    likeButton.addEventListener("click", (eve) => {
        Store.dispatch({type: LIKED_STATE, data: !eve.target.classList.contains("liked")})
    })
    Store.dispatch({type: LIKED_STATE, data: JSON.parse(likeButton.attributes["data-props"].value).like_status})
    Store.subscribe(() => {
        const {disliked} = Store.getState()
        if (disliked) {
            likeButton.querySelector("button").classList.add("disabled")
        } else {
            likeButton.querySelector("button").classList.remove("disabled")
        }
    })


    // Dislike button
    const buttonWrapper = document.createElement("div")
    const userList = document.querySelector(".list-inline.ArticleMainHeader__users")

    buttonWrapper.id = "dislike-button"
    userList.parentNode.insertBefore(buttonWrapper, userList)

    ReactDOM.render(
        <Button />,
        document.getElementById("dislike-button")
    )
}, false)


chrome.storage.sync.get(["service_uri", "token"], ({service_uri, token}) => {
    fetch(`${service_uri}${location.pathname}`, {
        headers: {"Authorization": `Bearer ${token}`}
    })
    .then(response => response.json())
    .then(status => Store.dispatch({type: INITIAL_STATE, data: status}))
    .catch(console.error)
})
