import React from "react"
import ReactDOM from "react-dom"
import Service from "./Service"
import Token from "./Token"
import {Form} from "semantic-ui-react"
window.React = React

ReactDOM.render(
    <Form onSubmit={e => e.preventDefault()}>
        <Service />
        <Token />
    </Form>,
    document.getElementById("form")
)
