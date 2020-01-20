module.exports = (req, res, next) => {
  var orgName = req.params.orgname;
  var fetch = require("node-fetch");

  fetch("https://api.github.com/orgs/" + orgName, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(json => {
      // ORGANIZATION EXISTS IN GITHUB
      if (json.login) {
        next();
      }
      // ORGANIZATION DOES NOT EXISTS IN GITHUB
      else {
        res.status(404).json({
          message: "Organization is not found in github!"
        });
      }
      return json;
    });
};
