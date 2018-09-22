import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {auth, retrieveFirebaseUserYoutubeVideoData} from "../rebase";

class YoutubePanel extends Component {

	constructor(props) {
		super(props)

		this.state = {
            data: []
		}
	}

	componentWillMount() {
	    auth.onAuthStateChanged((user) => {
	        if(user) {
                retrieveFirebaseUserYoutubeVideoData(user.uid, (data) => {
                    this.setState({ data : data})
                })
            }
        })
    }

    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-youtube">
                        <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>YouTube</h1>
	                        <table border="1px solid black" align="center">
                                <thead>
                                <tr>
                                    <th>Channels Watched</th>
                                    <th>Total Time Watched</th>
                                    <th>Total Videos Watched</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.data.map((d) =>
                                        <tr key={d.name}>
                                            <td>{d.name}</td>
                                            <td>{d.time}</td>
                                            <td>1</td>
                                            <td>
                                                <img src={exitIcon} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
                                            </td>
                                        </tr>)
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

export default YoutubePanel