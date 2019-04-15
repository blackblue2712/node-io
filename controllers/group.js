const User = require("../models/users");
const Message  = require('../models/message');
const MessageGroup  = require('../models/groupmessage');
module.exports.groupPage = async (req, res) => {
    const name = req.params.name;       // the group name
    const nameRegex = new RegExp(req.user.username, 'i');

    Promise.all([
        await User.findOne({
            username: req.user.username
        })
        .populate('request.userId'),
        await Message.aggregate([
            {$match: {$or: [{"senderName": nameRegex}, {"receiverName": nameRegex}]}},
            {$sort: {created: -1}},
            {$group: {
                "_id": {"last_message_between": {
                    $cond: [
                        {$gt: [
                            {$substrCP: ['$senderName', 0, 1]},
                            {$substrCP: ['$receiverName', 0, 1]}
                        ]},
                        {$concat: ["$senderName", " and ", "$receiverName"]},
                        {$concat: ["$receiverName", " and ", "$senderName"]},
                    ]
                }},
                "body": {$first: "$$ROOT"},
            }}
        ]),
        await MessageGroup.find({name: name})
            .populate('senderId', '_id username userImage')
    ])
    .then(result => {
        console.log(result[2])
        res.render("group-chat/", {name: name, title: "group-chat", user: req.user, dataRequest: result[0], chat: result[1], chatGroup: result[2]});
    })
    // console.log(req.user)

}

module.exports.postAddFriend = async (req, res) => {
    if(req.body.receiverName) {
        Promise.all([
            User.update({
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
            }),
    
            User.update({
                'username': req.user.username,
                'sendRequest.username': {$ne: req.body.receiverName}
            },
            {
                $push: {'sendRequest': {username: req.body.receiverName}}
            }, (err, doc) => {
                console.log("upsendRequest", err, doc)
            })
        ])
        .then( result => {
            console.log(result);
        })
    }
    res.redirect(`/group/${req.body.room}`);
}

module.exports.postAcceptFriend = async (req, res) => {
    if(req.body.senderName) {
        console.log(req.body.senderName, req.body.senderId, req.params.name);
        Promise.all([
            User.update({
                '_id': req.user._id,
                'friendsList.friendId': {$ne: req.body.senderId}
            },
            {
                $push: {
                    'friendsList': {
                        friendId: req.body.senderId,
                        friendName: req.body.senderName
                    }
                },
                $pull: {request: {
                    userId: req.body.senderId,
                    username: req.body.senderName
                }},
                $inc: {totalRequest: -1}
            }, (err, doc) => {
                // console.log("upRequest" ,err, doc)
            }),
            User.update({
                '_id': req.body.senderId,
                'friendsList.friendId': {$ne: req.user._id}
            },
            {
                $push: {
                    'friendsList': {
                        friendId: req.user._id,
                        friendName: req.user.username
                    }
                },
                $pull: {sendRequest: {
                    username: req.user.username
                }},
            }, (err, doc) => {
                // console.log("upRequest" ,err, doc)
            })
        ])
        .then( result => {
            // console.log(result);
        })
    }
    res.redirect(`/group/${req.params.name}`);
}

module.exports.postCancelFriend = async (req, res) => {
    if(req.body.senderIdCancel) {
        console.log(req.body.senderIdCancel, req.params.name);
        Promise.all([
            User.update({
                '_id': req.user._id,
                'request.userId': {$eq: req.body.senderIdCancel}
            },
            {
                $pull: {request: {
                    userId: req.body.senderIdCancel
                }},
                $inc: {totalRequest: -1}
            }, (err, doc) => {
                console.log("upRequest" ,err, doc)
            }),
            User.update({
                '_id': req.body.senderIdCancel,
                'sendRequest.username': {$eq: req.user.username}
            },
            {
                $pull: {sendRequest: {
                    username: req.user.username
                }},
            }, (err, doc) => {
                console.log("upRequest" ,err, doc)
            })
        ])
        .then( result => {
            // console.log(result);
        })
    }
    res.redirect(`/group/${req.params.name}`);
}

module.exports.postChatGroup = async (req, res)=> {
    messageG = new MessageGroup();
    messageG.senderId = req.user._id;
    messageG.name = req.params.groupName;
    messageG.body = req.body.message;

    await messageG.save((err, result) => {
        console.log(result)
    });

    res.redirect(`/group/${req.params.groupName}`);
}