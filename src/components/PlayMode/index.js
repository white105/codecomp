import React, { Component } from 'react';
import alertify from 'alertifyjs';
import { Link } from 'react-router-dom';

class PlayMode extends Component {

  render() {
    return (
      <div>
      <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>

      <div id="PlayModeComponent">

        <Link className='home-page-link' to='/play-mode-1v1'>
        <div className="playModeChoice">
          <h3 className="playModeChoiceTitle">1 v 1</h3>
          <p className="playModeChoiceDescription">Get matched with a random player from background
          the world and compete to solve algorithm problems</p>
        </div>
        </Link>

        <Link className='home-page-link' to='/play-mode-friends'>
        <div className="playModeChoice">
          <h3 className="playModeChoiceTitle">Play vs Friends</h3>
          <p className="playModeChoiceDescription">Invite your friends to compete with you</p>
        </div>
        </Link>
      </div>
      </div>
    )
  }
}

export default PlayMode;
