import React from 'react';
import Axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

import './loginstyle.css';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      loginSuccess: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleLogin(event) {
    event.preventDefault();

    if (this.state.username === "" || this.state.password === "") {
      this.setState({
        errorMessage: 'Fields cannot be empty'
      });
    } else {
      const loginData = {
        username: this.state.username,
        password: this.state.password
      }

      Axios.post('http://localhost:5000/authUser', loginData)
        .then(response => {
          this.props.setUserData(response.data);
          this.setState({ loginSuccess: true });
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 400) {
              this.setState({
                errorMessage: 'Login failed, please try again'
              });
            } else if (err.response.status === 401) {
              this.setState({
                errorMessage: 'Username or password incorrect'
              });
            }
          }
        });
    }
  }

  render() {
    return (
      <div className="loginForm" id="login-form">

        {this.state.loginSuccess && <Redirect to={{ pathname: '/' }} />}

        <form className="loginform-container" autoComplete="off">
          <h1>Login</h1>

          <label><b>Username</b></label>
          <input type="text" placeholder="Enter Username" name="username" onChange={this.handleChange} value={this.state.username} required />

          <label><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="password" onChange={this.handleChange} value={this.state.password} required />

          {this.state.errorMessage !== '' && <p className="error">{this.state.errorMessage}</p>}

          <button type="submit" className="btn primary text-center" onClick={this.handleLogin}>Login</button>
          <Link to="/register"><button type="submit" className="btn secondary text-center" >Create an Account</button></Link>
        </form>
      </div>
    );
  }
}

export default LoginPage;