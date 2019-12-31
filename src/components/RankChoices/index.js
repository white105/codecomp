import React, { Component } from 'react';
import alertify from 'alertifyjs';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome'

class RankChoices extends Component {

  constructor() {
    super()
    this.state = {
      num_trophies: 100
    }
  }

  render() {
    return (
      <div>
        <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <Link className='home-page-link' to='/profile'><img id="codecomp-avatar-small" src={require("../../assets/default-profile.png")}></img></Link>

      </div>
    )
  }
}

export default RankChoices;
