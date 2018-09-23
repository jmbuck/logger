import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {auth, retrieveFirebaseWebsiteData} from "../rebase";

class WebsitePanel extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data : []
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseWebsiteData(user.uid, (data) => {
                this.setState({ data : data})
            })
        }
    };

    handleDelete = (index) => {
        let data = [...this.state.data];
        data.splice(index, 1);
        this.setState({data});
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
                    <div className="panel-website">
						<DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Website Page</h1>
	                        <table border="1px solid black" width="100%">
                                <thead>
		                        <tr>
			                        <th>Name</th>
			                        <th>Number of Visits</th>
			                        <th>Time Spent</th>
                                    <th>Data Used</th>
			                        <th>Category</th>
                                    <th>Delete</th>
		                        </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.data.map((d, index) =>
                                        <tr key={d.name}>
                                            <td>{d.name}</td>
                                            <td>{d.visits}</td>
                                            <td>{d.time}</td>
                                            <td>{d.data}</td>
                                            <td contentEditable='true'>{d.category}</td>
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

export default WebsitePanel