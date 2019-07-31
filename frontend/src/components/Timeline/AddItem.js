import React from 'react'
import axios from 'axios'
import moment from 'moment'

import './additemstyle.css'

class AddItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventId: this.props.eventId,
            open: false,
            name: "New Activity",
            defaultTimeStart: this.props.defaultTimeStart,
        }
        this.toggleContent = this.toggleContent.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    toggleContent(event) {
        event.preventDefault()
        this.setState({
            open: !this.state.open
        })
        console.log("toggling")
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({ //the [] is to declare the string as a object variable(?)
            [name]: value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        const output1 = {
            title: this.state.name,
            startTime: moment(this.state.defaultTimeStart, 'X').unix(),
            endTime: moment(this.state.defaultTimeStart, 'X').add(2, "hours").unix(),
            itemDesc: ""
        }

        axios.post('http://localhost:5000/event/addItem/' + this.state.eventId, output1)
            .then((res) => {
                console.log(res)
                const output2 = {
                    id: res.data,
                    group: 1,
                    title: this.state.name,
                    start_time: moment(this.state.defaultTimeStart, 'X'),
                    end_time: moment(this.state.defaultTimeStart, 'X').add(2, "hours"),
                    itemDesc: ""
                }
                console.log("new item: ", output2)
                this.props.handleAdd(output2)
                return res
            })

    }

    render() {
        const style = {
            width: "100%",
            border: "1px solid black",
            height: "auto",
            marginBottom: "0px",
            transition: "0.3s"
        }

        return (
            <div style={style}>
                <button className="mainbtn" onClick={this.toggleContent}>
                    add Item
                </button>
                <div className="form-popup" id="myForm" style={{ display: this.state.open ? "block" : "none" }}>
                    <form className="form-container" autoComplete="off">
                        <h1>New Event</h1>

                        <label for="email"><b>Name</b></label><br />
                        <input type="text" value={this.state.name} name="name" required onChange={this.handleChange} size="24" />

                        <button type="submit" className="btn" onClick={this.handleSubmit}>Add</button>
                        <button className="btn cancel" onClick={this.toggleContent}>Close</button>
                    </form>
                </div>


            </div>
        );
    }
}

export default AddItem



/*

<div style={{display: this.state.open ? "block" : "none" , textAlign:"left", margin:"5px"}}>
                Item Name:
                <input
                    type="text"
                    value={this.state.name}
                    name="name"
                    placeholder="Insert Name"
                    onChange={this.handleChange}
                />
                <br />
                <input type="submit" value="ADD" onClick={this.handleSubmit}/>
            </div>

*/
