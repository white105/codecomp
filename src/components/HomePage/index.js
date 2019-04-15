import React, { Component } from 'react';
import CoderPad from '../CoderPad'
import { Link } from 'react-router-dom';

class HomePage extends Component {

  constructor() {
    super()
    this.state = {
      loggedIn : false
    }

  }



  render() {
    if (this.state.loggedIn) {
      return (
        <div id="HomePageComponent">
        <Link className='home-page-link' to='/profile'><img id="codecomp-avatar-small" src={require("../../assets/codecomp-profile.png")}></img></Link>
          <div id="home-page-main-container">
            <img id="website-logo" src={require("../../assets/codecomp.png")}></img>
            <button className="home-page-button">PLAY</button>
          </div>
        </div>
      );
    } else {
      return (
        <div id="HomePageComponent">
          <img id="website-logo" src={require("../../assets/codecomp.png")}></img>
          <div id="home-page-sub-container">
            <Link className='home-page-link' to='/login'><button className="home-page-button">LOGIN</button></Link>
            <Link className='home-page-link' to='/signup'><button className="home-page-button">SIGN UP</button></Link>
          </div>
        </div>
      )
    }
  }
}

export default HomePage;
