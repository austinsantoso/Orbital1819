import React from 'react'
import axios from 'axios'
import moment from 'moment'
import AddItem from './AddItem'
import ItemDesc from './ItemDesc'
import Timeline from 'react-calendar-timeline'


// make sure you include the timeline stylesheet or the timeline will not be styled
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
			desc:[],
*/

class Timetable extends React.Component {
    constructor(props) {
    	super(props);

		this.state = {
			show: false
		}
		
		this.handleAddItem = this.handleAddItem.bind(this);
		this.handleDeleteItem = this.handleDeleteItem.bind(this)
		this.handleDescChange = this.handleDescChange.bind(this)
		this.pending = this.pending.bind(this)
	}

	handleAddItem(newItem) {
		console.log(this.props.data.defaultTimeStart)	
		console.log(this.props.data.items)
		console.log("Adding item")

		var temp = [].concat(this.props.data.items)
		temp.push(
			newItem
		)
		console.log("this is temp" ,temp)
		this.props.handleChange("items", temp)

		// var tempDesc = [].concat(this.props.data.desc)
		// tempDesc.push({
		// 	id: newItem.id,
		// 	title: newItem.title,
		// 	text: ""
		// })
		// console.log("this is tempDesc" ,tempDesc)
		// this.props.handleChange("desc", tempDesc)

		this.setState({
			show: false,
		})
	}
	//so that the thing can move
	handleItemMove = (itemId, dragTime, newGroupOrder) => {
		const { items, groups } = this.props.data;
	
		const group = groups[newGroupOrder];
	
		var temp = items.map(item =>
			  item.id === itemId
				? (axios.post('http://localhost:5000/event/updateItem/' + this.props.data.eventId + "/" + itemId, {
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
			);

		
		this.props.handleChange("items", temp)

		console.log("Moved", itemId, dragTime, newGroupOrder);
	};
	//to resize an item
	handleItemResize = (itemId, time, edge) => {
		const { items } = this.props.data;
		var temp = items.map(item =>
				item.id === itemId
				? (axios.post('http://localhost:5000/event/updateItem/' + this.props.data.eventId + "/" + itemId, {
					startTime: moment(edge === "left" ? time : item.start_time, 'x').unix(),
					endTime: moment(edge === "left" ? item.end_time : time, 'x').unix(),
					}).then()
					.catch((err) => {
						console.log(err)
				}),Object.assign({}, item, {
					start_time: edge === "left" ? time : item.start_time,
					end_time: edge === "left" ? item.end_time : time
					}))
				: item
			);

		this.props.handleChange("items", temp)
		
		console.log("Resized", itemId, time, edge);
	};
	//to delete an item
	handleDeleteItem(itemId) {
		console.log("Deleting item: ", itemId)

		var temp = [].concat(this.props.data.items)
		temp = temp.filter((x) => x.id !== itemId)		
		this.props.handleChange("items", temp)
		var tempDesc = [].concat(this.props.data.desc)
		tempDesc = tempDesc.filter((x) => x.id !== itemId)
		console.log("new tempDesc after filter: ", tempDesc)
		this.props.handleChange("desc", tempDesc)

		
		// this.setState({
		// 	show: false,
		// })
	}
	//to rename an item
	handleDescChange(itemId, name, newData) {
		const { items } = this.props.data;
		var temp = items.map(item =>
			item.id === itemId
			? (axios.post('http://localhost:5000/event/updateItem/' + this.props.data.eventId + "/" + itemId, {
				[name]: newData
				}).then()
				.catch((err) => {
					console.log(err)
			}),Object.assign({}, item, {
				[name]: newData
				}))
			: item
		);
		this.props.handleChange("items", temp)
		console.log("renamed item: ", itemId, " to ", name, ": ", newData)
	}

	// this limits the timeline to -1 days to +1 days
	//so they cannot scroll beyond that
	onTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {

	const minTime = this.props.data.defaultTimeStart.startOf("day").valueOf();
	const maxTime = this.props.data.defaultTimeEnd.endOf("Day").valueOf();
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
		setTimeout(function() {
			this.setState({show: true})
		}.bind(this), 1000)
		return <h1>loading</h1>
	}

    render() {
		console.log("Timetable: rendering timetable", this.props.data)
		const { groups, items, defaultTimeStart, defaultTimeEnd } = this.props.data;
		console.log(this.props.data.items)
		console.log({items})
		console.log(this.props.data.desc)
        return (
			<div>
				{!this.state.show
					? this.pending()
					: <div>
				
					<div style={{float:"top"}}>
						<h4><i>{this.props.data.vacationName}TEMP</i></h4>
						<Timeline
						
						groups = {groups}
						items = {items}
						
						defaultTimeStart = {defaultTimeStart}
						defaultTimeEnd = {defaultTimeEnd}
		
						visibleTimeStart= {defaultTimeStart.unix()*1000}
						VisibleTimeEnd= {defaultTimeEnd.unix()*1000}
						onTimeChange = {this.onTimeChange}
		
						itemTouchSendsClick={false}
						stackItems
						itemHeightRatio={0.75}
		
						canMove={true}
						canResize={"both"}
						onItemMove={this.handleItemMove}
						onItemResize={this.handleItemResize}
						/>
						<hr style={{marginBottom:"10px", marginTop:"10px"}}/>
					</div>
				</div>}
				<hr style={{marginBottom:"10px", marginTop:"10px"}}/>
				<div>
					<AddItem handleAdd={this.handleAddItem} defaultTimeStart={this.props.data.defaultTimeStart} eventId={this.props.data.eventId}/>
				</div>
				<hr style={{marginBottom:"10px", marginTop:"10px"}}/>
				<div style={{position:""}}>
					{this.props.data.items.map((sug) => <ItemDesc key ={sug.id} id={sug.id} title={sug.title} text={sug.itemDesc} eventId={this.props.data.eventId} handleDeleteItem={this.handleDeleteItem} handleChange={this.handleDescChange}/>)}
				</div>
			</div>
        )
    }
}

export default Timetable