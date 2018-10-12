import React, { Component } from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg";
import { auth } from "../database/Auth";
import {deleteFirebaseAccount} from "../logger-firebase";

class DeleteAccountPanel extends Component {

    deleteAccount(uid) {
        deleteFirebaseAccount(uid)
    }

    render() {
        return (<div className="panel">
                <div className="panel-container">
                    <div className="panel-left-nav" />
                    <div className="panel-center-content">
                        <div className="Title">
                            Are you sure? You will lose all associated data and there is no way to retrieve this again.
                        </div>
                        <div className="Two-Grid">
                            <div onClick={() => this.deleteAccount(auth.currentUser.uid)}>
                                Yes, I'm sure
                            </div>
                            <div onClick={ () => this.props.history.push("/preferences") }>
                                No, take me back
                            </div>
                        </div>
                    </div>

                    <div className="panel-right-nav">
                        <div className="exit-nav" onClick={ () => this.props.history.push("/data") }>
                            <img src={exitIcon} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteAccountPanel