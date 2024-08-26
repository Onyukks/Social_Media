const router = require('express').Router()
const Chat = require('../models/Chat')
const User = require('../models/user')

router.get('/allchats', async (req, res) => {
  try {
    const chats = await Chat.find({
      userIDs: { $in: [req.user._id] }
    }).lean(); 
    const updatedChats = await Promise.all(chats.map(async (chat) => {
      const receiverId = chat.userIDs.find(id => id.toString() !== req.user._id.toString());
      const receiver = await User.findById(receiverId).select('_id name username profilePic');
      return {
        ...chat,
        receiver: receiver 
      };
    }));

    res.status(200).json(updatedChats);
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal Server Error');
  }
});

router.post('/addchat', async (req, res) => {
  try {
     const receiverID = req.body.receiverID;

     if (req.user._id === receiverID) {
        return res.status(400).json({ message: "Cannot create a chat with yourself" });
     }

     const chat = await Chat.findOne({
        userIDs: { $all: [req.user._id, receiverID] }
     }).populate('messages');

     if (chat) {
        await Chat.findByIdAndUpdate(chat._id, {
          $addToSet:{seenBy:req.user._id}
        });
        return res.status(200).json(chat);
     }

    const newChat = new Chat({
        userIDs: [req.user._id, receiverID],
        messages: [],
        seenBy: [req.user._id]  
     });

     const createdChat = await newChat.save();

     // Populate messages field even if it's empty
     const createdChatWithMessages = await Chat.findById(createdChat._id).populate('messages');

     res.status(201).json(createdChatWithMessages);
  } catch (error) {
     console.log(error);
     res.status(500).json('Internal Server Error');
  }
});
  
  router.put('/readchat/:chatId',async (req, res) => {
    try {
      const chat = await Chat.findOneAndUpdate({
        _id: req.params.chatId,
        userIDs: { $in: [req.user._id] }
      }
      ,{
        $addToSet:{seenBy:req.user._id}
      },{ new: true });
  
      if (!chat) {
        return res.status(404).json('Chat not found');
      }
  
      res.status(200).json(chat);
    } catch (error) {
      console.log(error);
      res.status(500).json('Internal Server Error');
    }
  });
  
 router.get('/notifications',async (req, res) => {
    try {
      const number = await Chat.countDocuments({
        userIDs: { $in: [req.user._id] },
        seenBy: { $ne: req.user._id }
      });
  
      res.status(200).json(number);
    } catch (error) {
      console.log(error);
      res.status(500).json('Internal Server Error');
    }
  });
  
module.exports = router