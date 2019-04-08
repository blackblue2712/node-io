const express = require("express");
const router = express.Router();

const {
    groupPage,
    postAddFriend
} = require("../controllers/group");

router.get('/group/:name', groupPage);
router.post('/group/:name', postAddFriend);

module.exports = router;