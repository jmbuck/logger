import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
import '../css/common.css'

class DataPanel extends Component {

    getData = () => {
        return {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        }
    }
    render() {
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
						        <Doughnut data={this.getData()} options={{}} />
					        </div>
				        </div>
			        </div>
		        </div>
	        </div>
        )
    }
}

export default DataPanel