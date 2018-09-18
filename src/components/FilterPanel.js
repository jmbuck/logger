import React, { Component } from 'react'
import '../css/common.css'

class FilterPanel extends Component {
    render() {
        return (<div className="Panel">
		        <div className="Panel-Container">
			        <div className="Filter-Panel">
				        <div className="Filter-Website-List">
					        <div className="Filter-Website-Title">
							        Websites
					        </div>
					        <div className="Break-Line" />
					        <div className="Website">
						        Website1
					        </div>
					        <div className="Website">
						        Website2
					        </div>
					        <div className="Website">
						        Website3
					        </div>
					        <div className="Website">
						        Website4
					        </div>
					        <div className="Website">
						        Website5
					        </div>
					        <div className="Website">
						        Website6
					        </div>
					        <div className="Website">
						        Website7
					        </div>
					        <div className="Website">
						        Website8
					        </div>
				        </div>
				        <div className="Website-Filter">
					        <input type="text" />
					        <input type="submit" />
					        <form>
								<input type="radio" value="Monitor time spent" />
						        <input type="radio" value="Monitor internet usage" />
						        <input type="radio" value="Monitor specific internet usage"/>
						        <input type="submit" />
					        </form>
				        </div>
				        <div className="Exit">
				        </div>
			        </div>
		        </div>
	        </div>
        )
    }
}

export default FilterPanel