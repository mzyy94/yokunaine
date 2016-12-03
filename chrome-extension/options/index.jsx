import React from "react"
import ReactDOM from "react-dom"
import Service from "./Service"
import Token from "./Token"
window.React = React

ReactDOM.render(
    <form onSubmit={e => e.preventDefault()}>
        <Service />
        <Token />
    </form>,
    document.getElementById("form")
)
