import React, { Component } from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import { database } from 'firebase';
import { auth } from '../rebase'

class FilterPanel extends Component {

    constructor(props) {
        super(props);

         this.state = { 
             websites: [],
             filters: ['google.com', 'facebook.com'],
             filter: true,
         }
    }

    componentWillMount() {
        this.fetchFilters()
        this.props.fetchWebsites(this.updateState)
    }


    updateState = (websites) => {
        this.setState({ websites })
    }

    fetchFilters = () => {
        let uid = auth.currentUser ? auth.currentUser.uid : null
        //TODO: implement fetch
    }
    
    handleSubmit = (ev) => {
        ev.preventDefault()
        const url = ev.target.url.value
        const filters = [...this.state.filters]
        filters.push(url)
        this.setState({ filters })
        this.postFilterToFirebase(url)
    }


    postFilterToFirebase = (url) => {
        //TODO: implement post
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
                        {this.state.filter ?
                            <div className="panel-center-content">
                                <h3>Filters</h3>
                                <ul>
                                    {this.state.filters.map((filter) => <li key={filter}>{filter}</li>)}
                                </ul>
                                <form onSubmit={this.handleSubmit}>
                                    <input type="text" required autoFocus placeholder="Filter URL" name="url" />
                                    <button type="submit">Add Filter</button>
                                </form>
                            </div>
                            : <div className="panel-center-content">
                            
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