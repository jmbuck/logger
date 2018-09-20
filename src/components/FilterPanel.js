import React, { Component } from 'react'
import '../css/common.css'
import settingsIcon from '../img/settings.svg'
import exitIcon from "../img/x.svg"

class FilterPanel extends Component {

    constructor(props) {
        super(props);

         this.state = { websites: false }
    }

    render() {
        return (
        	<div className="panel">
		        <div className="panel-container">
			        <div className="panel-filter">
                        <div className="panel-left-nav">
                            <div className="filter-nav">
                                <div className="filter-title" onClick={this.props["titleClick"]}>
                                    <h3>
                                        Websites
                                    </h3>
                                    <img src={settingsIcon} />
                                </div>
                                <h3 className="break-line title" />
                                <h4>
                                    Google
                                </h4>
                                <h4>
                                    Facebook
                                </h4>
                                <h4>
                                    Stack Overflow
                                </h4>
                            </div>
                        </div>
                        {this.state.websites ?
                            <div className="panel-center-content">
                            </div>
                            :
                            <div className="panel-center-content">
                                <h3 className="header">
                                    Website URL
                                </h3>
                                <input type="text" className="h2-size" />
                                <h2 className="break-line" />
                                <h4 className="header">
                                    Name
                                </h4>
                                <input type="text" className="h3-size"/>
                                <br />
                                <input type="checkbox" value="Bike" />
                                <h4 className="header">
                                    Monitor Internet Usage
                                </h4>
                            </div>
                        }
				        <div className="panel-right-nav">
					        <div className="exit-nav" onClick={ () => this.props.history.push("/preferences") }>
						        <img src={exitIcon} />
					        </div>
				        </div>
                    </div>
		        </div>
	        </div>
        )
    }
}

export default FilterPanel