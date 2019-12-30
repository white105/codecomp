import React from "react";
import FontAwesome from "react-fontawesome";

interface LoaderProps {}
const Loader: React.FC<LoaderProps> = props => {
  return (
    <div id="LoaderComponent">
      <FontAwesome id="loader-icon" name="sync" />
      <h1 id="loader-title">Looking for a player to match you with</h1>
    </div>
  );
};

export default Loader;
