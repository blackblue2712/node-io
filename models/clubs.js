const mongoose = require("mongoose");

const clubSchema = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    image: {type: String, default: 'https://placehold.it/300x300'},
    fans: [
        {
            username: {type: String, default: ''},
            email: {type: String, default: ''}
        }
    ]
});

const Club = mongoose.model("Club" ,clubSchema);
module.exports = Club;