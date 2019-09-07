import React from 'react'
import moment from 'moment'
import Axios from 'axios';
import {NavLink} from 'react-router-dom'

import './eventdescstyle.css'


/*
will be passed
data = {
    name:"",
    destination:"",
    startTime:"",
    endTime:"",
    description:"",
}
*/
class EventDesc extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.id,
            nodata: false
        }
    } 

    componentDidMount() {
        Axios.get('http://localhost:5000/event/basic/' + this.props.id)
			.then((res) => {
				console.log("res basic: ", this.props.id, ": ", res)
                if(res) { // has someting
                    this.setState({
                        name: res.data[0].name,
                        destination: res.data[0].destination,
                        startTime: moment(res.data[0].startTime, "X").startOf("day"),
                        endTime: moment(res.data[0].endTime, "X").endOf("day"),
                        description: res.data[0].description
                    }, () => console.log("State:", this.state))
                } else {
                    this.setState({
                        nodata: true,
                    })
                }
                
			})
    }
    
    render() {
        if(this.state.nodata) {
            return (
                <div>
                    this.props.id
                </div>
            )
        } else {
            return (
                <NavLink to={'/event/' + this.props.id}>
                <div className="eventdesc">
                    <h3>{this.state.name}</h3>
                    <h5>{this.state.destination}</h5>
                    <h5>{moment(this.state.startTime).format("YYYY-MM-DD")} to {moment(this.state.endTime).format("YYYY-MM-DD")}</h5>
                    <h6>{this.state.description}</h6>
                </div>
                </NavLink>
            )
        }
        
    }
}

export default EventDesc