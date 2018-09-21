import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'

class NetflixPanel extends Component {
    render() {
        return (
	        <div className="panel">
                <div className="panel-container">
                    <div className="panel-netflix">
						<DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Netflix Page</h1>
	                        <h3>Time Spent Watching TV -</h3>
	                        <div>47.25 hours</div>
	                        <h3>Time Spent Watching Movies -</h3>
	                        <div>6.7 hours</div>
	                        <h3>Number of TV Shows Watched -</h3>
	                        <div>6</div>
	                        <h3>Number of Movies Watched -</h3>
	                        <div>4</div>
                        </div>
                    </div>
                </div>
	        </div>
        )
    }
}

export default NetflixPanel