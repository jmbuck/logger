import React, {Component} from 'react'
import '../css/common.css'
import exitIcon from "../img/x.svg"
import DataNav from './DataNav'
import { retrieveFirebaseWebsiteData,
    retrieveFirebaseWebsitesBlacklist,
    retrieveFirebaseWebsitesSettings,
    deleteFirebaseWebsite,
    retrieveDefaultCategory,
    setWebsiteCategory,
    } from "../logger-firebase";
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
        }
    }

    retrieve = (user) => {
        if(user) {
            retrieveFirebaseWebsiteData(user.uid, (data) => {
                this.setState({ data })
            });
            retrieveFirebaseWebsitesSettings(user.uid, (settings) => {
                console.log(settings)
                this.setState({ settings })
            });
            retrieveFirebaseWebsitesBlacklist(user.uid, (blacklist) => {
                this.setState({ blacklist })
            })
        }
    };

    blacklisted = (name) => {
        for(let website in this.state.blacklist) {
            if(name.includes(website) || website.includes(name)) {
                return true
            }
        }
        return false
    };

    getDefaultCategory = (website, index) => {
        let websites = [...this.state.data]
        retrieveDefaultCategory(website, (data) => {
            websites[index].category = data;
            this.setState({ data: websites})
        }); 
    }

    updateCategory = (website, category) => {
        setWebsiteCategory(auth.currentUser.uid, website, category)
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
			                        <th>Name</th>
			                        <th>Number of Visits</th>
			                        <th>Time Spent</th>
                                    <th>Data Used</th>
			                        <th>Category</th>
                                    <th>Delete</th>
		                        </tr>
                                </thead>
                                <tbody>
                                { !(this.state.blacklist === null || this.state.settings === null) ?
                                    this.state.data.map((d, index) => {
                                        if(!this.blacklisted(d.name)) {
                                            return (
                                            <tr key={d.name}>
                                                <td>{d.name}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].visits ? d.visits : 'N/A') : d.visits}</td>
                                                <td>{this.state.settings[d.name] ? (this.state.settings[d.name].time ? d.time : 'N/A') : d.time}</td>
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
                                                        : this.getDefaultCategory(d, index)}
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