import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class YoutubePanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data : [
                {name: "VSauce", time: "7 hours", visits : "102"},
                {name: "Pewdiepie", time: "12 hours", visits: "234"},
                {name: "Summoning Salt", time: "5 hours 37 minutes", visits: "25"}
            ]
        }
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
		                        <tr>
			                        <th>Channels Watched</th>
			                        <th>Total Time Watched</th>
                                    <th>Total Videos Watched</th>
                                    <th>Delete</th>
		                        </tr>
                                {
                                    this.state.data.map((d) =>
                                        <tr>
                                            <td>{d.name}</td>
                                            <td>{d.time}</td>
                                            <td>{d.visits}</td>
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

export default YoutubePanel