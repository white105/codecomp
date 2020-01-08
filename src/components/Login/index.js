import React, { Component } from "react";
import alertify from "alertifyjs";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";

import { GoogleLogin } from 'react-google-login';
import GitHubLogin from 'react-github-login';


class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this);
    this.userService = new UserService();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  login() {
    let username = this.state.username;
    let password = this.state.password;

    if (username.length == 0) {
      alertify.alert("username text input is empty", function() {
        alertify.message("OK");
      });
      return;
    }

    if (password.length == 0) {
      alertify.alert("password text input is empty", function() {
        alertify.message("OK");
      });
      return;
    }
  }

  render() {

    const responseGoogle = (response) => {
      console.log(response);
    }

    const onSuccess = response => console.log(response);
    const onFailure = response => console.error(response);


    return (
      <div id="LoginComponent">
        <Link className="home-page-link" to="/">
          <img
            id="codecomp-trophy-small"
            src={require("../../assets/codecomp-small.png")}
          />
        </Link>
        <div id="loginForm">
          <h3 id="login-form-title">LOGIN</h3>
          <div className="loginFormRow">
            <h4 className="login-form-subtitle">USERNAME</h4>
            <input
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
              className="login-form-text-input"
              type="text"
            />
            <h4 className="login-form-subtitle">PASSWORD</h4>
            <input
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              className="login-form-text-input"
              type="password"
            />
          </div>

          <button onClick={this.login} className="login-page-button">
            LOGIN
          </button>
          <Link className="login-page-link" to="/signup">
            <button className="login-page-button">SIGN UP</button>
          </Link>
        </div>

        <GoogleLogin
          clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        ></GoogleLogin>

        <GitHubLogin clientId="ac56fad434a3a3c1561e"
            onSuccess={onSuccess}
            onFailure={onFailure}></GitHubLogin>

        

      </div>
    );
  }
}

export default Login;
