const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const GroupMessageSchema = mongoose.Schema({
    senderId: {type: Object, ref: 'User'},
    name: String,
    body: String,
    created: {type: Date, default: Date.now}
});

const GroupMessage = mongoose.model("GroupMessage", GroupMessageSchema);

module.exports = GroupMessage;