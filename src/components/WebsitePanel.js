import React, {Component} from 'react'
import '../css/common.css'

class WebsitePanel extends Component {
    render() {
        return <div>
                <h1>Website Page</h1>
                <table border="1px solid black" width="100%">
                    <tr>
                        <th>Name</th>
                        <th>Number of Visits</th>
                        <th>Time Spent</th>
                        <th>Category</th>
                    </tr>
                    <tr>
                        <td>Facebook</td>
                        <td>5</td>
                        <td>3 minutes</td>
                        <td contentEditable='true'>Social Media</td>
                    </tr>
                    <tr>
                        <td>Website2</td>
                        <td>Visits2</td>
                        <td>Time2</td>
                        <td contentEditable='true'>Category2</td>
                    </tr>
                </table>
            </div>
    }
}

export default WebsitePanel