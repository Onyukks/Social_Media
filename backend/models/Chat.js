const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
},{timestamps:true});

module.exports = mongoose.model('Chat', chatSchema);
