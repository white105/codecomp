import React, { Component, useState } from "react";
import alertify from "alertifyjs";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";

//text editor

import Editor from "react-simple-code-editor";

import { highlight } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import { languages } from "prismjs/components/prism-core";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism.css";

const sampleCode = `function add(a, b) {
  return a + b;
}
`;

interface ArenaProps {}

const Arena: React.FC<ArenaProps> = props => {
  const [code, setCode] = useState<string>(sampleCode);
  const [language, setLanguage] = useState<string>("javascript");

  const runCode = () => {
    //send code to API to be compiled and return results
  };

  const submitCode = () => {
    //send code to API to be compiled and return results + run against test cases
  };

  const handleChange = event => {
    setLanguage(event.target.value);
  };

  let syntax_highlight;
  switch (language) {
    case "javascript":
      syntax_highlight = languages.js;
      break;
    case "ruby":
      syntax_highlight = languages.rb;
      break;
    default:
    // code block
  }

  return (
    <div className="arena">
      <div className="info-bar">
        <h1>Two Sum</h1>

        <p className="problem-description">
          Given an array of integers, return indices of the two numbers such
          that they add up to a specific target.
        </p>
        <p className="problem-description">
          You may assume that each input would have exactly one solution, and
          you may not use the same element twice.
        </p>

        <div className="problem-example"></div>
      </div>

      <div className="text-editor">
        <select
          className="programming-language-choices"
          value={language}
          onChange={handleChange}
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
          <option value="c++">C++</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
        </select>

        <Editor
          className="code-editor"
          value={code}
          onValueChange={code => setCode(code)}
          highlight={code => highlight(code, syntax_highlight)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            overflow: "scroll",
            outline: "none"
          }}
        />

        <button className="submit-button" onClick={runCode}>
          Run Code
        </button>
        <button className="submit-button" onClick={submitCode}>
          Submit
        </button>
      </div>

      <div className="opponent-view" draggable="true"></div>
    </div>
  );
};

export default Arena;
