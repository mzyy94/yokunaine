import React from "react";
import ReactDOM from "react-dom";
import Button from "./Button";
import Label from "./Label";
window.React = React;


// Button
const buttonWrapper = document.createElement("div");
const userList = document.querySelector(".list-inline.ArticleMainHeader__users");

buttonWrapper.id = "dislike-button";
userList.parentNode.insertBefore(buttonWrapper, userList);

ReactDOM.render(
  <Button disliked={true} />,
  document.getElementById("dislike-button")
);


// Label
const labelWrapper = document.createElement("li");
const statusList = document.querySelector("ul.list-unstyled.itemsShowHeaderStock_statusList");

labelWrapper.id = "dislike-label";
statusList.insertBefore(labelWrapper, statusList.children[1])

ReactDOM.render(
  <Label count={100} />,
  document.getElementById("dislike-label")
);
