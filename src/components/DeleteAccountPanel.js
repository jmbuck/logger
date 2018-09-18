import React, { Component } from 'react'
import '../css/common.css'

class DeleteAccountPanel extends Component {
    render() {
        return (<div className="Panel">
                <div className="Panel-Container">
                    <div className="Delete-Account-Panel">
                        <div className="Title">
                            Are you sure? You will lose all associated data and there is no way to retrieve this again.
                        </div>
                        <div className="Two-Grid">
                            <div>
                                Yes, I'm sure
                            </div>
                            <div onClick={ () => this.props.history.push("/preferences") }>
                                No, take me back
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteAccountPanel