const mongoose  = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = mongoose.Schema({
    message: String,
    sender: {type: ObjectId, ref: 'User'},
    receiver: {type: ObjectId, ref: 'User'},
    senderName: String,
    receiverName: String,
    userImage: {type: String, deafult: 'https://placehold.it/300x300'},
    isRead: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;