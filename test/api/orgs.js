const expect = require("chai").expect;
const request = require("supertest");

const app = require("../../app.js");

describe("POST /comments", () => {
  it("OK, creating a new comment works", done => {
    let orgName = "xendit";
    let comment = "Looking to hire SE Asia's top dev talent!";
    let commentJson = { comment: comment };
    request(app)
      .post("/orgs/" + orgName + "/comments")
      .send(commentJson)
      .then(res => {
        const body = res.body;
        expect(res.statusCode).to.equal(201);
        expect(body).to.contain.property("comment");
        expect(body.comment.comment).to.equal(comment);
        expect(body.comment.organizationId.name).to.equal(orgName);
        expect(body.message).to.equal("Saved comment successfully!");
        done();
      })
      .catch(err => done(err));
  });
});

describe("GET /comments", () => {
  it("OK, get (not soft-deleted) comments works", done => {
    let orgName = "xendit";
    request(app)
      .get("/orgs/" + orgName + "/comments")
      .then(res => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        expect(body).to.contain.property("comments");
        expect(body.message).to.equal("Retrieved comments successfully!");
        done();
      })
      .catch(err => done(err));
  });
});

describe("DELETE /comments", () => {
  it("OK, soft delete comment works", done => {
    let orgName = "xendit";
    request(app)
      .delete("/orgs/" + orgName + "/comments")
      .then(res => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        expect(body.message).to.equal("Deleted comments successfully!");
        done();
      })
      .catch(err => done(err));
  });
});

describe("GET /members", () => {
  it("OK, get members works (sorted descending)", done => {
    let orgName = "xendit";
    request(app)
      .get("/orgs/" + orgName + "/members")
      .then(res => {
        const body = res.body;
        expect(res.statusCode).to.equal(200);
        expect(body.message).to.equal("Retrieved members successfully!");
        var members = body.members;
        // If more than one members in the org, ensure 1st member's # of followers >= last member's # of followers
        if(members.length > 1) {
          expect(body.members[0].followers).to.gte(body.members[members.length-1].followers);
        }
        done();
      })
      .catch(err => done(err));
  }).timeout(20000);
});
