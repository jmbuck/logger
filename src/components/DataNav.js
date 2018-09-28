import React, {Component} from 'react';
import '../css/common.css';

class DataNav extends Component {
  render() {
    return (
        <div className="panel-left-nav">
            <div className="filter-nav">
                <div className="filter-title" onClick={ () => this.props.history.push("/data") }>
                    <h3>
                        Summary Pages
                    </h3>
                </div>
                <h3 className="break-line title" />
                <h4 onClick={ () => this.props.history.push("/websites")}>
                    Websites
                </h4>
                <h4 onClick={ () => this.props.history.push('/youtube')}>
                    Youtube
                </h4>
                <h4 onClick={ () => this.props.history.push("/netflix")}>
                    Netflix
                </h4>
                <h4 onClick={ () => this.props.history.push("/reddit")}>
                    Reddit
                </h4>
            </div>
        </div>
    )
  }
}

export default DataNav;