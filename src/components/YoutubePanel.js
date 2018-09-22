import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {retrieveFirebaseGlobalYoutubeVideoData} from "../rebase";

class YoutubePanel extends Component {

	constructor(props) {
		super(props)

		this.state = {
            data: []
        }
	}

	retrieveGlobalData = () => {
        this.setState({ data: retrieveFirebaseGlobalYoutubeVideoData() })
        console.log(this.state.data)
	}

    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-youtube">
                        <div className="main-content">
                            <button id="test-button" onClick={() => this.retrieveGlobalData()}>Print data</button>
                        </div>
                        <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>YouTube</h1>
	                        <table border="1px solid black" align="center">
		                        <tr>
			                        <th>Channels Watched</th>
			                        <th>Total Time Watched</th>
                                    <th>Total Videos Watched</th>
		                        </tr>
								{Object.keys(this.state.data).map((item) => <tr><td>{item}</td><td>{this.state.data[item]}</td></tr>)}
	                        </table>
                        </div>
                    </div>
                </div>
	        </div>
            )
    }
}

export default YoutubePanel