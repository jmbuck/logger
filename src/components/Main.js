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
import YoutubePanel from './YoutubePanel'
import LoginPanel from "./LoginPanel"

class Main extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Main">
            <Navbar {...this.props} signOut={this.props.signOut} />
            <Switch>
                <Route path='/data' render={(navProps) => <DataPanel {...navProps} />}/>
                <Route path='/preferences' render={(navProps) => <PreferencePanel {...navProps} />}/>
                <Route path='/filters' render={(navProps) => <FilterPanel {...navProps} />}/>
                <Route path='/deleteaccount' render={(navProps) => <DeleteAccountPanel {...navProps} />}/>
                <Route path='/websites' render={(navProps) => <WebsitePanel {...navProps} />}/>
                <Route path='/netflix' render={(navProps) => <NetflixPanel {...navProps} />}/>
                <Route path='/reddit' render={(navProps) => <RedditPanel {...navProps} />}/>
                <Route path='/login' render={(navProps) => <LoginPanel {...navProps} />}/>
                <Route path='/youtube' render={(navProps) => <YoutubePanel {...navProps} />}/>
                <Route path='/' render={(navProps) => !this.props.signedIn()? <LoginPanel {...navProps} />: <Redirect to='/data' />}/>
            </Switch>
            </div>
        );
    }
}

export default Main;