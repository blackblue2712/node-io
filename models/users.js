const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = mongoose.Schema({
    username: {type: String},
    fullname: {type: String, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    userImage: {type: String, default: 'https://placehold.it/300x300'},
    facebook: {type: String, default: ''},
    fbTokens: Array,
    google: {type: String, default: ''},
    googleTokens: Array,
    sendRequest: [{
        username: {type: String, default: ''}
    }],
    request: [{
        userId: {type: ObjectId, ref: 'User'},
        username:  {type: String, default: ''}
    }],
    friendsList: [{
        friendId: {type: ObjectId, ref: 'User'},
        friendName: {type: String, default: ''}
    }],
    totalRequest: {type: Number, default: 0}
});

userSchema.methods = {
    encryptPassword: function (textPlain) {
        return bcrypt.hashSync(textPlain, bcrypt.genSaltSync(10));
    },

    validUserPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
    }
}

const User = mongoose.model("User", userSchema);

module.exports = User;