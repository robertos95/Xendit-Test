const express = require('express');

const orgsController = require('../controllers/orgs');

const router = express.Router();

// GET /org/:orgname/comments
router.get('/:orgname/comments', orgsController.getComments);

// POST /org/:orgname/comments
router.post('/:orgname/comments', orgsController.postComment);

// DELETE /org/:orgname/comments
router.delete('/:orgname/comments', orgsController.deleteComments);

// GET /org/:orgname/members
router.get('/:orgname/members', orgsController.getMembers);

module.exports = router;