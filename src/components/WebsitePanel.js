import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"

class WebsitePanel extends Component {
    render() {
        return (
            <div className="panel">
                <div className="panel-container">
                    <div className="panel-website">
	                    <div className="panel-left-nav">
		                    <div className="filter-nav">
			                    <div className="filter-title" onClick={ () => this.props.history.push("/data") }>
				                    <h3>
					                    Summary Pages
				                    </h3>
			                    </div>
			                    <h3 className="break-line title" />
			                    <h4 onClick={ () => this.props.history.push("/websites")}>
				                    Websites
			                    </h4>
			                    <h4>
				                    Youtube
			                    </h4>
			                    <h4 onClick={ () => this.props.history.push("/netflix")}>
				                    Netflix
			                    </h4>
			                    <h4 onClick={ () => this.props.history.push("/reddit")}>
				                    Reddit
			                    </h4>
		                    </div>
	                    </div>
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
                    </div>
                </div>
            </div>
        )
    }
}

export default WebsitePanel