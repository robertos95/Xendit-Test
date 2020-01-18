// module.exports = (req, res, next) => {
//   var orgName = req.params.orgname;

//   var https = require("https");
//   var options = {
//     host: "api.github.com",
//     path: "/orgs/" + orgName,
//     method: "GET",
//     json: true,
//     headers: { "user-agent": "node.js" }
//   };

//   var request = https.request(options, function(response) {
//     var body = "";
//     response.on("data", function(chunk) {
//       body += chunk.toString("utf8");
//     });

//     response.on("end", function() {
//       console.log("Body: ", body);
//     });
//   });

//   request.end();

//   next();
// };

module.exports = (req, res, next) => {
  var orgName = req.params.orgname;
  var request = require("request");

  var url = "https://api.github.com/orgs/" + orgName;
//   var body = [];

  request(
    {
      url: url,
      json: true,
      headers: { "user-agent": "node.js" }
    },
    function(error, response, body) {
      //   if (!error && response.statusCode === 200) {
      //     console.log(body); // Print the json response
      //   }

      // if(response.statusCode == 404) {
      //     res.status(404).json({
      //         message: "Organization not found on Github!"
      //       });
            console.log(body);
            return true;
      // }
        // body = body.message;
    //   return response.statusCode;
    }
  );
  
//   console.log(body);

  

  next();
};
