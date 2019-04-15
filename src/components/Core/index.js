import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomePage from '../HomePage'
import Login from '../Login'
import Signup from '../Signup'

class Core extends Component {
  render() {
    return (
      <div>
        <Router>
            <div>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/signup' component={Signup} />
            </div>
        </Router>
      </div>
    );
  }
}

export default Core;
