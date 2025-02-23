import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"

class PreferencePanel extends Component {
    render() {
        return (<div className="panel">
                <div className="panel-container">
                    <div className="panel-preference">
                        <div className="panel-left-nav" />
                        <div className="panel-center-content">
	                        <div onClick={ () => this.props.history.push("/filters")}>Set Logger Filters</div>
	                        <div className="delete-account" onClick={ () => this.props.history.push("/deleteaccount")}>Delete Account</div>
                        </div>
                        <div className="panel-right-nav">
	                        <div className="exit-nav" onClick={ () => this.props.history.push("/data") }>
		                        <img src={exitIcon} />
	                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PreferencePanel