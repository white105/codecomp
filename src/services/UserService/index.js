var request = require("request");

class UserService {
  register(username, password) {
    console.log("we made it here");
    var postData = {
      username: username,
      password: password
    };

    console.log("postData", postData);

    var url = "http://localhost:8080/register";
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

  login(username, password) {
    var postData = {
      username: username,
      password: password
    };

    var url = "http://localhost:8080/login";
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

      if (statusCode == 404 || statusCode == 401) {
        alert("User does not exist");
      } else {
        window.location.href = "http://localhost:3000/";
      }
    });
  }

  logout() {
    var url = "http://localhost:3000/logout";
    var options = { method: "get", url: url };

    request(options, function(err, res, body) {
      if (err) {
        console.error(err);
        throw err;
      }
      var headers = res.headers;
      var statusCode = res.statusCode;

      window.location.href = "http://localhost:3000/";
    });
  }

  getCurrentUser(callback) {
    var url = "http://localhost:3000/currentuser";
    var options = { method: "get", url: url };

    var current_user;

    request(options, function(err, res, body) {
      if (err) {
        console.error(err);
        throw err;
      }
      var headers = res.headers;
      var statusCode = res.statusCode;
      var current_user = JSON.parse(res.body);

      //current user username
      callback(current_user.username);
    });
  }
}

export default UserService;
