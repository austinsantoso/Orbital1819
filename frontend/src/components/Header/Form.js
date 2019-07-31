import React from 'react'


import {
    //BrowserRouter as Router,
    //StaticRouter, // for server rendering
    //Route,
    Link,
    Redirect,
    //Switch,
    //hashHistory
    // etc.
  } from 'react-router-dom';


class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            invitelink: "",
            logout: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this)
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

    handleLogout(event) {
        this.props.setUsername('')
        this.setState({
            logout: true
        })
    }

    render() {

        if(this.state.logout) {
            return (
                <Redirect to='/' />
            )
        } else {
            return (
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <td className="rightborder">
                            <Link to ="/"><button className="mainbutton">Existing Calendar</button></Link>
                                
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
                                <Link to="/newTimeLine"><button className="mainbutton">+Create New Calendar</button></Link>
                            </td>
                            <td className="leftborder">
                                {!this.props.username
                                    ?<Link to ="/login"><button className="mainbutton">Login</button></Link>
                                    :<button className="mainbutton" onClick={this.handleLogout}>Logout</button>}
                                
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
        
    }
}

export default Form