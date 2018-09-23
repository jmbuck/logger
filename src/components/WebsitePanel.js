import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {auth, retrieveFirebaseWebsiteData, 
    retrieveFirebaseWebsitesBlacklist,
    retrieveFirebaseWebsitesSettings} from "../rebase";

class WebsitePanel extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data: [],
            settings: null,
            blacklist: null,
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseWebsiteData(user.uid, (data) => {
                this.setState({ data })
            })
            retrieveFirebaseWebsitesSettings(user.uid, (settings) => {
                console.log(settings)
                this.setState({ settings: JSON.parse(settings) })
            })
            retrieveFirebaseWebsitesBlacklist(user.uid, (blacklist) => {
                this.setState({ blacklist })
            })
        }
    }

    blacklisted = (name) => {
        for(let website in this.state.blacklist) {
            if(name.includes(website) || website.includes(name)) {
                return true
            }
        }
        return false
    }

    componentWillMount() {
        if(auth.currentUser)
            this.retrieve(auth.currentUser);

        auth.onAuthStateChanged((user) => {
            this.retrieve(user);
        })
    }

    render() {
        return (
            <div className="panel">
                <div className="panel-container">
                    <div className="panel-website">
						<DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Website Page</h1>
	                        <table border="1px solid black" width="100%">
                                <thead>
		                        <tr>
			                        <th>Name</th>
			                        <th>Number of Visits</th>
			                        <th>Time Spent</th>
                                    <th>Data Used</th>
			                        <th>Category</th>
                                    <th>Delete</th>
		                        </tr>
                                </thead>
                                <tbody>
                                { this.state.blacklist && this.state.settings ?
                                    this.state.data.map((d) => {
                                        if(!this.blacklisted(d.name)) {
                                            return (
                                            <tr key={d.name}>
                                                <td>{d.name}</td>
                                                <td>{this.state.settings[d.name].visits ? d.visits : 'N/A'}</td>
                                                <td>{this.state.settings[d.name].time ? d.time : 'N/A'}</td>
                                                <td>{this.state.settings[d.name].data ? d.data : 'N/A'}</td>
                                                <td>{d.category}</td>
                                                <td>
                                                    <img src={exitIcon} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
                                                </td>
                                            </tr>
                                            )
                                        } else {
                                            return null
                                        }
                                    }
                                       )
                                    : <tr><td>Now loading...</td></tr>
                                }
                                </tbody>
	                        </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WebsitePanel