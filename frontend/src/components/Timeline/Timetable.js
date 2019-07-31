import React from 'react'
import axios from 'axios'
import moment from 'moment'
import AddItem from './AddItem'
import ItemDesc from './ItemDesc'
import Timeline from 'react-calendar-timeline'

import './Timeline.css'

/*
state:
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
			desc
*/

class Timetable extends React.Component {
	constructor(props) {
		super(props);

		this.state = this.props.data
		this.state.show = false;

		this.handleAddItem = this.handleAddItem.bind(this)
		this.pending = this.pending.bind(this)
	}

	handleAddItem(newItem) {
		console.log(this.state.defaultTimeStart)
		console.log(this.state.items)
		console.log("Adding item")

		var temp = [].concat(this.state.items)
		console.log("this is temp", temp)
		temp.push(
			newItem
		)

		console.log("this is temp 2", temp)
		var temp2 = {
			items: temp
		}
		this.props.handleChangeState(temp2)
		this.setState({
			items: temp,
			show: false,
		})
	}
	//so that the thing can move
	handleItemMove = (itemId, dragTime, newGroupOrder) => {
		const { items, groups } = this.state;

		const group = groups[newGroupOrder];

		var temp = {
			items: items.map(item =>
				item.id === itemId
					? (axios.post('http://localhost:5000/event/updateItem/' + this.state.eventId + "/" + itemId, {
						startTime: moment(dragTime, 'x').unix(),
						endTime: moment(dragTime + (item.end_time - item.start_time), 'x').unix(),
					}).then()
						.catch((err) => {
							console.log(err)
						}), Object.assign({}, item, {
							start_time: dragTime,
							end_time: dragTime + (item.end_time - item.start_time),
							group: group.id
						}))
					: item
			)
		};


		this.props.handleChangeStateNo(temp)
		this.setState(temp);

		console.log("Moved", itemId, dragTime, newGroupOrder);
	};
	//to resize an item
	handleItemResize = (itemId, time, edge) => {
		const { items } = this.state;
		var temp = {
			items: items.map(item =>
				item.id === itemId
					? (axios.post('http://localhost:5000/event/updateItem/' + this.state.eventId + "/" + itemId, {
						startTime: moment(edge === "left" ? time : item.start_time, 'x').unix(),
						endTime: moment(edge === "left" ? item.end_time : time, 'x').unix(),
					}).then()
						.catch((err) => {
							console.log(err)
						}), Object.assign({}, item, {
							start_time: edge === "left" ? time : item.start_time,
							end_time: edge === "left" ? item.end_time : time
						}))
					: item
			)
		};
		this.props.handleChangeStateNo(temp)
		this.setState(temp);

		console.log("Resized", itemId, time, edge);
	};

	componentDidUpdate(prevProps) {
		if (this.props.data.defaultTimeStart !== this.state.defaultTimeStart
			|| this.props.data.defaultTimeEnd !== this.state.defaultTimeEnd
			|| this.props.data.items !== this.state.items) {
			this.setState({
				defaultTimeStart: this.props.data.defaultTimeStart,
				defaultTimeEnd: this.props.data.defaultTimeEnd,
				items: this.props.data.items,
			})
		} else {
		}
	}

	changeName = (itemId, newName) => {
		const { items } = this.state;
		this.setState({
			items: items.map(item =>
				item.id === itemId
					? Object.assign({}, item, {
						title: newName
					})
					: item
			)
		});
	}

	// this limits the timeline to -1 days to +1 days
	//so they cannot scroll beyond that
	onTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {

		const minTime = this.state.defaultTimeStart.startOf("day").valueOf();
		const maxTime = this.state.defaultTimeEnd.endOf("Day").valueOf();
		if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
			updateScrollCanvas(minTime, maxTime)
		} else if (visibleTimeStart < minTime) {
			updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
		} else if (visibleTimeEnd > maxTime) {
			updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
		} else {
			updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
		}
	}

	pending() {
		setTimeout(function () {
			this.setState({ show: true })
		}.bind(this), 1000)
		return <h1>loading</h1>
	}
	componentDidMount() {
		//{console.log(this.temptimetable.clientHeight)}
		//this.setState({tempheight: this.temptimetable.clientHeight})
	}
	render() {
		console.log("Timetable: rendering timetbale")
		const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;
		console.log(this.state.items)
		console.log({ items })
		return (
			<div>
				{!this.state.show
					? this.pending()
					: <div>

						<div style={{ float: "top" }}>
							<h4><i>{this.props.data.vacationName}TEMP</i></h4>
							<Timeline

								groups={groups}
								items={items}

								defaultTimeStart={defaultTimeStart}
								defaultTimeEnd={defaultTimeEnd}

								visibleTimeStart={defaultTimeStart.unix() * 1000}
								VisibleTimeEnd={defaultTimeEnd.unix() * 1000}
								onTimeChange={this.onTimeChange}

								itemTouchSendsClick={false}
								stackItems
								itemHeightRatio={0.75}

								canMove={true}
								canResize={"both"}
								onItemMove={this.handleItemMove}
								onItemResize={this.handleItemResize}
							/>
							<hr style={{ marginBottom: "10px", marginTop: "10px" }} />
						</div>
					</div>}
				<hr style={{ marginBottom: "10px", marginTop: "10px" }} />
				<div>
					<AddItem handleAdd={this.handleAddItem} defaultTimeStart={this.state.defaultTimeStart} eventId={this.props.data.eventId} />
				</div>
				<hr style={{ marginBottom: "10px", marginTop: "10px" }} />
				<div style={{ position: "" }}>
					{this.props.data.desc.map((sug) => <ItemDesc key={sug.id} id={sug.id} title={sug.title} text={sug.text} eventId={this.state.eventId} handleChangeState={this.props.handleChangeState} />)}
				</div>



			</div>
		)
	}
}

export default Timetable