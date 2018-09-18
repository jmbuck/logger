import React, { Component } from 'react'
import '../css/common.css'
import logout from '../img/logout.svg'
import settings from '../img/settings.svg'

class Navbar extends Component {
  render() {
    return (
    <div className="Navbar">
        <div className="NavList">
            <div className="Options">
                <div className="Settings">
                    <img src={settings} onClick={() => this.props.history.push("/preferences")} />
                </div>
                <div className="Logout">
                    <img src={logout} />
                </div>
            </div>
        </div>
        <div className="Logger-Title">
            Logger
        </div>
    </div>
    )
  }
}

export default Navbar