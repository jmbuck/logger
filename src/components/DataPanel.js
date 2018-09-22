import React, { Component } from 'react'
import { Doughnut, HorizontalBar, defaults } from 'react-chartjs-2';
import '../css/common.css'
import DataNav from './DataNav'
import {auth, retrieveFirebaseUserData} from "../rebase";

class DataPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataUsage : {
                labels: [],
                datasets: [{
                    label: "Loading",
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    data: [],
                }]
            }
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseUserData(user.uid, (data) => {
                this.setState({ dataUsage : data})
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

    getBarData = () => {
        return {
            datasets: [{
                    label: 'Social Media',
                    backgroundColor:  'rgba(255, 159, 64, 0.2)',
                    data: [1, 1, 1, 1, 1, 1]
                },
                {
                    label: 'Streaming',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    data:  [1, 1, 1, 1, 1, 1]  
                },
                {
                    label: 'Gaming',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    data:  [1, 1, 1, 1, 1, 1]
                    },
                {
                label: 'News',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                data:  [1, 1, 1, 1, 1, 1]  
                },
                {
                label: 'Financial',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                data:  [1, 1, 1, 1, 1, 1]   
                },
                {
                label: 'Programming',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',                    
                data: [1, 1, 1, 1, 1, 1]
                }],
                
            labels:[1, 2, 3, 4, 5, 6]
            
        }
    }

    getDoughnutData = () => {
        return {
            labels: ["Social Media", "Streaming", "Gaming", "News", "Financial", "Programming"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                data: [40, 10, 5, 2, 20, 30],
            }]
        }
    }
    render() {
        defaults.global.legend.position = 'left'
        return (
	        <div className="panel">
		        <div className="panel-container">
			        <div className="panel-data">
                        <DataNav {...this.props}/>
				        <div className="panel-center-content">
					        <div className="Data-Panel">
                                <div className="graph">
                                    <h3 className="h3-size">Data Usage</h3>
                                    <Doughnut data={this.state.dataUsage}/>
                                </div>
                                <div className="graph">
                                <h3 className="h3-size">Past 6 Browsing Sessions</h3>
                                    <HorizontalBar
                                        data={this.getBarData()}
                                        width={100}
                                        height={50}
                                        options={{
                                            scales: {
                                                xAxes: [{
                                                    stacked: true
                                                }],
                                                yAxes: [{
                                                    stacked: true
                                                }]
                                            }
                                        }}
                                    />
                                </div>
					        </div>
				        </div>
			        </div>
		        </div>
	        </div>
        )
    }
}

export default DataPanel