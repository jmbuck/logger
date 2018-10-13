import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import { retrieveFirebaseUserYoutubeVideoData, msToString,
         deleteFirebaseYoutubeData } from "../logger-firebase";
import { auth } from "../database/Auth";

class YoutubePanel extends Component {

	constructor(props) {
		super(props);

		this.state = {
            data: []
		};
		this.handleDelete = this.handleDelete.bind(this);
	}

	retrieve = (user) => {
        if(user) {
            retrieveFirebaseUserYoutubeVideoData(user.uid, (data) => {
                console.log(data)
                this.setState({ data : data})
            })
        }
    };

	componentWillMount() {
	    if(auth.currentUser)
            this.retrieve(auth.currentUser);

	    auth.onAuthStateChanged((user) => {
	        this.retrieve(user);
        })
    }

    handleDelete = (index) => {
        let data = [...this.state.data]
        let channel = data.splice(index, 1)[0].name
        deleteFirebaseYoutubeData(auth.currentUser.uid, channel)
        this.setState({data});
    };

    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-youtube">
                        <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>YouTube</h1>
	                        <table border="1px solid black">
                                <thead>
                                <tr>
                                    <th>Channels Watched</th>
                                    <th>Total Time Watched</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.data.map((d, index) =>
                                        <tr key={d.id}>
                                            <td>{d.id}</td>
                                            <td>{msToString(d.time)}</td>
                                            <td>
                                                <img src={exitIcon} onClick={() => this.handleDelete(index)} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
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