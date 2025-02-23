import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {deleteFirebaseRedditData, retrieveFirebaseUserRedditData, retrieveTopSubreddits} from "../logger-firebase";
import {auth} from "../database/Auth";

class RedditPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data : [],
            topSubreddits: ["..."]
        };
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseUserRedditData(user.uid, (data) => {
                this.setState({ data : data})
            })
            retrieveTopSubreddits((data) => {
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
        let data = [...this.state.data];
        let subreddit = data.splice(index, 1)[0].name
        deleteFirebaseRedditData(auth.currentUser.uid, subreddit)
        this.setState({data});
    };

    isEmptyList = (subreddit, index) => {
        if(!(this.state.topSubreddits.length < 2))
        {
            return (
                <div>{index + 1}. {subreddit}</div>
            )
        }
        return <div>{subreddit}</div>;
    };

    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-reddit">
	                    <DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Reddit Page</h1>
                            <h2>Top Subreddits</h2>
                            {
                                this.state.topSubreddits.map((subreddit, index) => this.isEmptyList(subreddit, index))
                            }

                            <br/>

	                        <table border="1px solid black">
		                        <tr>
			                        <th>Subreddit</th>
			                        <th>Time Spent</th>
                                    <th>Delete</th>
		                        </tr>
                                {
                                    this.state.data.map((d, index) =>
                                        <tr>
                                            <td>{d.name}</td>
                                            <td>{d.time}</td>
                                            <td>
                                                <img src={exitIcon} onClick={() => this.handleDelete(index)} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
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
