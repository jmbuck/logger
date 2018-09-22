import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class RedditPanel extends Component {
    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-reddit">
	                    <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Reddit</h1>
	                        <table border="1px solid black" align="center">
		                        <tr>
			                        <th>Threads Visited</th>
			                        <th>Time Spent</th>
		                        </tr>
		                        <tr>
			                        <td>"The Button"</td>
			                        <td>3 minutes</td>
		                        </tr>
		                        <tr>
			                        <td>"What's your secret that could literally ruin  your life if it came out?"</td>
			                        <td>54 minutes</td>
		                        </tr>
		                        <tr>
			                        <td>"HELP reddit turned spanish and i cannot undo it!"</td>
			                        <td>22 minutes</td>
		                        </tr>
		                        <tr>
			                        <td>"Rome Sweet Rome"</td>
			                        <td>10 minutes</td>
		                        </tr>
	                        </table>
                        </div>
                    </div>
                </div>
	        </div>
            )
    }
}

export default RedditPanel