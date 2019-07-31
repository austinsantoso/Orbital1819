import React from 'react'
import EventDesc from './EventDesc'
import '../homestyle.css'
import Axios from 'axios';

class HomeLogin extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            eventids:[]
        }
        this.getData = this.getData.bind(this)
    }
    
    getData() {
        Axios.get('http://localhost:5000/event/users')
                .then((res) => {
                    return res.data
                }).then((res) => {
                    var output = res.filter((user) => {
                        var temp = user.username;
                        return (temp.localeCompare(this.props.username) === 0)
                    })
                    return output
                }).then((res) => {
                    return res[0].events
                }).then((res) => {
                    console.log("Res: ", res)
                    if (res) { //has items to show
                        var allEvents = res.split(' ')
                        console.log("all events:", allEvents)
                        this.setState({
                            eventids: allEvents
                        })
                    } else {
                        this.setState({

                        })
                    }
                })
    }
    componentDidMount() {
        this.getData()
    }
    render() {
        console.log("this.state.eventids:", this.state.eventids)
        return (
            <div>
                <h3 style={{ paddingTop:"20px", paddingBottom:"0"}}>Hello THERE {this.props.username}</h3>
                <hr/>
                <button onClick={this.getData}>Refresh</button>
                <hr />
                {this.state.eventids.map((data) => {
                    console.log(data)
                    console.log("event desc: ", data)
                    return <EventDesc key={data} id={data} />
                })}
            </div>    
        )
    }
}

export default HomeLogin