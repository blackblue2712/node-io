const Club = require('../models/clubs');
const User = require('../models/users');
const Message = require('../models/message');
// Get
module.exports.home = async (req, res) => {
    const regexCountry = new RegExp(req.query.country, 'g');
    const regexClubName = new RegExp(req.query.clubName, 'g');
    const nameRegex = new RegExp(req.user.username, 'i');
    Promise.all([
        await User.findOne({
            username: req.user.username
        })
        .populate('request.userId'),
        await Club.find({
            $and: [{name: regexClubName}, {country: regexCountry}]
        }, (err, data) => {
            if(err) console.log(err);
            else {
                return data;     
            }
        }),
        await Club.aggregate(
            [{$group: {_id: "$country"}}],
            ( err, data) => {
                return data;
            }
        ),
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
    ])
    .then(result => {
        console.log(result[2])
        res.render("home", {title: "Home", dataRequest: result[0], data: result[1], country: result[2], user: req.user, chat: result[3]});
    })

}

module.exports.addFav = async (req, res) => {
    Promise.all([
        await Club.update({
            _id: req.body.idClub,
            'fans.username': {$ne: req.user.username}
        }, {
            $push: { fans: {
                username: req.user.username,
                email: req.user.email
            }}
        })
    ]).then(result => {
        console.log(result)
        res.redirect("/");
    })
    // res.redirect("/");
}