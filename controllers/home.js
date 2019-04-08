const Club = require('../models/clubs');
// Get
module.exports.home = async (req, res) => {
    const data = await Club.find({}, (err, data) => {
        if(err) console.log(err);
        else {
            return data;     
        }
    });
    const country = await Club.aggregate(
        [{$group: {_id: "$country"}}],
        ( err, data) => {
            return data;
        }
    )
    res.render("home", {title: "Home", data, country, user: req.user});

}