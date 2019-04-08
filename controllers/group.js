const User = require("../models/users");

module.exports.groupPage = (req, res) => {
    const name = req.params.name;       // the group name
    // console.log(req.user)
    res.render("group-chat/", {name: name, title: "group-chat", user: req.user});
}

module.exports.postAddFriend = async (req, res) => {
    if(req.body.receiverName) {
        await User.update({
            'username': req.body.receiverName,
            'request.userId': {$ne: req.user._id},
            'friendsList.friendId': {$ne: req.user._id}
        },
        {
            $push: {
                'request': {
                    userId: req.user._id,
                    username: req.user.username
                }
            },
            $inc: {totalRequest: 1}
        }, (err, doc) => {
            console.log("upRequest" ,err, doc)
        });

        await User.update({
            'username': req.user.username,
            'sendRequest.username': {$ne: req.body.receiverName}
        },
        {
            $push: {'sendRequest': {username: req.body.receiverName}}
        }, (err, doc) => {
            console.log("upsendRequest", err, doc)
        })
    }
    
}