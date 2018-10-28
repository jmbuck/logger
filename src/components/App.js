/*global chrome*/
import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router'
import '../css/common.css';
import { withRouter } from 'react-router-dom'

import Main from './Main'
import LoginPanel from "./LoginPanel"
import { auth } from '../database/Auth';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            uid: null
        }
    }

    componentWillMount() {
        auth.onAuthStateChanged((user) => {
            if(user) {
                //Finish Signing in
                this.authHandler(user)
	            this.props.history.push('/data')
            } else {
                //Finish Signing out
                this.setState({
                    data: {},
                    uid: null
                })
                this.props.history.push('/login')
            }
        })
    }

    signedIn = () => {
        return this.state.uid
    };

    signOut = () =>{
        auth
            .signOut()
            .then(() => {
                this.state = {
                    data: {},
                    uid: null
                }
                this.props.history.push('/login')
            })
    };

    authHandler = (user) => {
        this.setState({ uid: user.uid })
    };

    render() {
        return (
            <div className="App">
                <Switch>
                    <Route path="/login" render={(navProps) =>
                        !this.signedIn()
                            ? <LoginPanel {...navProps} />
                            : <Redirect to="/data"/>
                    }/>
                    <Route path="/" render={(navProps) =>
                        this.signedIn()
                            ? <Main {...navProps} signOut={this.signOut} signedIn={this.signedIn}/>
                            : <Redirect to="/login" />
                    }/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(App);
