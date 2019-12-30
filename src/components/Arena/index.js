import React, { Component } from "react";
import "prismjs/components/prism-clike";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-ruby";
import "prismjs/themes/prism.css";
//text editor
import Editor from "react-simple-code-editor";

const code = `function add(a, b) {
  return a + b;
}
`;

class Arena extends Component {
  constructor() {
    super();

    this.state = {
      code: code,
      language: "javascript"
    };

    this.runCode = this.runCode.bind(this);
    this.submitCode = this.submitCode.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  runCode() {
    //send code to API to be compiled and return results

    let code = this.state.code;
  }

  submitCode() {
    //send code to API to be compiled and return results + run against test cases

    let code = this.state.code;
  }

  handleChange(event) {
    this.setState({ language: event.target.value });
  }

  render() {
    let language = this.state.language;
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
            value={this.state.language}
            onChange={this.handleChange}
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
            value={this.state.code}
            onValueChange={code => this.setState({ code })}
            highlight={code => highlight(code, syntax_highlight)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              overflow: "scroll",
              outline: "none"
            }}
          />

          <button className="submit-button" onClick={this.runCode}>
            Run Code
          </button>
          <button className="submit-button" onClick={this.submitCode}>
            Submit
          </button>
        </div>

        <div className="opponent-view" draggable="true"></div>
      </div>
    );
  }
}

export default Arena;
