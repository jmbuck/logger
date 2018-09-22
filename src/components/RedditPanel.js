import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class RedditPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data : [
                {name: "AskReddit", time : "3 minutes"},
                {name: "IAmA", time : "10 minutes"},
                {name: "pics", time : "5 hours"}
            ]
        }
    }

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
			                        <th>Subreddit</th>
			                        <th>Time Spent</th>
                                    <th>Delete</th>
		                        </tr>
                                {
                                    this.state.data.map((d) =>
                                        <tr>
                                            <td>{d.name}</td>
                                            <td>{d.time}</td>
                                            <td>
                                                <img src={exitIcon} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
                                            </td>
                                        </tr>)
                                }
	                        </table>
                        </div>
                    </div>
                </div>
	        </div>
            )
    }
}

export default RedditPanel