import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router'
import '../css/common.css';
import Navbar from './Navbar'

import PreferencePanel from "./PreferencePanel"
import FilterPanel from "./FilterPanel"

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar {...this.props} />
        <Switch>
            <Route path="/data" render={(navProps) => null/*<Data /> component goes here*/}/>
            <Route path='/preferences' render={(navProps) => <PreferencePanel {...navProps} />}/>
            <Route path='/filters' render={(navProps) => <FilterPanel {...navProps} />}/>
            <Route path='/' render={(navProps) => <Redirect to="/data" />}/>
        </Switch>
      </div>
    );
  }
}

export default App;
