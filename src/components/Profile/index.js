import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Rodal from 'rodal';

// include styles
import 'rodal/lib/rodal.css';

class Profile extends Component {

  constructor() {
    super()
    this.state = {
      username : "user152401",
      trophies : 105,
      color: 'none',
      image_url : "../../assets/codecomp-profile.png",
      friends : [
                { username : "jimbro3", trophies : 43 },
                { username : "dave121", trophies : 120 },
                { username : "user103", trophies : 9002 },
                { username : "someon112", trophies : 124 },
                { username : "user122", trophies : 53 }
              ],
      friendProfile : {
        username : '',
        trophies : 100
      },
      showFriendProfile : false
    }

    this.getRandomColor = this.getRandomColor.bind(this)
    this.showFriendProfile = this.showFriendProfile.bind(this)
    this.hideFriendProfile = this.hideFriendProfile.bind(this)
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  showFriendProfile(friend) {
    console.log("friend", friend)
    this.setState({
      friendProfile: friend,
      showFriendProfile : true
    })
  }

  hideFriendProfile() {
    this.setState({ showFriendProfile : false })
  }

  updateProfileColor(color) {
    this.setState({ color: color })
  }

  updateProfileImage(image_url) {
    console.log("why isnt it working!", image_url)
    this.setState({ image_url : image_url })
  }

  render() {
    let friends = this.state.friends.map((friend) => {
      let bgColor = '#8400ff'
      return (
        <button onClick={() => this.showFriendProfile(friend)} style={{ backgroundColor : bgColor }} className="friend-item">
          <h4 className="friend-list-friend-name">{friend.username}</h4>
          <div className="codecomp-friends-list-trophy-container">
            <img className="codecomp-trophy-friends-list" src={this.state.image_url}></img>
            <h4 className="friend-list-friend-tophies-title">{friend.trophies}</h4>
          </div>
        </button>
      )
    })

    let friendProfile = this.state.friendProfile
    return (
      <div id="profileComponent" style={{ backgroundColor : this.state.color }}>

      <Rodal visible={this.state.showFriendProfile} onClose={this.hideFriendProfile}>
        <div className="friend-profile">
          <h3>{friendProfile.username}</h3>
          <img className="codecomp-avatar-small" src={require("../../assets/codecomp-profile.png")}></img>
          <h4 className="friend-profile-details">Trophies - {friendProfile.trophies}</h4>
        </div>
      </Rodal>


      <Link className='home-page-link' to='/'><img id="codecomp-trophy-small" src={require("../../assets/codecomp-small.png")}></img></Link>
        <div id="profileContainer">
          <img className="codecomp-avatar-large" src={require("../../assets/codecomp-profile.png")}></img>
        </div>

        <h3 className="profile-title">{this.state.username}</h3>


        <h3 className="profile-title">trophies - {this.state.trophies}</h3>

        <div className="profile-color-button-container">

          <button className="color-button" id="red-button" onClick={() => this.updateProfileColor("red")}></button>
          <button className="color-button" id="blue-button" onClick={() => this.updateProfileColor("blue")}></button>
          <button className="color-button" id="green-button" onClick={() => this.updateProfileColor("green")}></button>
          <button className="color-button" id="orange-button" onClick={() => this.updateProfileColor("orange")}></button>
          <button className="color-button" id="purple-button" onClick={() => this.updateProfileColor("purple")}></button>

        </div>

        <div className="profile-image-choices">

          <img className="profile-image-choice" src={require('../../assets/profile-image-choices/techlead.jpg')}></img>
          <img className="profile-image-choice" src={require('../../assets/profile-image-choices/bezos.jpg')}></img>
          <img className="profile-image-choice" src={require('../../assets/profile-image-choices/zuck.jpg')}></img>
          <img className="profile-image-choice" src={require('../../assets/profile-image-choices/elon.jpg')}></img>
          <img className="profile-image-choice" src={require('../../assets/profile-image-choices/gates.jpg')}></img>
        </div>


        <div className="profile-sidebar">

          <h4 className="friends-list-title">Friends</h4>

          <div className="friend-list">
            {friends}
          </div>

        </div>

      </div>
    )
  }
}

export default Profile;
