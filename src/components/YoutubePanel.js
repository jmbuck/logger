import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {
    deleteFirebaseYoutubeData,
    msToString,
    retrieveFirebaseUserYoutubeVideoData,
    retrieveTopYoutubeChannels
} from "../logger-firebase";
import {auth} from "../database/Auth";

class YoutubePanel extends Component {

	constructor(props) {
		super(props);

		this.state = {
            data: [],
            topChannels: ["..."]
		};
		this.handleDelete = this.handleDelete.bind(this);
	}

	retrieve = (user) => {
        if(user) {
            retrieveFirebaseUserYoutubeVideoData(user.uid, (data) => {
                this.setState({ data : data})
            })
            retrieveTopYoutubeChannels((data) => {
                this.setState(data);
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
        let channel = data.splice(index, 1)[0].id
        deleteFirebaseYoutubeData(auth.currentUser.uid, channel)
        this.setState({data});
    };

    isEmptyList = (channel, index) => {
        if(!(this.state.topChannels.length < 2))
        {
            return (
                <div>{index + 1}. {channel}</div>
            )
        }
        return <div>{channel}</div>;
    };

    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-youtube">
                        <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>YouTube Page</h1>
                            <h2>Top Youtube Channels</h2>
                            {
                                this.state.topChannels.map((channel, index) => this.isEmptyList(channel, index))
                            }

                            <br/>

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
                                            <td>{d.name}</td>
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
