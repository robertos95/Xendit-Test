const express = require('express');

const orgsController = require('../controllers/orgs');

const router = express.Router({mergeParams: true});

// GET /org/:orgname/comments
router.get('/comments', orgsController.getComments);

// POST /org/:orgname/comments
router.post('/comments', orgsController.postComment);

// DELETE /org/:orgname/comments
router.delete('/comments', orgsController.deleteComments);

// GET /org/:orgname/members
router.get('/members', orgsController.getMembers);

module.exports = router;