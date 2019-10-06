const User = require("../models/users");
const Message = require("../models/message");

module.exports.getPrivateChat = async (req, res) => {
    const nameRegex = new RegExp(req.user.username, 'i');
    const receiverRegex = new RegExp(req.params.name.split(".")[0].replace(/-/g, ' '), 'i');
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

        await Message.find({
            $or: [
                {$and: [{'senderName': nameRegex}, {'receiverName': receiverRegex}]},
                {$and: [{'senderName': receiverRegex}, {'receiverName': nameRegex}]}
            ]
        })
        .sort({'created': 1})
        .populate('sender')
        .populate('receiver')
    ])
    .then(result => {
        // console.log(result[1])
        res.render("private/private-chat", {title: "group-chat", user: req.user, dataRequest: result[0], chat: result[1], conversation: result[2]});
    })
}

module.exports.postPrivateChat = (req, res) => {
    let receiverName = req.params.name.split(".")[0].replace(/-/g, ' ');
    console.log(receiverName)
    Promise.all([
        User.findOne({
            username: {$regex: new RegExp(receiverName, 'gi')}
        })
    ])
    .then(results => {
        console.log(results);
        const newMessage = new Message();
        newMessage.message = req.body.message;
        newMessage.sender = req.user._id;
        newMessage.receiver = results[0]._id;
        newMessage.senderName = req.user.username;
        newMessage.receiverName = results[0].username;
        newMessage.userImage = req.user.userImage;

        newMessage.save((err, data) => {
            console.log("POST PRIVATE CHAT",data);
        });
    });
    res.redirect(`/chat/${req.params.name}`);
}

module.exports.seenMessage = async (req, res) => {
    let senderId = req.body.senderId;
    let receiverId = req.user._id;
    // console.log(senderId, receiverId);

    await Message.updateMany({
        sender: senderId,
        receiver: receiverId
    }, {
        $set: {isRead: true}
    })
    .then( result => {
        // console.log(result)
    })
}