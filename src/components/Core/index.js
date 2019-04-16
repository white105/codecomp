import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import HomePage from '../HomePage'
import Login from '../Login'
import Loader from '../Loader'
import PlayMode from '../PlayMode'
import Profile from '../Profile'
import Signup from '../Signup'
import RankChoices from '../RankChoices'

class Core extends Component {
  render() {
    return (
      <div>
        <Router>
            <div>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/play-mode' component={PlayMode} />
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/signup' component={Signup} />
              <Route exact path='/play-mode-1v1' component={RankChoices} />
              <Route exact path='/loader' component={Loader} />
            </div>
        </Router>
      </div>
    );
  }
}

export default Core;
