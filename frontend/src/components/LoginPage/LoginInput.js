import React from 'react'
import Axios from 'axios'
import {
    NavLink,
    Redirect
} from 'react-router-dom';


class LoginInput extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            psw: "",
            userexist: true,
            emptyfield: false,
            toRedirect: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        })
    }

    handleLogin(event) {
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
                    console.log(res[0])
                    if (res.length === 0) { //user does not exist
                        this.setState({
                            userexist: false,
                            emptyfield: false
                        })
                    } else {
                        var pass = res[0].password
                        var correct = pass.localeCompare(this.state.psw) === 0
                        if (!correct) {
                            this.setState({
                                userexist: false,
                                emptyfield: false
                            })
                        } else {
                            const data = {
                                id: res[0].id,
                                username: this.state.username,
                            }

                            localStorage.setItem('userData', JSON.stringify(data))

                            this.props.setUserData({
                                id: res[0].id,
                                username: this.state.username
                            })

                            this.setState({
                                toRedirect: true
                            })
                        }

                    }
                })
        }

    }

    render() {
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
                }}
                />
            )
        } else {
            return (
                <div className="loginForm" id="myForm">
                    <form className="loginform-container" autoComplete="off">
                        <h1>Login</h1>

                        <label><b>Username</b></label>
                        <input type="text" placeholder="Enter Username" name="username" onChange={this.handleChange} value={this.state.username} required />

                        <label><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="psw" onChange={this.handleChange} value={this.state.psw} required />
                        {this.state.userexist
                            ? ""
                            : <p style={pstyle}>Username or Password Incorrect</p>}
                        {!this.state.emptyfield
                            ? ""
                            : <p style={pstyle}>There is an empty field</p>}
                        <button type="submit" className="btn text-center" onClick={this.handleLogin}>Login</button>
                        <NavLink to="/register"><button type="submit" className="btn cancel" >Create an Account</button></NavLink>
                    </form>
                </div>
            )
        }
    }

}

export default LoginInput