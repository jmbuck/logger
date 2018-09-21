import React, { Component } from 'react'
import { Doughnut, HorizontalBar, defaults } from 'react-chartjs-2';
import '../css/common.css'

class DataPanel extends Component {

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
				        <div className="panel-left-nav">
					        <div className="filter-nav">
						        <div className="filter-title" onClick={ () => this.props.history.push("/data") }>
							        <h3>
								        Summary Pages
							        </h3>
						        </div>
						        <h3 className="break-line title" />
						        <h4 onClick={ () => this.props.history.push("/websites")}>
							        Websites
						        </h4>
						        <h4>
							        Youtube
						        </h4>
						        <h4 onClick={ () => this.props.history.push("/netflix")}>
							        Netflix
						        </h4>
						        <h4 onClick={ () => this.props.history.push("/reddit")}>
							        Reddit
						        </h4>
					        </div>
				        </div>
				        <div className="panel-center-content">
					        <div className="Data-Panel">
                                <div className="graph">
                                    <h3 className="h3-size">Website Categories</h3>
                                    <Doughnut data={this.getDoughnutData()}/>
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