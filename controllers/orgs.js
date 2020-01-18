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
          message: "Organization doesn't exist in database yet!"
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
        message: "Organization doesn't exist in database yet!"
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

exports.getMembers = (req, res, next) => {};
