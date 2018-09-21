/*global chrome*/
import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router'
import '../css/common.css';
import Navbar from './Navbar'

import PreferencePanel from "./PreferencePanel"
import FilterPanel from "./FilterPanel"
import DeleteAccountPanel from "./DeleteAccountPanel"
import WebsitePanel from "./WebsitePanel"
import NetflixPanel from "./NetflixPanel"
import RedditPanel from "./RedditPanel"
import DataPanel from './DataPanel'
import LoginPanel from "./LoginPanel";

import base, {auth} from '../rebase'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        auth.onAuthStateChanged(
            (user) => {
                if(user) {
                    //Finish Signing in
                    this.setState({isSignedIn: true})
                    this.authHandler(user)
                } else {
                    //Finish Signing out
                    this.setState({ })
                }
            }
        )
    }

    syncData = () => {
        this.ref = base.syncState(
            `data/${this.state.uid}`,
            {
                context: this,
                state: 'data',
            }
        )
    }

    stopSyncing = () => {
        if(this.ref) {
            base.removeBinding(this.ref)
        }
    }

    signOut = () =>{
        auth
            .signOut()
            .then(() => {
                this.stopSyncing()
                this.setState({ data: {} })
            })
    }

    authHandler = (user) => {
        this.setState({ uid: user.name }, this.syncData)
    }

    render() {
        return (
            <div className="App">
            <Navbar {...this.props} />
            <Switch>
                <Route path='/data' render={(navProps) => <DataPanel {...navProps} />}/>
                <Route path='/preferences' render={(navProps) => <PreferencePanel {...navProps} />}/>
                <Route path='/filters' render={(navProps) => <FilterPanel {...navProps} />}/>
                <Route path='/deleteaccount' render={(navProps) => <DeleteAccountPanel {...navProps} />}/>
                <Route path='/websites' render={(navProps) => <WebsitePanel {...navProps} />}/>
                <Route path='/netflix' render={(navProps) => <NetflixPanel {...navProps} />}/>
                <Route path='/reddit' render={(navProps) => <RedditPanel {...navProps} />}/>
                <Route path='/login' render={(navProps) => <LoginPanel {...navProps} />}/>
                <Route path='/' render={(navProps) => <Redirect to='/data' />}/>
            </Switch>
            </div>
        );
    }
}

export default App;
