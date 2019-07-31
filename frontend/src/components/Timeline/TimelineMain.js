import React from 'react'
import moment from 'moment'
import { Redirect } from 'react-router-dom'

import Timetable from './Timetable'
import Sidemenu from './Sidemenu'
import BasicInformation from './BasicInformation'
import Suggestion from '../Suggestions/SuggestionMain'
import Axios from 'axios';




/*
			eventId: this.props.match.params.id,
			
			vacationName: "",
			destination: "",
			groups: [{ id: 1, title: 'The Plan', stackItems: true, stackItemsheight: 30 }],
			items: [
				{
				  id: 1,
				  group: 1,
				  title: 'item 1',
				  start_time: moment().add(1, 'days'),
				  end_time: moment().add(1, 'days').add(1, 'hour'),
				},
				{
				  id: 2,
				  group: 1,
				  title: 'item 2',
				  start_time: moment().add(-0.5, 'hour'),
				  end_time: moment().add(0.5, 'hour')
				},
				{
				  id: 3,
				  group: 1,
				  title: 'item 3',
				  start_time: moment().add(2, 'hour'),
				  end_time: moment().add(3, 'hour')
				}
			  ],
			defaultTimeStart: moment()
				.startOf("day"),
			defaultTimeEnd: moment().endOf("day").add(2, 'day'),
			
			sidebaropen: true,
			
			content: "info"

*/
class TimelineMain extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			deleted: false,

			eventId: this.props.match.params.id,

			vacationName: "",
			destination: "",
			groups: [{ id: 1, title: 'The Plan', stackItems: true, stackItemsheight: 30 }],
			items: [],
			defaultTimeStart: moment(),
			defaultTimeEnd: moment(),

			desc: [],

			suggestion: [],

			sidebaropen: true,

			content: "info"
		};
		this.togglesidebar = this.togglesidebar.bind(this);
		this.handleChange = this.handleChange.bind(this)
		this.handleDelete = this.handleDelete.bind(this)

		this.toggleContent = this.toggleContent.bind(this)
		this.timetableref = React.createRef();
	}

	getData() {
		//getting the basic info
		Axios.get('http://localhost:5000/event/basic/' + this.props.match.params.id)
			.then((res) => {
				console.log("res basic: ")
				console.log(res)
				this.setState({
					vacationName: res.data[0].name,
					destination: res.data[0].destination,
					defaultTimeStart: moment(res.data[0].startTime, "X").startOf("day"),
					defaultTimeEnd: moment(res.data[0].endTime, "X").endOf("day"),
					description: res.data[0].description
				}, () => console.log("State:", this.state))
			})
		//getting items
		Axios.get('http://localhost:5000/event/items/' + this.props.match.params.id)
			.then((res) => {
				console.log("res items: ")
				console.log(res)
				if (("").localeCompare(res) === 1) {
					console.log("items is null")
					this.setState({
						items: [],
					})
				} else {
					console.log("items not null")
					this.setState({
						items: res.data.map((itemObj) => {
							console.log("inside map")
							return {
								id: itemObj.id,
								group: 1,
								title: itemObj.title,
								start_time: moment(itemObj.startTime, 'X'),
								end_time: moment(itemObj.endTime, 'X'),
								itemDesc: itemObj.itemDesc
							}
						})
					}, () => console.log("State item:", this.state))
				}
			})
	}
	componentDidMount() {
		console.log("TimelineMain will mount")
		this.getData();
	}

	toggleContent(newContent) {
		this.setState({
			content: newContent
		})
		console.log("changed")
	}

	togglesidebar() {
		this.setState({
			sidebaropen: !this.state.sidebaropen
		})

	}

	handleChange(name, value) {
		this.setState({
			[name]: value
		})
	}

	handleDelete(event) {
		//confirm delete
		event.preventDefault()
		const empt = ""
		if (empt.localeCompare(this.props.username) === 0) { // no username aka no login

		} else {
			console.log("deleting")

			Axios.get('http://localhost:5000/event/users')
				.then((response) => {
					return response.data
				}).then((response) => {
					var output = response.filter((user) => {
						var temp = user.username;
						console.log("before locale compare:", this.props.username)
						return (temp.localeCompare(this.props.username) === 0)
					})
					return output
				}).then((response) => {
					console.log("Res[0]:", response[0])
					var userId = response[0].id;
					var events = response[0].events.split(" ")
					events = events.filter((x) => x.localeCompare(this.state.eventId) !== 0)
					var len = events.length
					var output = ""
					for (var i = 0; i < len; i++) {
						output += " " + events[i];
					}
					output = output.trim()
					const post = {
						id: userId,
						events: output
					}
					Axios.post('http://localhost:5000/event/modifyusers', post)
						.then((responseNotUsed) => {
							Axios.post('http://localhost:5000/event/deleteEvent/' + this.state.eventId)
								.then((res) => {
									this.setState({
										deleted: true
									})
								})
						})

				})
		}
	}

	render() {
		var tempString = this.state.content;
		console.log("timelineMainCOde: ", this.props.match.params.id)
		console.log("props:", this.props)
		console.log(this.state)
		if (this.state.deleted) {
			return (
				<Redirect to='/' />
			)
		} else {
			return (
				<div style={{ width: this.state.sidebaropen ? "calc(100% - 240px)" : "calc(100% - 50px)", top: "100px" }}>
					<Sidemenu togglesidebar={this.togglesidebar} visible={this.state.sidebaropen} toggleContent={this.toggleContent} handleDelete={this.handleDelete} />
					<div id="maincontent" style={{ marginLeft: this.state.sidebaropen ? "230px" : "40px", width: "100%" }}>
						{tempString.localeCompare("timetable") === 0
							? <Timetable data={this.state} sidebaropen={this.state.sidebaropen} ref={this.timetableref} handleChange={this.handleChange} />
							: tempString.localeCompare("info") === 0
								? <BasicInformation data={this.state} sidebaropen={this.state.sidebaropen} handleChange={this.handleChange} />
								: <Suggestion eventId={this.state.eventId} />}

					</div>
				</div>
			);
		}

	}
}

export default TimelineMain;