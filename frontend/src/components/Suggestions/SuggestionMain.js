import React from 'react'
import { Timeline, TimelineEvent } from 'react-event-timeline'
import Axios from 'axios'

import WriteSuggestion from './MakeSuggestion'
import './suggestionstyle.css'

/*
what a timeline event takes in 
    title: "John Doe sent a SMS",
    createdAt: "2016-09-12 10:06 PM",
    text: "I received the payment for $543. Should be shipping the item within a couple of hours."
*/
class SuggestionMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allSuggestion: []
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.toggleDelete = this.toggleDelete.bind(this)
        this.getContent = this.getContent.bind(this)
    }

    handleSubmit(newData) {
        this.setState({
            allSuggestion: this.state.allSuggestion.concat(newData)
        }, () => { console.log("NEW STATE"); console.log(this.state) })
    }


    getContent() {
        console.log("getting content")
        Axios.get('http://localhost:5000/event/suggestions/' + this.props.eventId)
            .then((res) => {
                console.log("res suggestion: ")
                console.log(res)
                if (("").localeCompare(res) === 1) {
                    console.log("items is null")
                    this.setState({
                        allSuggestion: [],
                    })
                } else {
                    console.log("items not null")
                    this.setState({
                        allSuggestion: res.data
                    }, () => console.log("State suggesiton:", this.state))
                }
            })
    }
    componentDidMount() {
        this.getContent()
    }

    toggleDelete(event) {
        console.log("toggle delete")
        console.log(event.target)
        Axios.post('http://localhost:5000/event/deleteSuggestion/' + this.props.eventId, { sugId: event.target.id })
            .then((res) => {
                this.getContent()
                return res
            })
    }
    render() {
        console.log("suggestion:", this.props)
        console.log(this.state.allSuggestion)
        return (
            <div>
                <h1 style={{ textAlign: "left", paddingLeft: "10px", alignContent: "center" }}>View Suggestions:</h1>
                <hr />
                <Timeline>
                    {this.state.allSuggestion.map((data) => {
                        return (
                            <TimelineEvent
                                id={data.id}
                                key={data.id}
                                title={data.title}
                                createdAt={data.createdAt}
                                icon={<i className="material-icons md-18" onClick={this.toggleDelete} id={data.id}>NEED_DELETE_ICON</i>}>
                                {data.text}
                            </TimelineEvent>
                        );
                    })}
                </Timeline>
                <hr />

                <WriteSuggestion submitHandle={this.handleSubmit} eventId={this.props.eventId} getContent={this.getContent} />
            </div>
        );
    }
}

export default SuggestionMain