import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService'

class Login extends Component {

  constructor() {
    super()
    this.state = {
      username : "",
      password : ""
    }

    this.userService = new UserService()
    this.login = this.login.bind(this)
  }

  login() {
    let username = this.state.username
    let password = this.state.password

    
  }

  render() {
    return (
      <div id="LoginComponent">
        <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <div id="loginForm">
          <h3 id="login-form-title">LOGIN</h3>
          <div className="loginFormRow">
            <h4 className="login-form-subtitle">USERNAME</h4>
            <input className="login-form-text-input" type="text"></input>
            <h4 className="login-form-subtitle">PASSWORD</h4>
            <input className="login-form-text-input" type="password"></input>
          </div>

          <button onClick={this.login} className="login-page-button">LOGIN</button>
          <Link className='login-page-link' to='/signup'><button className="login-page-button">SIGN UP</button></Link>
        </div>
      </div>
    )
  }
}

export default Login;
