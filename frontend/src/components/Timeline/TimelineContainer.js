import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom'

class TimelineContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: "",
            path: "",
            finishGetting: false
        }

        this.getCode = this.getCode.bind(this)
    }

    getCode() {
        console.log("inside GetWord 2")
        axios.get('http://localhost:5000/event/new')
            .then((res) => {
                //add the event code to the user
                axios.get('http://localhost:5000/event/users')
                    .then((response) => {
                        return response.data
                    }).then((response) => {
                        var output = response.filter((user) => {
                            var temp = user.username;
                            return (temp.localeCompare(this.props.username) === 0)
                        })
                        return output
                    }).then((response) => {
                        console.log(response[0])
                        var userId = response[0].id;
                        var events = response[0].events
                        events += " " + res.data
                        events = events.trim()
                        const post = {
                            id: userId,
                            events: events
                        }
                        axios.post('http://localhost:5000/event/modifyusers', post)
                            .then((responseNotUsed) => {
                                //then redirect
                                this.setState({
                                    code: res.data,
                                    path: '/event/' + res.data,
                                    finishGetting: true,
                                }, () => {
                                    console.log("TimelineContainer finished")
                                    console.log(res.data)
                                })
                            })

                    })

            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                // ADD THIS THROW error
                throw error;
            })

    }

    componentDidMount() {
        this.getCode()
    }

    render() {
        var empt = ""

        if (empt.localeCompare(this.props.username) === 0) {
            return (
                <Redirect to='/login' />
            )
        } else {
            return (
                <div>
                    {this.state.finishGetting
                        ? <Redirect to={{ pathname: this.state.path, eventId: { id: this.state.code } }} />
                        : <h1> loading </h1>}
                </div>
            )
        }
    }
}

export default TimelineContainer