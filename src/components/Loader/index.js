import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome'

class Loader extends Component {

  render() {
    return (
      <div id="LoaderComponent">
        <FontAwesome id='loader-icon' name='sync' />
        <h1 id="loader-title">Looking for a player to match you with</h1>
      </div>
    )
  }
}

export default Loader;
