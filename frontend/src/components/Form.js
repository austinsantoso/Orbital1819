import React from 'react'


import {
    //BrowserRouter as Router,
    //StaticRouter, // for server rendering
    //Route,
    Link,
    //Switch,
    //hashHistory
    // etc.
  } from 'react-router-dom';


class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            invitelink: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleSubmit(event) {
        event.preventDefault();
    }

    handleChange(event) {
        // event.preventDefault();
        console.log("Event.target: ")
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        })
        console.log(event.target)
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <p>Name: {this.state.name}</p>
                    <input 
                        type="text"
                        value={this.state.name}
                        name="name"
                        placeholder="Insert Name"
                        onChange={this.handleChange}
                    />
                    <input type="submit" value="Submit"/>
                </form>


                <h3>Table:</h3>
                <table>
                    <caption>this is caption</caption>
                    <tbody>
                    <tr>
                        <td className="rightborder">
                            <button className="mainbutton">Existing Calendar</button>
                        </td>
                        <td className="leftborder">
                            <form onSubmit={this.handleChange} autoComplete="off">
                                <p style={{marginBottom:"0px"}}>Invite Link:</p>
                                <input 
                                    type="text"
                                    value={this.state.invitelink}
                                    name="invitelink"
                                    placeholder="Insert invite link"
                                    onChange={this.handleChange}
                                    size="24"
                                />
                                <br />
                                <button className="mainbutton">Submit</button>
                                {/** <input type="submit" value="Submit"/>*/}
                            </form>
                        {/** <button className="mainbutton">two</button>*/}
                        </td>
                    </tr>
                    </tbody>
                    <tbody>
                    <tr>
                        <td className="rightborder">
                            <button className="mainbutton">Existing Calendar</button>
                        </td>
                        <td className="leftborder">
                        <Link to="/newTimeLine"><button className="mainbutton">+Create New Calendar</button></Link>
                        </td>
                    </tr>
                    </tbody>
                </table>
            
            </div>
        )
    }
}

export default Form