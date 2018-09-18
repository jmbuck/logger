import React, { Component } from 'react'
import '../css/common.css'

class PreferencePanel extends Component {
    render() {
        return (<div className="Panel">
                <div className="Panel-Container">
                    <div className="Preference-Panel">
                        <div onClick={ () => this.props.history.push("/filters")}>Set Logger Filters</div>
                        <div className="Delete-Account" onClick={ () => this.props.history.push("/deleteaccount")}>Delete Account</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PreferencePanel