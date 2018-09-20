import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"

class WebsitePanel extends Component {
    render() {
        return (
            <div className="panel">
                <div className="panel-container">
                    <div className="panel-website">
                        <div className="panel-left-nav" />
                        <div className="panel-center-content">
	                        <h1>Website Page</h1>
	                        <table border="1px solid black" width="100%">
		                        <tr>
			                        <th>Name</th>
			                        <th>Number of Visits</th>
			                        <th>Time Spent</th>
			                        <th>Category</th>
		                        </tr>
		                        <tr>
			                        <td>Facebook</td>
			                        <td>5</td>
			                        <td>3 minutes</td>
			                        <td contentEditable='true'>Social Media</td>
		                        </tr>
		                        <tr>
			                        <td>Youtube</td>
			                        <td>2</td>
			                        <td>37 minutes</td>
			                        <td contentEditable='true'>Videos</td>
		                        </tr>
	                        </table>
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

export default WebsitePanel