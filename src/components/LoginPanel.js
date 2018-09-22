import React, { Component } from 'react'
import '../css/common.css'
import {googleProvider, auth} from "../rebase";

class LoginPanel extends Component {

    authenticate = (provider) => {
        auth.signOut().then(() => {
            auth.signInWithPopup(provider).then(() => {
                this.props.history.push('/data')
            })
        })
    }

    render = () => {

        return (<div className="panel">
                <div className="panel-container">
                    <div className="panel-login">
                        <div className="SignIn">
                            <div className="main-content">
                                <button id="quickstart-button" onClick={() => this.authenticate(googleProvider)}>Sign in with Google</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
    }
}

export default LoginPanel