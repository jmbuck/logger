import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import { retrieveFirebaseWebsiteData,
    retrieveFirebaseWebsitesBlacklist,
    retrieveFirebaseWebsitesSettings,
    deleteFirebaseWebsite,
    retrieveDefaultCategories,
    setWebsiteCategory,
    msToString, } from "../logger-firebase";
import { auth } from "../database/Auth";

class WebsitePanel extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data: [],
            settings: null,
            blacklist: null,
            dropdownClass: 'hide',
            categoryClass: '',
            //0 is alphabetical ascending, 1 is descending
            //2 is visits ascending, 3 is descending
            //4 is time ascending, 5 is descending
            //6 is data ascending, 7 is descending
            sortBy: 0,
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseWebsiteData(user.uid, (data) => {
                this.setState({ data, names: data.map(a => a.name) }, () => {
                    console.log(this.state.names)
                    retrieveDefaultCategories(this.state.names ? this.state.names : [], (categories) => {
                        console.log('categories:', categories)
                        const websites = [...this.state.data]
                        websites.map((website) => website.category = categories[website.name])
                        this.setState({ data: websites })
                    })
                })
            })
            retrieveFirebaseWebsitesSettings(user.uid, (settings) => {
                this.setState({ settings })
            })
            retrieveFirebaseWebsitesBlacklist(user.uid, (blacklist) => {
                this.setState({ blacklist })
            })
        }
    };

    sortWebsites = (a, b) => {
        const aNew = {...a}
        const bNew = {...b}
        if(!aNew.data) aNew.data = 0;
        if(!aNew.time) aNew.time = 0;
        if(!aNew.visits) aNew.visits = 0;
        if(!bNew.data) bNew.data = 0;
        if(!bNew.time) bNew.time = 0;
        if(!bNew.visits) bNew.visits = 0;
        switch(this.state.sortBy) {
          case 0: //Alphabetical
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

    render() {
        return (
            <div className="panel">
                <div className="panel-container">
                    <div className="panel-website">
						<DataNav {...this.props}/>
                        <div className="panel-center-content">
	                        <h1>Website Page</h1>
	                        <table border="1px solid black" width="100%">
                                <thead>
		                        <tr>
			                        <th onClick={() => {
                                        if(this.state.sortBy === 0) this.setState({ sortBy: 1 })
                                        else this.setState({ sortBy: 0 })
                                    }}>Name</th>
			                        <th onClick={() => {
                                        if(this.state.sortBy === 2) this.setState({ sortBy: 3 })
                                        else this.setState({ sortBy: 2 })
                                    }}>Number of Visits</th>
			                        <th onClick={() => {
                                        if(this.state.sortBy === 4) this.setState({ sortBy: 5 })
                                        else this.setState({ sortBy: 4 })
                                    }}>Time Spent</th>
                                    <th onClick={() => {
                                        if(this.state.sortBy === 6) this.setState({ sortBy: 7 })
                                        else this.setState({ sortBy: 6 })
                                    }}>Data Used</th>
			                        <th>Category</th>
                                    <th>Delete</th>
		                        </tr>
                                </thead>
                                <tbody>
                                { !(this.state.blacklist === null || this.state.settings === null) ?
                                    this.state.data.sort((a, b) => this.sortWebsites(a, b)).map((d, index) => {
                                        if(!this.blacklisted(d.name)) {
                                            return (
                                            <tr key={d.name}>
                                                <td>{d.name}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].visits ? d.visits : 'N/A') : d.visits}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].time ? msToString(d.time) : 'N/A') : msToString(d.time)}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].data ? d.data : 'N/A') : d.data}</td>
                                                <td>
                                                    <span className={`category ${this.state.categoryClass}`} onClick={(ev) => {
                                                        ev.persist()
                                                        if(!this.state.categoryClass) {
                                                            this.setState({categoryClass: 'hide', dropdownClass: ''}, () => 
                                                            ev.target.nextSibling.focus()
                                                            )
                                                        }
                                                        } }>
                                                        {d.category 
                                                        ? `${d.category}`
                                                        : 'N/A'}
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