var fetch = require("node-fetch");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectID;

const Organization = require("../models/organization");
const Comment = require("../models/comment");

exports.getComments = (req, res, next) => {
  var orgName = req.params.orgname;
  Organization.findOne({ name: orgName })
    .then(org => {
      // If organization not found in DB
      if (!org) {
        res.status(200).json({
          message: "Organization doesn't exist in database yet! To add an organization to the DB, start by posting a comment to the organization!"
        });
      }
      // If organization is found in DB
      else {
        Comment.find({
          $and: [
            { organizationId: new ObjectId(org._id) },
            { isSoftDeleted: false }
          ]
        }).then(comments => {
          console.log("Retrieved comments successfully!");
          res.status(200).json({
            message: "Retrieved comments successfully!",
            comments: comments.map(c => c.comment)
          });
        });
      }
    })
    .catch(err => console.log(err));
};

exports.postComment = (req, res, next) => {
  var comment = req.body.comment;
  var orgName = req.params.orgname;
  Organization.findOne({ name: orgName })
    .then(org => {
      // If organization not found, create new instance
      if (!org) {
        org = new Organization({
          name: orgName
        });

        org
          .save()
          .then(result => {
            console.log("Created new organization!");
          })
          .catch(err => console.log(err));
      }
      return org;
    })
    // Save the comment into Comment collection (linked to the organization found/created above)
    .then(org => {
      // Create new comment
      comment = new Comment({
        comment: comment,
        organizationId: org,
        isSoftDeleted: false
      });
      // JSON Success response
      return comment.save().then(result => {
        console.log("Saved comment successfully!");
        res.status(201).json({
          message: "Saved comment successfully!",
          comment: comment
        });
      });
    })
    .catch(err => console.log(err));
};

exports.deleteComments = (req, res, next) => {
  var orgName = req.params.orgname;
  Organization.findOne({ name: orgName }).then(org => {
    // If organization not found in DB
    if (!org) {
      res.status(200).json({
        message: "Organization doesn't exist in database yet! To add an organization to the DB, start by posting a comment to the organization!"
      });
    }
    // If organization is found in DB
    else {
      Comment.update(
        { organizationId: new ObjectId(org._id) },
        { isSoftDeleted: true },
        { multi: true }
      )
        .then(() => {
          console.log("Deleted comments successfully!");
          res.status(200).json({
            message: "Deleted comments successfully!"
          });
        })
        .catch(err => console.log(err));
    }
  });
};

async function getFollowersFollowing(url) {
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
    }
  });
  let data = await response.json();
  return data.length;
}

exports.getMembers = async (req, res, next) => {
  var orgName = req.params.orgname;

  let membersResponse = await fetch(
    "https://api.github.com/orgs/" + orgName + "/members",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
      }
    }
  );
  let membersJson = await membersResponse.json();

  for (i = 0; i < membersJson.length; i++) {
    const login = membersJson[i].login;
    membersJson[i].followers = await getFollowersFollowing(
      "https://api.github.com/users/" + login + "/followers"
    );
    membersJson[i].following = await getFollowersFollowing(
      "https://api.github.com/users/" + login + "/following"
    );
  }
  // RETRIEVE ONLY REQUIRED ATTRIBUTES
  membersJson = membersJson.map(m => {
    return {
      login: m.login,
      avatar_url: m.avatar_url,
      followers: m.followers,
      following: m.following
    };
  });
  // SORT DESCENDING BY NUMBER OF FOLLOWERS
  membersJson.sort((a, b) => b.followers - a.followers);
  // console.log(membersJson);
  res.status(200).json({
    message: "Retrieved members successfully!",
    members: membersJson
  });
};
