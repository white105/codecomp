import { API_URL } from "./../../config";

var request = require("request");

class CodeService {
  runCode(code) {
    console.log("we made it here in run code");
    var postData = {
      code: code
    };

    console.log("postData", postData);

    var url = API_URL + "/api/v1/code";

    var options = {
      method: "post",
      body: postData,
      json: true,
      url: url
    };

    request(options, function(err, res, body) {
      if (err) {
        console.error("error posting json: ", err);
        throw err;
      }
      var headers = res.headers;
      var statusCode = res.statusCode;
    });
  }
}

export default CodeService;
