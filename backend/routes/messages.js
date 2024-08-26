const router = require('express').Router()
const Chat = require('../models/Chat')
const Message = require('../models/Message')

router.post('/:chatId',async (req, res) => {
    try {
      const chat = await Chat.findOne({
        _id: req.params.chatId,
        userIDs: { $in: [req.user._id] }
      });
  
      if (!chat) {
        return res.status(404).json('Chat not found');
      }
  
      const message = new Message({
        chatId: req.params.chatId,
        text: req.body.text,
        senderId:req.user._id
      });
  
      await message.save();
  
      // Update chat's last message and seenBy
      chat.lastMessage = req.body.text;
      chat.seenBy = [req.user._id];
      chat.messages.push(message._id);
      await chat.save();
  
      res.status(200).json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json('Internal Server Error');
    }
  });
  
  module.exports= router