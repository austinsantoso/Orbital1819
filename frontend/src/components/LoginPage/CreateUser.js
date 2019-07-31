import React from 'react'
import Axios from 'axios'
import {
    Redirect
} from 'react-router-dom';


class CreateUser extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            psw: "",
            nameUsed: false,
            emptyfield: false,
            toRedirect: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        }, () => console.log(this.state))
    }

    handleSubmit(event) {
        event.preventDefault()
        var empt = ""
        if (empt.localeCompare(this.state.username) === 0 || empt.localeCompare(this.state.psw) === 0) {
            this.setState({
                emptyfield: true
            })
        } else {
            Axios.get('http://localhost:5000/event/users')
                .then((res) => {
                    return res.data
                }).then((res) => {
                    var output = res.filter((user) => {
                        var temp = user.username;
                        return (temp.localeCompare(this.state.username) === 0)
                    })
                    return output
                }).then((res) => {
                    console.log(res.length)
                    if (res.length === 0) { //so this id is not a duplicate
                        const data = {
                            username: this.state.username,
                            password: this.state.psw
                        }
                        Axios.post('http://localhost:5000/event/addusers', data)
                            .then((res) => {
                                this.props.setUsername(this.state.username)
                                this.setState({
                                    toRedirect: true
                                })
                            })
                    } else { // duplicate id
                        this.setState({
                            nameUsed: true,
                            emptyfield: false
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    render() {
        const style = {
            height: "380px",
            marginTop: "-175px",
        }
        const pstyle = {
            padding: "0",
            margin: "0",
            marginBottom: "10px",
            color: "red"
        }

        if (this.state.toRedirect) {
            return (
                <Redirect to={{
                    pathname: '/',
                }} />
            )
        } else {
            return (
                <div className="loginForm" id="myForm" style={style}>
                    <form className="loginform-container" autoComplete="off">
                        <h1>Register</h1>

                        <label><b>Username</b></label>
                        {!this.state.nameUsed
                            ? ""
                            : <p style={pstyle}>Username Used</p>}
                        <input type="text" placeholder="Enter Username" name="username" onChange={this.handleChange} value={this.state.username} required />

                        <label><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="psw" onChange={this.handleChange} value={this.state.psw} required />
                        {!this.state.emptyfield
                            ? ""
                            : <p style={pstyle}>There is an empty field</p>}
                        <button type="submit" className="btn" onClick={this.handleSubmit}>Create Account </button>
                    </form>
                </div>
            )
        }

    }
}

export default CreateUser