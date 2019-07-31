import React from 'react'

import './Sidemenu.css'

class Sidemenu extends React.Component {
    constructor(props) {
        super(props);

        this.toggleContent = this.toggleContent.bind(this)
    }

    toggleContent(event) {
        console.log(event.target.name)
        console.log("Sidemenu: toggling content")
        this.props.toggleContent(event.target.name)
    }

    render() {
        return (
            <div className="sidemenu" style={{width: this.props.visible ? "230px" : "40px"}}>

                <div className="togglebtn" onClick={this.props.togglesidebar}>
                        <span></span>
                        <span></span>
                        <span></span>
                </div>
                <div className="sidebar" style={{display: this.props.visible ? "block" : "none"}}>
                    <button name="info" onClick={this.toggleContent}>Basic Information</button>
                    <button name="timetable" onClick={this.toggleContent}>TimeLine</button>
                    <button name="suggestion" onClick={this.toggleContent}>Suggestions</button>
                    <button name="suggestion" onClick={this.toggleContent}>Refresh</button>
                    <button name="suggestion" onClick={this.props.handleDelete}>Delete</button>
                </div>
            </div>
        );
    }
}

export default Sidemenu