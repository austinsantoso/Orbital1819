import React from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      errorMessage: '',
      registerSuccess: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.username === "" || this.state.password === "") {
      this.setState({
        errorMessage: 'Fields cannot be empty'
      });
    } else {
      const loginData = {
        username: this.state.username,
        password: this.state.password
      };

      Axios.post('http://localhost:5000/createUser', loginData)
        .then(response => {
          this.props.setUserData(response.data);
          this.setState({ registerSuccess: true });
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 400) {
              this.setState({
                errorMessage: 'Username has already been taken'
              });
            }
          }
        });
    }
  }

  render() {
    return (
      <div className="loginForm" id="register-form">

        {this.state.registerSuccess && <Redirect to={{ pathname: '/' }} />}

        <form className="loginform-container" autoComplete="off">
          <h1>Register</h1>

          <label><b>Username</b></label>
          <input type="text" placeholder="Enter Username" name="username" onChange={this.handleChange} value={this.state.username} required />

          <label><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="password" onChange={this.handleChange} value={this.state.psw} required />

          {this.state.errorMessage !== "" && <p className="error">{this.state.errorMessage}</p>}

          <button type="submit" className="btn primary text-center" onClick={this.handleSubmit}>Create Account</button>
        </form>
      </div>
    );
  }
}

export default RegisterPage;