import React from 'react'
import axios from 'axios'
import downarrow from './downarrow.png'
//handleDescChange
class ItemDesc extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            rename: false,
            eventId: this.props.eventId,
            id: this.props.id,
            title: this.props.title,
            text: this.props.text,
        }
        this.toggleContent = this.toggleContent.bind(this)
        this.toggleRename = this.toggleRename.bind(this)
        this.saveRename = this.saveRename.bind(this)

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    toggleContent() {
        this.setState({
            open: !this.state.open
        })
        console.log("showing item Desc")
    }

    toggleRename() {
        this.setState({
            rename: !this.state.rename
        })
        console.log("toggling rename")
    }

    handleChange(event) {
        const { name, value } = event.target
        console.log("changing: ", name, ", ", value)
        this.props.handleChange(this.props.id, name, value)
    }

    handleSubmit(event) {
        console.log(event.target)
        event.preventDefault()
        axios.post('http://localhost:5000/event/updateItem/' + this.state.eventId + "/" + this.state.id, {
            //id: this.state.id,
            title: this.props.title,
            itemDesc: this.props.text
        }).then((res) => {
            return res
        })
            .catch((err) => {
                console.log(err);

            })

    }

    handleDelete() {
        console.log("deleting")
        axios.post('http://localhost:5000/event/deleteItem/' + this.props.eventId, {
            itemId: this.props.id
        }).then((res) => {
            this.props.handleDeleteItem(this.props.id)
            return res;
        }).catch((err) => {
            console.log(err);

        })
    }

    saveRename(event) {
        this.toggleRename();
        this.handleSubmit(event);
    }
    render() {
        const style = {
            width: "100%",
            border: "1px solid black",
            height: this.state.open ? "auto" : "30px",
            marginBottom: "5px",
            transition: "0.3s"
        }
        console.log("itemDesc: ", this.props)
        return (
            <div style={style}>
                <span style={{ height: "30px" }}>

                    <div style={{ float: "left" }}>
                        {!this.state.open
                            ? <b>{this.props.title}</b>
                            : this.state.rename
                                ? <div>
                                    <input type="text" name="title" value={this.props.title} style={{ float: "left" }} onChange={this.handleChange} />
                                    <div style={{ display: this.state.open ? "block" : "none", textAlign: "left", margin: "5px", height: "30px", float: "left" }}>
                                        <button onClick={this.saveRename}>Save</button>
                                    </div>
                                </div>
                                : <div>
                                    <i style={{ float: "left" }}>{this.props.title}</i>
                                    <div style={{ display: this.state.open ? "block" : "none", textAlign: "left", margin: "5px", height: "30px", float: "left" }}>
                                        <button onClick={this.toggleRename}>Rename</button>
                                    </div>
                                </div>}
                    </div>

                    <img src={downarrow} height="30" style={{ float: "right", cursor: "pointer" }} onClick={this.toggleContent} alt="clickMe" />
                </span>
                <hr style={{ display: this.state.open ? "block" : "none", width: "100%", float: "center", marginTop: "5px", marginBottom: "5px" }} />
                <div style={{ display: this.state.open ? "block" : "none", textAlign: "left", margin: "5px" }}>
                    <span>Google Places Desc</span>
                    <br />
                    <span>Google Map Thing</span>
                    <br />
                    <span>Other Things</span>
                    <br />
                    <span>Notes: </span>
                    <br />
                    <textarea
                        style={{ resize: "none" }}
                        rows="4"
                        cols="60"
                        onChange={this.handleChange}
                        name="itemDesc"
                        value={this.props.text}
                        placeholder="Write Something" />
                    <br />
                    <input type="submit" value="Save" onClick={this.handleSubmit} />
                    <button onClick={this.handleDelete}>Delete</button>
                </div>
            </div>
        );
    }
}

export default ItemDesc