import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class NetflixPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            timeTV : "47.25 hours",
            timeMovies : "6.7 hours",
            visitsTV : "6",
            visitsMovies : "4"
        }
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