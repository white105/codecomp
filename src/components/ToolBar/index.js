import React, { Component } from 'react';

class ToolBar extends Component {

  constructor() {
    this.state = {
      programming_langage: "Java"
    }

  }

  changeLanguage(event) {

  }
  render() {
    return (
      <div className="ToolBar">
        <select id="programming-language-select">
          <option>Java</option>
          <option>Javascript</option>
          <option>Python</option>
          <option>Golang</option>
          <option>C</option>
          <option>C++</option>
          <option>C#</option>
          <option>Ruby</option>
          <option>Swift</option>
        </select>
      </div>
    );
  }
}

export default ToolBar;
