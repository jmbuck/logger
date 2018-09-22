import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class WebsitePanel extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data : [
                {name : "Facebook", visits : 5, time : "3 minutes", category : "Social Media"},
                {name : "Youtube", visits : 2, time : "37 minutes", category : "Videos"}
            ]}
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
		                        <tr>
			                        <th>Name</th>
			                        <th>Number of Visits</th>
			                        <th>Time Spent</th>
			                        <th>Category</th>
                                    <th>Delete</th>
		                        </tr>
                                {
                                    this.state.data.map((d) =>
                                        <tr>
                                            <td>{d.name}</td>
                                            <td>{d.visits}</td>
                                            <td>{d.time}</td>
                                            <td>{d.category}</td>
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

export default WebsitePanel