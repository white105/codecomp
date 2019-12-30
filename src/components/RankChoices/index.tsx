import React, { Component, useState } from "react";
import { Link } from "react-router-dom";

interface RankChoicesProps {}
const RankChoices: React.FC<RankChoicesProps> = props => {
  const [num_trophies, setTrophies] = useState<number>(100);

  return (
    <div>
      <Link className="home-page-link" to="/">
        <img
          id="codecomp-trophy-small"
          src={require("../../assets/codecomp-small.png")}
        ></img>
      </Link>

      <div id="RankChoicesComponent">
        <div className="rankChoiceRow">
          <Link className="home-page-link" to="/loader">
            <div className="rankChoice">
              <h3 className="rankChoiceTitle">100 Trophies</h3>
              <p className="rankChoiceDescription">
                Wager trophies against beginner level players and develop your
                skills
              </p>
            </div>
          </Link>

          {num_trophies >= 300 ? (
            <Link className="home-page-link" to="/loader">
              <div className="rankChoice">
                <h3 className="rankChoiceTitle">300 Trophies</h3>
                <p className="rankChoiceDescription">
                  Algorithm challenges are still easy level difficulty
                </p>
              </div>
            </Link>
          ) : (
            <Link className="home-page-link">
              <div className="lockedRankChoice">
                <div className="grayOverlay">
                  <h3 className="rankChoiceTitle">300 Trophies</h3>
                  <div className="lockImageContainer">
                    <img
                      src={require("../../assets/lock.png")}
                      className="lockImage"
                    />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {num_trophies >= 1000 ? (
            <Link className="home-page-link" to="/loader">
              <div className="rankChoice">
                <h3 className="rankChoiceTitle">1000 Trophies</h3>
                <p className="rankChoiceDescription">
                  Challenges become a little more difficult and players are
                  somewhat skilled
                </p>
              </div>
            </Link>
          ) : (
            <div className="lockedRankChoice">
              <div className="grayOverlay">
                <h3 className="rankChoiceTitle">1000 Trophies</h3>
                <div className="lockImageContainer">
                  <img
                    src={require("../../assets/lock.png")}
                    className="lockImage"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rankChoiceRow">
          {num_trophies >= 2500 ? (
            <Link className="home-page-link" to="/loader">
              <div className="rankChoice">
                <h3 className="rankChoiceTitle">2500 Trophies</h3>
                <p className="rankChoiceDescription">
                  Get matched with a random player from around the world and
                  compete to solve algorithm problems
                </p>
              </div>
            </Link>
          ) : (
            <div className="lockedRankChoice">
              <div className="grayOverlay">
                <h3 className="rankChoiceTitle">2500 Trophies</h3>
                <div className="lockImageContainer">
                  <img
                    src={require("../../assets/lock.png")}
                    className="lockImage"
                  />
                </div>
              </div>
            </div>
          )}

          {num_trophies >= 5000 ? (
            <Link className="home-page-link" to="/loader">
              <div className="rankChoice">
                <h3 className="rankChoiceTitle">5000 Trophies</h3>
                <p className="rankChoiceDescription">
                  Invite your friends to compete with you
                </p>
              </div>
            </Link>
          ) : (
            <div className="lockedRankChoice">
              <div className="grayOverlay">
                <h3 className="rankChoiceTitle">5000 Trophies</h3>
                <div className="lockImageContainer">
                  <img
                    src={require("../../assets/lock.png")}
                    className="lockImage"
                  />
                </div>
              </div>
            </div>
          )}

          {num_trophies >= 2500 ? (
            <Link className="home-page-link" to="/loader">
              <div className="rankChoice">
                <h3 className="rankChoiceTitle">10000 Trophies</h3>
                <p className="rankChoiceDescription">
                  Invite your friends to compete with you
                </p>
              </div>
            </Link>
          ) : (
            <div className="lockedRankChoice">
              <div className="grayOverlay">
                <h3 className="rankChoiceTitle">10000 Trophies</h3>
                <div className="lockImageContainer">
                  <img
                    src={require("../../assets/lock.png")}
                    className="lockImage"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankChoices;
