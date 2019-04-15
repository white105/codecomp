import React, { Component } from 'react';
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

    this.userService = new UserService()
    this.createAccount = this.createAccount.bind(this)
  }

  createAccount() {
    let username = this.state.username
    let password = this.state.password
    let confirm_password = this.state.confirm_password

    if (password === confirm_password) {
      alert("passwords don't match")
      return
    }

    //this.userService.register(this.state.username, this.state.password)
  }

  render() {
    return (
      <div id="SignupComponent">
      <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <div id="signupForm">
          <h3 id="login-form-title">SIGN UP</h3>
          <div className="loginFormRow">
            <h4 className="login-form-subtitle">USERNAME</h4>
            <input className="login-form-text-input" type="text"></input>
            <h4 className="login-form-subtitle">PASSWORD</h4>
            <input className="login-form-text-input" type="password"></input>
            <h4 className="login-form-subtitle">CONFIRM PASSWORD</h4>
            <input className="login-form-text-input" type="password"></input>
          </div>

          <Link className='login-page-link' to='/login'><button className="login-page-button">LOGIN</button></Link>
          <button onClick={this.createAccount} className="login-page-button">SIGN UP</button>
        </div>
      </div>
    )
  }
}

export default Signup;
