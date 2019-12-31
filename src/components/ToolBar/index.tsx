import React, { useState } from "react";

const ToolBar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Java");

  const changeLanguage = event => {};
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
};

export default ToolBar;
