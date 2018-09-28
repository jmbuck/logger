import React, { Component } from 'react'
import { Doughnut, HorizontalBar, defaults } from 'react-chartjs-2';
import '../css/common.css'
import DataNav from './DataNav'
import { retrieveFirebaseUserData, retrieveFirebaseWebsitesData } from "../rebase";
import { auth } from "../database/Auth";

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
            },
            websiteDataUsage : {
                datasets: [],

                labels:[]

            }
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseUserData(user.uid, (data) => {
                this.setState({ dataUsage : data})
            });
            retrieveFirebaseWebsitesData(user.uid, (data) => {
                this.setState({ websiteDataUsage: data });
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
    };

    render() {
        defaults.global.legend.position = 'left';
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
                                <h3 className="h3-size">6 Websites browsing data</h3>
                                    <HorizontalBar
                                        data={this.state.websiteDataUsage}
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