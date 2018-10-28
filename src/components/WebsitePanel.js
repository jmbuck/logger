import React, {Component} from 'react'
import {Bar} from 'react-chartjs-2'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import {
    deleteFirebaseWebsite,
    msToString,
    retrieveDefaultCategories,
    retrieveFirebaseWebsiteData,
    retrieveFirebaseWebsitesBlacklist,
    retrieveFirebaseWebsitesSettings,
    retrieveTopWebsites,
    setWebsiteCategory,
} from "../logger-firebase";
import Modal from 'react-modal'
import {auth} from "../database/Auth";

class WebsitePanel extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data: [],
            settings: null,
            blacklist: null,
            dropdownClass: 'hide',
            categoryClass: '',
            //0 is alphabetical name ascending, 1 is name descending
            //2 is visits ascending, 3 is descending
            //4 is time ascending, 5 is descending
            //6 is data ascending, 7 is descending
            //8 is timestamp ascending, 9 is descending
            //10 is alphabetical category ascending, 11 is alphabetical category descending
            sortBy: 0,
            topSites: ["..."]
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseWebsiteData(user.uid, (data) => {
                this.setState({ data, names: data.map(a => a.name) }, () => {
                    retrieveDefaultCategories(this.state.names ? this.state.names : [], (categories) => {
                        const websites = [...this.state.data]
                        websites.map((website) => {
                            if(!website.category)
                                website.category = categories[website.name]
                        })
                        this.setState({ data: websites })
                    })
                })
            })
            retrieveFirebaseWebsitesSettings(user.uid, (settings) => {
                this.setState({ settings })
                console.log("Settings: ", this.state.settings)
            })
            retrieveFirebaseWebsitesBlacklist(user.uid, (blacklist) => {
                this.setState({ blacklist })
            })
            retrieveTopWebsites((data) => {
                this.setState(data);
            })
        }
    };

    sortWebsites = (a, b) => {
        const aNew = {...a}
        const bNew = {...b}
        if(!aNew.data || (this.state.settings[aNew.name] && !this.state.settings[aNew.name].data)) aNew.data = 0;
        if(!aNew.time || (this.state.settings[aNew.name] && !this.state.settings[aNew.name].time)) aNew.time = 0;
        if(!aNew.visits || (this.state.settings[aNew.name] && !this.state.settings[aNew.name].visits)) aNew.visits = 1;
        if(!aNew.timestamp || (this.state.settings[aNew.name] && !this.state.settings[aNew.name].timestamp)) aNew.timestamp = 0;
        if(!aNew.category || (this.state.settings[aNew.name] && !this.state.settings[aNew.name].category)) aNew.category = "";
        if(!bNew.data || (this.state.settings[bNew.name] && !this.state.settings[bNew.name].data)) bNew.data = 0;
        if(!bNew.time || (this.state.settings[bNew.name] && !this.state.settings[bNew.name].time)) bNew.time = 0;
        if(!bNew.visits || (this.state.settings[bNew.name] && !this.state.settings[bNew.name].visits)) bNew.visits = 1;
        if(!bNew.timestamp || (this.state.settings[bNew.name] && !this.state.settings[bNew.name].timestamp)) bNew.timestamp = 0;
        if(!bNew.category || (this.state.settings[bNew.name] && !this.state.settings[bNew.name].category)) bNew.category = "";
        switch(this.state.sortBy) {
          case 0: //Alphabetical Name
            return aNew.name < bNew.name ? -1 : aNew.name > bNew.name
          case 1:
            return bNew.name < aNew.name ? -1 : bNew.name > aNew.name
          case 2: //Visits
              return aNew.visits - bNew.visits
          case 3:
              return bNew.visits - aNew.visits
          case 4: //Time
              return aNew.time - bNew.time
          case 5:
              return bNew.time - aNew.time
          case 6: //Data
              return aNew.data - bNew.data
          case 7:
              return bNew.data - aNew.data
          case 8: //Timestamp
              return aNew.timestamp - bNew.timestamp
          case 9:
              return bNew.timestamp - aNew.timestamp
          case 10: //Alphabetical Category
            return aNew.category < bNew.category ? -1 : aNew.category > bNew.category
          case 11:
            return bNew.category < aNew.category ? -1 : bNew.category > aNew.category
          default:
            return aNew.name < bNew.name ? -1 : aNew.name > bNew.name
        }
      }

    blacklisted = (name) => {
        for(let website in this.state.blacklist) {
            if(name.includes(website) || website.includes(name)) {
                return true
            }
        }
        return false
    };

    updateCategory = (website, category) => {
        setWebsiteCategory(auth.currentUser.uid, website.name, category)
    }

    handleDelete = (index) => {
        let data = [...this.state.data];
        let site = data.splice(index, 1)[0].name;
        deleteFirebaseWebsite(auth.currentUser.uid, site)
        this.setState({data});
    };

    componentWillMount() {
        if(auth.currentUser)
            this.retrieve(auth.currentUser);

        auth.onAuthStateChanged((user) => {
            this.retrieve(user);
        })
    }

    openModal = (website) => {
        this.setState({website, modalIsOpen: true})
    };

    closeModal = () => {
        this.setState({website: '', modalIsOpen: false})
    };

    isEmptyList = (site, index) => {
        if(!(this.state.topSites.length < 2))
        {
            return (
                <div>{index + 1}. {site}</div>
            )
        }
        return <div>{site}</div>;
    };

    render() {
        return (
            <div className="panel">
                <div className="panel-container">
                    <div className="panel-website">
						<DataNav {...this.props}/>
                        <Modal
                            ariaHideApp={false}
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                            contentLabel={this.state.website}
                        >

                            <h2>{this.state.website}</h2>
                            <button onClick={this.closeModal}>close</button>
                            <h3>Usage Graphs</h3>
                            <h2>Monthly Time Used</h2>
                            <div className="bar-graph">
                                <Bar
                                    options={{
                                        maintainAspectRatio: false
                                    }}
                                    data={{
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
                                    }}
                                />
                            </div>
                        </Modal>
                        <div className="panel-center-content">
	                        <h1>Website Page</h1>
                            <h2>Top Websites</h2>
                            {
                                this.state.topSites.map((site, index) => this.isEmptyList(site,index))
                            }

                            <br/>

	                        <table border="1px solid black" width="100%">
                                <thead>
		                        <tr>
			                        <th onClick={() => {
                                        if(this.state.sortBy === 0) this.setState({ sortBy: 1 })
                                        else this.setState({ sortBy: 0 })
                                    }} style={ this.state.sortBy === 0 ? { "borderBottomColor": "rgba(144, 144, 144)", "borderBottomWidth": "5px" } : this.state.sortBy === 1 ? { "borderTopColor": "rgba(144, 144, 144)", "borderTopWidth": "5px" } : {}}>Name</th>
			                        <th onClick={() => {
                                        if(this.state.sortBy === 2) this.setState({ sortBy: 3 })
                                        else this.setState({ sortBy: 2 })
                                    }} style={ this.state.sortBy === 2 ? { "borderBottomColor": "rgba(144, 144, 144)", "borderBottomWidth": "5px" } : this.state.sortBy === 3 ? { "borderTopColor": "rgba(144, 144, 144)", "borderTopWidth": "5px" } : {}}>Number of Visits</th>
			                        <th onClick={() => {
                                        if(this.state.sortBy === 4) this.setState({ sortBy: 5 })
                                        else this.setState({ sortBy: 4 })
                                    }} style={ this.state.sortBy === 4 ? { "borderBottomColor": "rgba(144, 144, 144)", "borderBottomWidth": "5px" } : this.state.sortBy === 5 ? { "borderTopColor": "rgba(144, 144, 144)", "borderTopWidth": "5px" } : {}}>Time Spent</th>
                             <th onClick={() => {
                                        if(this.state.sortBy === 6) this.setState({ sortBy: 7 })
                                        else this.setState({ sortBy: 6 })
                                    }} style={ this.state.sortBy === 6 ? { "borderBottomColor": "rgba(144, 144, 144)", "borderBottomWidth": "5px" } : this.state.sortBy === 7 ? { "borderTopColor": "rgba(144, 144, 144)", "borderTopWidth": "5px" } : {}}>Data Used</th>
                            <th onClick={() => {
                                       if(this.state.sortBy === 8) this.setState({ sortBy: 9 })
                                       else this.setState({ sortBy: 8 })
                                   }} style={ this.state.sortBy === 8 ? { "borderBottomColor": "rgba(144, 144, 144)", "borderBottomWidth": "5px" } : this.state.sortBy === 9 ? { "borderTopColor": "rgba(144, 144, 144)", "borderTopWidth": "5px" } : {}}>Last Visited</th>
                           <th onClick={() => {
                                      if(this.state.sortBy === 10) this.setState({ sortBy: 11 })
                                      else this.setState({ sortBy: 10 })
                                  }} style={ this.state.sortBy === 10 ? { "borderBottomColor": "rgba(144, 144, 144)", "borderBottomWidth": "5px" } : this.state.sortBy === 11 ? { "borderTopColor": "rgba(144, 144, 144)", "borderTopWidth": "5px" } : {}}>Category</th>
                                    <th>Delete</th>
		                        </tr>
                                </thead>
                                <tbody>
                                { !(this.state.blacklist === null || this.state.settings === null) ?
                                    this.state.data.sort((a, b) => this.sortWebsites(a, b)).map((d, index) => {
                                        if(!this.blacklisted(d.name)) {
                                            return (
                                            <tr key={d.name}>
                                                <td className="pointer" onClick={() => this.openModal(d.name)}>{d.name}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].visits ? d.visits : 'N/A') : (d.visits ? d.visits : 'N/A')}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].time ? msToString(d.time) : 'N/A') : (d.time ? msToString(d.time) : 'N/A')}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].data ? d.data : 'N/A') : d.data}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].timestamp ? new Date(d.timestamp).toDateString() : 'N/A') : new Date(d.timestamp).toDateString()}</td>
                                                <td>
                                                    <span className={`category ${this.state.categoryClass}`} onClick={(ev) => {
                                                        ev.persist()
                                                        if(!this.state.categoryClass) {
                                                            this.setState({categoryClass: 'hide', dropdownClass: ''}, () =>
                                                            ev.target.nextSibling.focus()
                                                            )
                                                        }
                                                        } }>
                                                        {
                                                            d.category
                                                                ? d.category
                                                                : 'N/A'
                                                        }
                                                    </span>
                                                    <select name="category" className={this.state.dropdownClass} onChange={(ev) => {
                                                        this.updateCategory(d, ev.target.value)
                                                        this.setState({categoryClass: '', dropdownClass: 'hide'})
                                                        }} onBlur={() => {
                                                        this.setState({categoryClass: '', dropdownClass: 'hide'})
                                                        }} defaultValue={d.category}>
                                                        <option value="">-</option>
                                                        <option value="E-Commerce">E-Commerce</option>
                                                        <option value="Personal">Personal</option>
                                                        <option value="Political<">Political</option>
                                                        <option value="News">News</option>
                                                        <option value="Corporate">Corporate</option>
                                                        <option value="Consultation">Consultation</option>
                                                        <option value="Video">Video</option>
                                                        <option value="Games">Games</option>
                                                        <option value="Movies & TV">Movies & TV</option>
                                                        <option value="Social Media">Social Media</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <img src={exitIcon} onClick={() => this.handleDelete(index)} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
                                                </td>
                                            </tr>
                                            )
                                        } else {
                                            return null
                                        }
                                    }
                                       )
                                    : <tr><td>Now loading...</td></tr>
                                }
                                </tbody>
	                        </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WebsitePanel
