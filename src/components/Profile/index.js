import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Profile extends Component {

  constructor() {
    super()
    this.state = {
      username : "user152401",
      trophies : 105,
      friends : [
                {name : "jimbro3", trophies : 43},
                {name : "dave121", trophies : 120},
                {name : "user103", trophies : 9002},
                {name : "someon112", trophies : 124},
                {name : "user122", trophies : 53}
                ]
    }

    this.getRandomColor = this.getRandomColor.bind(this)
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    let friends = this.state.friends.map((friend) => {
      let bgColor = this.getRandomColor()
      return (
        <li style={{backgroundColor : bgColor}} className="friend-item">
          <h4 className="friend-list-friend-name">{friend.name}</h4>
          <div className="codecomp-friends-list-trophy-container">
            <img className="codecomp-trophy-friends-list" src={require("../../assets/codecomp-small.png")}></img>
            <h4 className="friend-list-friend-tophies-title">{friend.trophies}</h4>
          </div>
        </li>
      )
    })
    return (
      <div id="profileComponent">
      <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <div id="profileContainer">
          <img id="codecomp-avatar-large" src={require("../../assets/codecomp-profile.png")}></img>
        </div>

        <h3 className="profile-title">{this.state.username}</h3>
        <h3 className="profile-title">trophies - {this.state.trophies}</h3>
        <ul id="friend-list">
          {friends}
        </ul>


      </div>
    )
  }
}

export default Profile;
