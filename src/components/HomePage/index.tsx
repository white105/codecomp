import React, { useState } from "react";
import { Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <>
      {isLoggedIn ? (
        <div id="HomePageComponent">
          <div id="trophy-container-top-left">
            <FontAwesome id="font-awesome-trophy" name="trophy" size="2x" />
            <h3 id="font-aweome-title">105</h3>
          </div>
          <Link className="home-page-link" to="/profile">
            <img
              id="codecomp-avatar-small"
              src={require("../../assets/codecomp-profile.png")}
            ></img>
          </Link>
          <div id="home-page-main-container">
            <img
              id="website-logo"
              src={require("../../assets/codecomp.png")}
            ></img>
            <Link className="home-page-link" to="/play-mode">
              <button className="home-page-button">PLAY</button>
            </Link>
          </div>
        </div>
      ) : (
        <div id="HomePageComponent">
          <img
            id="website-logo"
            src={require("../../assets/codecomp.png")}
          ></img>
          <div id="home-page-sub-container">
            <Link className="home-page-link" to="/login">
              <button className="home-page-button">LOGIN</button>
            </Link>
            <Link className="home-page-link" to="/signup">
              <button className="home-page-button">SIGN UP</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
