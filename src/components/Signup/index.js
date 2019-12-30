import React, { Component } from 'react';
import alertify from 'alertifyjs';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService'


class Signup extends Component {

  constructor() {
    super()
    this.state = {
      username : "",
      password : "",
      confirm_password : ""
    }

    this.createAccount = this.createAccount.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.userService = new UserService()
  }

  createAccount() {
    let username = this.state.username
    let password = this.state.password
    let confirm_password = this.state.confirm_password

    if (username.length == 0) {
      alertify
        .alert("username text input is empty", function(){
          alertify.message('OK');
        });
      return
    }

    if (password.length == 0) {
      alertify
        .alert("password text input is empty", function(){
          alertify.message('OK');
        });
      return
    }

    if (confirm_password.length == 0) {
      alertify
        .alert("confirm password text input is empty", function(){
          alertify.message('OK');
        });
      return
    }

    if (!(password === confirm_password)) {
      alertify
        .alert("password and confirm password do not match", function(){
          alertify.message('OK');
        });
      return
    }

    this.userService.register(this.state.username, this.state.password)
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div id="SignupComponent">
      <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <div id="signupForm">
          <h3 id="login-form-title">SIGN UP</h3>
          <div className="loginFormRow">
            <h4 className="login-form-subtitle">USERNAME</h4>
            <input name="username" value={this.state.username} onChange={this.handleInputChange} className="login-form-text-input" type="text"></input>
            <h4 className="login-form-subtitle">PASSWORD</h4>
            <input name="password" value={this.state.password} onChange={this.handleInputChange} className="login-form-text-input" type="password"></input>
            <h4 className="login-form-subtitle">CONFIRM PASSWORD</h4>
            <input name="confirm_password" value={this.state.confirm_password} onChange={this.handleInputChange} className="login-form-text-input" type="password"></input>
          </div>

          <Link className='login-page-link' to='/login'><button className="login-page-button">LOGIN</button></Link>
          <button onClick={this.createAccount} className="login-page-button">SIGN UP</button>
        </div>
      </div>
    )
  }
}

export default Signup;
