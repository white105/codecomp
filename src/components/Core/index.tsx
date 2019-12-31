import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "../HomePage";
import Login from "../Login/index";
import PlayMode from "../PlayMode";
import Profile from "../Profile/index";
import Signup from "../Signup/index";
import RankChoices from "../RankChoices";
import Loader from "../Loader";
import Arena from "../Arena/index";

const Core: React.FC = () => {
  return (
    <>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/play-mode" component={PlayMode} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/play-mode-1v1" component={RankChoices} />
        <Route exact path="/loader" component={Loader} />
        <Route exact path="/arena" component={Arena} />
      </Router>
    </>
  );
};

export default Core;
