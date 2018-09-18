import React, { Component } from 'react'
import { Line } from 'react-chartjs'
import '../css/common.css'

class DataPanel extends Component {

    getData = () => {
        return {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        }
    }
    render() {
        return (<div className="Panel">
                <div className="Panel-Container">
                    <div className="Data-Panel">
                        <Line data={this.getData()} options={{}} />
                    </div>
                </div>
            </div>
        )
    }
}

export default DataPanel