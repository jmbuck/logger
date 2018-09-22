import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {auth, retrieveFirebaseNetflixData} from "../rebase";

class NetflixPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timeTV : "...",
            timeMovies : "...",
            visitsTV : "...",
            visitsMovies : "..."
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseNetflixData(user.uid, (data) => {
                this.setState(data)
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

    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-netflix">
						<DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Netflix Page</h1>
	                        <h3>Time Spent Watching TV -</h3>
	                        <div>{this.state.timeTV}</div>
	                        <h3>Time Spent Watching Movies -</h3>
	                        <div>{this.state.timeMovies}</div>
	                        <h3>Number of TV Shows Watched -</h3>
	                        <div>{this.state.visitsTV}</div>
	                        <h3>Number of Movies Watched -</h3>
	                        <div>{this.state.visitsMovies}</div>
                        </div>
                    </div>
                </div>
	        </div>
        )
    }
}

export default NetflixPanel