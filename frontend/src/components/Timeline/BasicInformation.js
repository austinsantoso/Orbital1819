import React from 'react'
import moment from 'moment'
import axios from 'axios'


import './Sidemenu.css'


class BasicInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.data.eventId,

            //vacationName: this.props.data.vacationName,
            //destination: this.props.data.destination,
            //startDate: this.props.data.defaultTimeStart.format("YYYY-MM-DD"),
            //endDate: this.props.data.defaultTimeEnd.format("YYYY-MM-DD"),

            validDate: true,
            //handleChangeDate: this.props.handleChangeData,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }


    handleChangeDate(event) {
        const { name, value } = event.target
        this.props.handleChange(name, moment(value, 'YYYY-MM-DD'))
    }

    handleChange(event) {
        const { name, value } = event.target
        this.props.handleChange(name, value)
    }

    handleSubmit(event) {

        if ((new Date(this.props.data.defaultTimeStart).getTime() > new Date(this.props.data.defaultTimeEnd).getTime())) {
            this.setState({
                validDate: false
            });
        } else {
            console.log("Basic Information: Changing Basic Information")
            console.log("eventId: " + this.state.eventId)
            axios.post('http://localhost:5000/event/updateBasic/' + this.state.eventId, {
                vacationName: this.props.data.vacationName,
                defaultTimeStart: moment(this.props.data.defaultTimeStart).startOf("day").unix(),
                defaultTimeEnd: moment(this.props.data.defaultTimeEnd).endOf("day").unix(),
                destination: this.props.data.destination,
                description: this.props.data.description
            }).then(
                this.setState({
                    validDate: true
                })
            ).catch((err) => {
                if (err) {
                    console.log(err.message)
                }
            })
        }
        event.preventDefault();

    }

    render() {
        console.log("renndering basic information", this.props.data)
        return (
            <div style={{ width: "300px", height: "", margin: "10px", paddingLeft: "10px", paddingBottom: "30px", paddingRight: "5px", border: "1px solid black", float: "container", marginTop: "30px" }}>
                The Trip
                <form onSubmit={this.handleSubmit}>
                    <div style={{ float: "left" }}>
                        Trip Name:
                    <input
                            type="text"
                            placeholder="Your Trip"
                            value={this.props.data.vacationName}
                            name="vacationName"
                            onChange={this.handleChange}
                            autoComplete="off"
                            style={{ margin: "5px" }}
                        />
                    </div>
                    <br /><br />
                    <div style={{ float: "left" }}>
                        Destination:
                    <input
                            type="text"
                            placeholder="destination"
                            value={this.props.data.destination}
                            name="destination"
                            onChange={this.handleChange}
                            style={{ margin: "5px" }}
                        />
                    </div>
                    <br /><br />
                    <div style={{ float: "left" }}>
                        Starting Date:
                    <input
                            type="date"
                            value={moment(this.props.data.defaultTimeStart).format("YYYY-MM-DD")}
                            name="defaultTimeStart"
                            onChange={this.handleChangeDate}
                            style={{ margin: "5px" }}
                        />
                    </div>
                    <br /><br />
                    <div style={{ float: "left" }}>
                        Ending Date:
                    <input
                            type="date"
                            value={moment(this.props.data.defaultTimeEnd).format("YYYY-MM-DD")}
                            name="defaultTimeEnd"
                            onChange={this.handleChangeDate}
                            style={{ margin: "5px" }}
                        />
                    </div>
                    <br /><br />
                    <div style={{ float: "left" }}>
                        Description:
                    <input
                            type="text"
                            placeholder="Description"
                            value={this.props.data.description}
                            name="description"
                            onChange={this.handleChange}
                            autoComplete="off"
                            style={{ margin: "5px" }}
                        />
                    </div>
                    <br /><br />
                    <p style={{ color: "red" }}>{this.state.validDate ? "" : "Invalid Date Selection"}</p>
                    <input
                        type="submit"
                        value="Save"
                        style={{ float: "right" }}
                    />
                </form>
            </div>
        );
    }
}

export default BasicInformation