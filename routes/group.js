const express = require("express");
const router = express.Router();

const {
    groupPage,
    postAddFriend,
    postAcceptFriend,
    postCancelFriend,
    postChatGroup
} = require("../controllers/group");

router.post('/group/accept/:name', postAcceptFriend);
router.post('/group/cancel/:name', postCancelFriend);
router.get('/group/:name', groupPage);
router.post('/group/:name', postAddFriend);
router.post('/chat/:groupName', postChatGroup);


module.exports = router;