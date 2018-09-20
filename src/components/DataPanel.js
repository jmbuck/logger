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
				        </div>
				        <div className="panel-center-content">
					        <div className="Data-Panel">
						        <Doughnut data={this.getData()} options={{}} />
					        </div>
					        <div onClick={ () => this.props.history.push("/websites")}>Website Page</div>
					        <div onClick={() => this.props.history.push("/netflix")}>Netflix Page</div>
					        <div onClick={() => this.props.history.push("/reddit")}>Reddit Page</div>
				        </div>
			        </div>
		        </div>
	        </div>
        )
    }
}

export default DataPanel