import React, { Component } from 'react'
import Modal from 'react-modal'

import '../css/common.css'
import exitIcon from "../img/x.svg"
import { database } from 'firebase';
import { auth } from '../rebase'

class FilterPanel extends Component {

    constructor(props) {
        super(props);

         this.state = { 
             websites: ['Google', 'Facebook', 'YouTube'],
             filters: ['google.com', 'facebook.com'],
             modalIsOpen: false,
             website: '',
         }
    }

    retrieve = (user) => {

    }

    componentWillMount() {
        if(auth.currentUser)
            this.retrieve(auth.currentUser);

        auth.onAuthStateChanged((user) => {
            this.retrieve(user);
        })
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

    handleTrackingSubmit = (ev) => {
        ev.preventDefault()
        const website = this.state.website
        const data = ev.target.data.checked
        const time = ev.target.time.checked
        const visits = ev.target.visits.checked
        const tracking = []
        if(data) tracking.push('data')
        if(time) tracking.push('time')
        if(visits) tracking.push('visits')
        console.log(ev.target)
        console.log(tracking)
        this.postTrackingSettingsToFirebase(website, tracking)
    }

    postTrackingSettingsToFirebase = (website, tracking) => {
        //TODO: implement post
    }

    postFilterToFirebase = (url) => {
        //TODO: implement post
    }

    openModal = (website) => {
        this.setState({website, modalIsOpen: true})
    }

    closeModal = () => {
        this.setState({website: '', modalIsOpen: false})
    }

    render() {
        return (
        	<div className="panel">
		        <div className="panel-container">
			        <div className="panel-filter">
                        <div className="panel-left-nav">
                            <div className="filter-nav">
                                <div className="filter-title" onClick={this.props.titleClick}>
                                    <h3>
                                        Websites
                                    </h3>                                
                                </div>
                                <h3 className="break-line title" />
                                {this.state.websites && this.state.websites.map((website) => 
                                    <h4 key={website} onClick={() => this.openModal(website)}>{website}</h4>
                                )}
                            </div>
                        </div>

                        <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            contentLabel={this.state.website}
                        >

                            <h2>{this.state.website}</h2>
                            <button onClick={this.closeModal}>close</button>
                            <h3>Modify website tracking</h3>
                            <form onSubmit={this.handleTrackingSubmit}>
                                <input type="checkbox" name="data" value="data" defaultChecked/> Internet Usage<br/>
                                <input type="checkbox" name="time" value="time" defaultChecked/> Time Tracking<br/>
                                <input type="checkbox" name="visits" value="visits" defaultChecked/> Visits Tracking<br/>
                                <button type="submit">Save</button>
                            </form>
                        </Modal>
                        <div className="panel-center-content">
                            <h3>Filters</h3>
                            <ul>
                                {this.state.filters && 
                                    this.state.filters.map((filter) => <li key={filter}>{filter}</li>)}
                            </ul>
                            <form onSubmit={this.handleSubmit}>
                                <input type="text" required autoFocus placeholder="Filter URL" name="url" />
                                <button type="submit">Add Filter</button>
                            </form>
                        </div>
       
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