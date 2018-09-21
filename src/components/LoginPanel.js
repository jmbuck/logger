import React, { Component } from 'react'
import '../css/common.css'
import * as firebaseIntegration from "../js/credentials"
import {googleProvider, auth, db} from "../rebase";

class LoginPanel extends Component {

    authenticate = (provider) => {
        auth.signOut().then(() => {
            auth.signInWithPopup(provider)
            firebaseIntegration.startSignIn(auth, this.redirect)
        })
    }

    redirect = () => {
        console.log('here2')
        this.props.history.push('/data')
    }

    sendTestData = () => {
        db.ref('users/' + auth.currentUser.displayName).set({
            username: auth.currentUser.displayName
        });
    }

    render = () => {

        return (<div className="panel">
                <div className="panel-container">
                    <div className="panel-login">
                        <div className="SignIn">
                            <div className="main-content">
                                <button id="quickstart-button" onClick={() => this.authenticate(googleProvider)}>Sign in with Google</button>
                                <button id="quickstart-test-send" onClick={() => this.sendTestData()}>Test send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
    }
}

export default LoginPanel