import React, { Component } from 'react'

import exitIcon from "../img/x.svg"
import { msToString } from '../logger-firebase'
import '../css/common.css'

class Website extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            dropdownClass: 'hide',
            categoryClass: '',
            topSites: ["..."]
        }
    }


    render = () => {
        let d = this.props.site
        return (
            <tr>
                <td className="pointer" onClick={() => this.props.openModal(d)}>{d.name}</td>
                <td>{this.props.settings ? (this.props.settings.visits ? d.visits : 'N/A') : (d.visits ? d.visits : 'N/A')}</td>
                <td>{this.props.settings ? (this.props.settings.time ? msToString(d.time) : 'N/A') : (d.time ? msToString(d.time) : 'N/A')}</td>
                <td>{this.props.settings ? (this.props.settings.data ? d.data : 'N/A') : d.data}</td>
                <td>{this.props.settings ? (this.props.settings.timestamp ? new Date(d.timestamp).toDateString() : 'N/A') : new Date(d.timestamp).toDateString()}</td>
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
                            d.category && d.category !== 'other'
                                ? d.category
                                : 'N/A'
                        }
                    </span>
                    <select name="category" className={this.state.dropdownClass} onChange={(ev) => {
                        this.props.updateCategory(d, ev.target.value)
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
                    <img src={exitIcon} onClick={() => this.props.handleDelete(this.props.index)} style={{"filter" : "invert(100%)", "width": "25px", "height" : "25px", "cursor" : "pointer"}}/>
                </td>
            </tr>
        )
    }
}

export default Website