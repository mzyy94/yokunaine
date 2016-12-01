import React from "react";
import ReactDOM from "react-dom";
import Button from "./Button";
import Label from "./Label";
import {Store, INITIAL_STATE} from "./Store";
window.React = React;


// Button
const buttonWrapper = document.createElement("div");
const userList = document.querySelector(".list-inline.ArticleMainHeader__users");

buttonWrapper.id = "dislike-button";
userList.parentNode.insertBefore(buttonWrapper, userList);

ReactDOM.render(
  <Button />,
  document.getElementById("dislike-button")
);


// Label
const labelWrapper = document.createElement("li");
const statusList = document.querySelector("ul.list-unstyled.itemsShowHeaderStock_statusList");

labelWrapper.id = "dislike-label";
statusList.insertBefore(labelWrapper, statusList.children[1])

ReactDOM.render(
  <Label />,
  document.getElementById("dislike-label")
);

//fetch(`https://yokunaine.com/item/${id}`)
// Sample values
Promise.resolve({disliked: Math.random() < 0.5, count: (Math.random() * 100) | 0})
.then(status => Store.dispatch({type: INITIAL_STATE, data: status}))
.catch(console.error)
