const express = require("express");
const router = express.Router();

const {
    getPrivateChat,
    postPrivateChat,
    seenMessage
} = require("../controllers/privateChat");

router.post('/chat/seen', seenMessage);
router.get('/chat/:name', getPrivateChat);
router.post('/chat/:name', postPrivateChat);

module.exports = router;