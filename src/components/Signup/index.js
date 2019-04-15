import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {

  render() {
    return (
      <div id="LoginComponent">
      <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <div id="loginForm">
          <h3 id="login-form-title">SIGN UP</h3>
          <div className="loginFormRow">
            <h4 className="login-form-subtitle">USERNAME</h4>
            <input className="login-form-text-input" type="text"></input>
            <h4 className="login-form-subtitle">PASSWORD</h4>
            <input className="login-form-text-input" type="text"></input>
            <h4 className="login-form-subtitle">CONFIRM PASSWORD</h4>
            <input className="login-form-text-input" type="text"></input>
          </div>

          <Link className='login-page-link' to='/login'><button className="login-page-button">LOGIN</button></Link>
          <Link className='login-page-link' to='/signup'><button className="login-page-button">SIGN UP</button></Link>
        </div>
      </div>
    )
  }
}

export default Signup;
