import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class YoutubePanel extends Component {
    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-youtube">
                        <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>YouTube</h1>
	                        <table border="1px solid black" align="center">
		                        <tr>
			                        <th>Channels Watched</th>
			                        <th>Total Time Watched</th>
                                    <th>Total Videos Watched</th>
		                        </tr>
		                        <tr>
			                        <td>VSauce</td>
			                        <td>7 hours</td>
                                    <td>102 videos</td>
		                        </tr>
		                        <tr>
			                        <td>Pewdiepie</td>
			                        <td>12 hours</td>
                                    <td>234 videos</td>
		                        </tr>
		                        <tr>
			                        <td>Summoning Salt</td>
			                        <td>5 hours 37 minutes</td>
                                    <td>25 videos</td>
		                        </tr>
	                        </table>
                        </div>
                    </div>
                </div>
	        </div>
            )
    }
}

export default YoutubePanel